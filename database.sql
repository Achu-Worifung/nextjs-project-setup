CREATE DATABASE BookingWebsite;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA UsersandPayments;

CREATE TABLE UsersandPayments.Users ( 
UserID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
FirstName VARCHAR(50) NOT NULL,
MiddleName VARCHAR(50) NULL,
LastName VARCHAR(50) NOT NULL,
Email VARCHAR(50) NOT NULL UNIQUE, 
PhoneNumber VARCHAR(20) NOT NULL,
PasswordHash VARCHAR(255) NOT NULL, 
CreatedAt TIMESTAMPTZ NOT NULL, 
UpdatedAt TIMESTAMPTZ NOT NULL
);

CREATE TABLE UsersandPayments.PaymentMethod ( 
PaymentID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
UserID UUID REFERENCES UsersandPayments.Users(UserID),
CardCompany VARCHAR(20) NOT NULL, 
CardNumber VARCHAR (19) NOT NULL,
ExpirationDate VARCHAR(7) NOT NULL CHECK (
ExpirationDate ~ '^(0[1-9]|1[0-2])/20[0-9]{2}$'),
Details JSONB NOT NULL,
IsDefault BOOLEAN
);

CREATE SCHEMA Flights;

CREATE TABLE Flights.Airlines (
AirlineID UUID PRIMARY KEY DEFAULT gen_random_uuid (), 
AirlineName VARCHAR (100) NOT NULL, 
AirlineCode VARCHAR (10) NOT NULL, 
AirlineCountry VARCHAR (100) NOT NULL )
;

CREATE TYPE Airport_city_country AS (city TEXT, country TEXT);

CREATE TABLE Flights.Airports (
AirportID UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
AirportName VARCHAR (100) NOT NULL, 
AirportCode VARCHAR (10) NOT NULL,
AirportLocation Airport_city_country NOT NULL
);

CREATE TABLE Flights.FlightRoutes (
RouteD UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
AirlineID UUID NOT NULL REFERENCES Flights.Airlines(AirlineID), 
FlightNumber VARCHAR (10) NOT NULL,
OriginAirportID UUID NOT NULL REFERENCES Flights.Airports(AirportID), 
DestinationAirportID UUID NOT NULL REFERENCES Flights.Airports(AirportID)
);

CREATE TABLE Flights.FlightSchedules (
ScheduleID UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
RouteID UUID NOT NULL REFERENCES Flights.FlightRoutes(RouteID), 
DepatureDateTime TIMESTAMPTZ NOT NULL, 
ArrivalDateTime TIMESTAMPTZ NOT NULL 
);

CREATE TYPE seat_class AS ENUM( 'Economy', 'Premium Economy', 'Business', 'First');

CREATE TABLE Flights.FlightInventory (
InventoryID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
ScheduleID UUID NOT NULL REFERENCES Flights.FlightSchedules (ScheduleID), 
SeatClass seat_class NOT NULL,
TotalSeats INTEGER NOT NULL CHECK (TotalSeats › 0), AvailableSeats INTEGER NOT NULL CHECK (AvailableSeats ›= 0 AND AvailableSeats <= TotalSeats),
UNIQUE (ScheduleID, SeatClass)
);

CREATE TYPE flight_checkin AS ENUM('Checked In', 'Pending', 'Canceled');

CREATE TABLE Flights.FlightBookings (
FlightBookingID UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
UserID UUID NOT NULL REFERENCES UsersandPayments.Users(UserID),
InventoryID UUID NOT NULL REFERENCES Flights.FlightInventory(InventoryID),
NumberSeats INTEGER NOT NULL,
SeatPrice DECIMAL (10,2) NOT NULL, 
BookingDateTime TIMESTAMPTZ NOT NULL,
FlightCheckInStatus flight_checkin NOT NULL
);

CREATE SCHEMA Hotel;

CREATE TABLE Hotel.Hotels (
PropertyID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
HotelName VARCHAR (100) NOT NULL,
HotelAddress VARCHAR(255) NOT NULL,
HotelCity VARCHAR(100) NOT NULL,
HotelCountry VARCHAR(100) NOT NULL,
HotelRating DECIMAL (2,1) NULL
);

CREATE TABLE Hotel.RoomTypes (
RoomID UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
PropertyID UUID NOT NULL REFERENCES Hotel.Hotels(PropertyID),
RoomType VARCHAR(50) NOT NULL, 
MaxOccupancy INTEGER NOT NULL,
RoomDescription TEXT NULL 
);

CREATE TABLE Hotel.RoomInventory (
InventoryID UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
PropertyID UUID NOT NULL REFERENCES Hotel.Hotels(PropertyID), 
RoomID UUID NOT NULL REFERENCES Hotel.RoomTypes(RoomID), 
DatesAvailable DATE NOT NULL, 
DatesUnavailable DATE NOT NULL, 
BasePrice DECIMAL (10,2) NOT NULL
);

CREATE TYPE hotel_checkin AS ENUM( 'Checked In', 'Pending', 'Canceled');

CREATE TABLE Hotel.HotelBookings (
HotelBookingID UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
UserID UUID NOT NULL REFERENCES UsersandPayments.Users(UserID),
InventoryID UUID NOT NULL REFERENCES Hotel.RoomInventory (InventoryID), 
CheckInDate DATE NOT NULL, 
CheckOutDate DATE NOT NULL,
Nights INTEGER NOT NULL, 
Guests INTEGER NOT NULL,
Discounts DECIMAL (10,2) NULL,
BasePrice DECIMAL (10,2) NOT NULL,
Tax DECIMAL (10,2) NOT NULL,
Totalprice DECIMAL (10,2) NOT NULL,
HotelCheckInStatus hotel_checkin NOT NULL,
BookingDateTime TIMESTAMPTZ NOT NULL
);

CREATE SCHEMA Cars;

CREATE TABLE Cars.RentalCompanies (
CompanyID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
CompanyName VARCHAR(100) NOT NULL
);

CREATE TABLE Cars.RentalLocations (
LocationID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
CompanyID UUID NOT NULL REFERENCES Cars.RentalCompanies (Company ID), 
LocationName VARCHAR (100) NOT NULL, 
CompanyAddress VARCHAR (255) NOT NULL,
CompanyCity VARCHAR(100) NOT NULL, 
CompanyCountry VARCHAR (100) NOT NULL,
CompanyRating DECIMAL (2,1) NULL
);

CREATE TABLE Cars.CarModels (
ModelID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
CompanyID UUID NOT NULL REFERENCES Cars.RentalCompanies (CompanyID), 
Make VARCHAR(50) NOT NULL, 
Model VARCHAR(50) NOT NULL,
Year INTEGER NOT NULL
);

CREATE TABLE Cars.CarInventory (
InventoryID UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
CompanyID UUID NOT NULL REFERENCES Cars.RentalCompanies(CompanyID), 
ModelID UUID NOT NULL REFERENCES Cars.CarModels (ModelID), 
DatesAvailable DATE NOT NULL, 
DatesUnavailable DATE NOT NULL, 
DailyPrice DECIMAL (10,2) NOT NULL
);

CREATE TYPE car_checkin AS ENUM('Checked In', 'Pending', 'Canceled');

CREATE TABLE Cars.CarBookings (
CarBookingID UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
UserID UUID NOT NULL REFERENCES UsersandPayments.Users(UserID), 
InventoryID UUID NOT NULL REFERENCES Cars.CarInventory(InventoryID), 
PickupDate DATE NOT NULL, 
DropoffDate DATE NOT NULL,
Days INTEGER NOT NULL,
PickupLocation UUID NOT NULL REFERENCES Cars.RentalLocations(LocationID), 
DropoffLocation UUID NOT NULL REFERENCES Cars.RentalLocations(LocationID), 
Price DECIMAL(10,2) NOT NULL,
NumberPassengers INTEGER NOT NULL,
Carcheckinstatus car_checkin NOT NULL,
CarBookingDateTime TIMESTAMPTZ NOT NULL
);

CREATE SCHEMA ManageBookings;

CREATE TYPE booking_type AS ENUM('Flight', 'Hotel', 'Car');

CREATE TYPE booking_status AS ENUM('Paid', 'Pending', 'Refunded');

CREATE TABLE ManageBookings.Bookings( 
BookingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
PaymentID UUID NOT NULL REFERENCES UsersandPayments.PaymentMethod(PaymentID), 
UserID UUID NOT NULL REFERENCES UsersandPayments.Users(UserID), 
BookingType booking_type NOT NULL, 
BookingStatus booking_status NOT NULL,
TotalPaid DECIMAL(10,2) NOT NULL
);

