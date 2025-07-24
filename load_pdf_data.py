import psycopg2
import pandas as pd
import random
from datetime import datetime, timedelta

# Mock data generation functions
cities = {
    "New York": "USA", "London": "UK", "Paris": "France",
    "Tokyo": "Japan", "Sydney": "Australia", "Rio de Janeiro": "Brazil",
    "Cairo": "Egypt", "Cape Town": "South Africa", "Moscow": "Russia",
    "Dubai": "UAE", "Mumbai": "India", "Toronto": "Canada"
}
start_date = datetime(2025, 7, 1)
end_date = datetime(2025, 12, 31)
peak_months = {7, 8, 12}
airlines = ["Delta Air Lines", "Emirates", "South African Airways", "British Airways", "Air Canada"]
car_base_rates = {"Economy": 30, "Compact": 40, "SUV": 70, "Luxury": 120, "Van": 90}

def make_flights():
    rows = []
    rows.append([
        "USA", "New York", "UK", "London",
        datetime(2025, 8, 1).date(), datetime(2025, 8, 8).date(),
        "Delta Air Lines", "DL123", 720, 540, 0
    ])
    for o_city, o_country in cities.items():
        for d_city, d_country in cities.items():
            if o_city == d_city: continue
            dep = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
            ret = dep + timedelta(days=random.randint(3, 14))
            airline = random.choice(airlines)
            num = f"{airline.split()[0][:2].upper()}{random.randint(100,999)}"
            base = random.randint(300, 1500)
            mult = 1.2 if dep.month in peak_months else 1.0
            adult = round(base * mult)
            child = round(adult * 0.75)
            stops = random.randint(0, 2)
            rows.append([o_country, o_city, d_country, d_city, dep.date(), ret.date(), airline, num, adult, child, stops])
    return pd.DataFrame(rows, columns=[
        "Origin Country","Origin City","Destination Country","Destination City",
        "Departure Date","Return Date","Airline","Flight Number","Adult Price","Child Price","Number of Stops"
    ])

def make_cars():
    rows = []
    rows.append([
        "UK", "London", "Economy",
        datetime(2025, 8, 1).date(), datetime(2025, 8, 8).date(),
        252, 70
    ])
    for city, country in cities.items():
        for ctype, rate in car_base_rates.items():
            for _ in range(3):
                start = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
                dur = random.randint(1,10)
                end = start + timedelta(days=dur)
                mult = 1.2 if start.month in peak_months else 1.0
                adult = round(rate * mult * dur)
                child = dur * 10
                rows.append([country, city, ctype, start.date(), end.date(), adult, child])
    return pd.DataFrame(rows, columns=[
        "Country","City","Car Type","Rental Start","Rental End","Adult Price","Child Price"
    ])

def make_hotels():
    rows = []
    rows.append([
        "UK", "London", "London Grand Hotel",
        datetime(2025, 8, 1).date(), datetime(2025, 8, 8).date(),
        180, 90
    ])
    for city, country in cities.items():
        names = [f"{city} Grand Hotel", f"{city} Inn", f"{city} Suites", f"{city} Plaza", f"{city} Palace"]
        for name in names:
            for _ in range(3):
                ci = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
                nights = random.randint(1,7)
                co = ci + timedelta(days=nights)
                base = random.randint(80, 300)
                mult = 1.2 if ci.month in peak_months else 1.0
                a_rate = round(base * mult)
                c_rate = round(a_rate * 0.5)
                rows.append([country, city, name, ci.date(), co.date(), a_rate, c_rate])
    return pd.DataFrame(rows, columns=[
        "Country","City","Hotel Name","Check-in","Check-out","Adult Price Per Night","Child Price Per Night"
    ])

flight_df = make_flights()
car_df = make_cars()
hotel_df = make_hotels()

# Map airports for flights
airport_mapping = {
    "New York": ("John F. Kennedy International Airport", "JFK"),
    "London": ("Heathrow Airport", "LHR"),
    "Paris": ("Charles de Gaulle Airport", "CDG"),
    "Tokyo": ("Narita International Airport", "NRT"),
    "Sydney": ("Sydney Kingsford Smith Airport", "SYD"),
    "Rio de Janeiro": ("Galeão International Airport", "GIG"),
    "Cairo": ("Cairo International Airport", "CAI"),
    "Cape Town": ("Cape Town International Airport", "CPT"),
    "Moscow": ("Sheremetyevo International Airport", "SVO"),
    "Dubai": ("Dubai International Airport", "DXB"),
    "Mumbai": ("Chhatrapati Shivaji Maharaj International Airport", "BOM"),
    "Toronto": ("Toronto Pearson International Airport", "YYZ"),
}

# Database connection
conn = psycopg2.connect(
    dbname="postgres",
    user="classProject",
    password="Youtuber47",
    host="classproject.postgres.database.azure.com",
    port="5432",
    sslmode="require"
)
cursor = conn.cursor()

# Clear existing data
cursor.execute("DELETE FROM Flights.FlightInventory")
cursor.execute("DELETE FROM Flights.FlightSchedules")
cursor.execute("DELETE FROM Flights.FlightRoutes")
cursor.execute("DELETE FROM Flights.Airlines")
cursor.execute("DELETE FROM Flights.Airports")
cursor.execute("DELETE FROM Cars.CarInventory")
cursor.execute("DELETE FROM Cars.RentalLocations")
cursor.execute("DELETE FROM Cars.CarModels")
cursor.execute("DELETE FROM Cars.RentalCompanies")
cursor.execute("DELETE FROM Hotel.RoomInventory")
cursor.execute("DELETE FROM Hotel.RoomTypes")
cursor.execute("DELETE FROM Hotel.Hotels")

# Insert Rental Companies
cursor.execute(
    """
    INSERT INTO Cars.RentalCompanies (CompanyName)
    VALUES ('Generic Rental Co.') ON CONFLICT DO NOTHING
    RETURNING CompanyID
    """
)
company_id = cursor.fetchone()[0] if cursor.rowcount > 0 else cursor.execute(
    "SELECT CompanyID FROM Cars.RentalCompanies WHERE CompanyName = 'Generic Rental Co.'"
) or cursor.fetchone()[0]

# Insert Rental Locations
locations = {}
for _, row in car_df.iterrows():
    location_key = (row["Country"], row["City"])
    if location_key not in locations:
        cursor.execute(
            """
            INSERT INTO Cars.RentalLocations (CompanyID, LocationName, CompanyAddress, CompanyCity, CompanyCountry)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING LocationID
            """,
            (company_id, f"{row['City']} Airport", "Unknown Address", row["City"], row["Country"])
        )
        locations[location_key] = cursor.fetchone()[0]

# Insert Car Models
models = {}
for ctype in car_df["Car Type"].unique():
    cursor.execute(
        """
        INSERT INTO Cars.CarModels (CompanyID, Make, Model, Year, CarType)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING ModelID
        """,
        (company_id, "Generic", ctype, 2023, ctype)
    )
    models[ctype] = cursor.fetchone()[0]

# Insert Car Inventory
for _, row in car_df.iterrows():
    days = (row["Rental End"] - row["Rental Start"]).days
    daily_price = row["Adult Price"] / days if days > 0 else row["Adult Price"]
    cursor.execute(
        """
        INSERT INTO Cars.CarInventory (CompanyID, ModelID, LocationID, DatesAvailable, DatesUnavailable, DailyPrice, ChildPrice)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (
            company_id,
            models[row["Car Type"]],
            locations[(row["Country"], row["City"])],
            row["Rental Start"],
            row["Rental End"],
            daily_price,
            row["Child Price"]
        )
    )

# Insert Hotels
hotels = {}
for _, row in hotel_df.iterrows():
    hotel_key = (row["Country"], row["City"], row["Hotel Name"])
    if hotel_key not in hotels:
        cursor.execute(
            """
            INSERT INTO Hotel.Hotels (HotelName, HotelAddress, HotelCity, HotelCountry)
            VALUES (%s, %s, %s, %s)
            RETURNING PropertyID
            """,
            (row["Hotel Name"], "Unknown Address", row["City"], row["Country"])
        )
        hotels[hotel_key] = cursor.fetchone()[0]

# Insert Room Types
room_types = {}
for _, row in hotel_df.iterrows():
    hotel_key = (row["Country"], row["City"], row["Hotel Name"])
    if hotel_key not in room_types:
        cursor.execute(
            """
            INSERT INTO Hotel.RoomTypes (PropertyID, RoomType, MaxOccupancy)
            VALUES (%s, %s, %s)
            RETURNING RoomID
            """,
            (hotels[hotel_key], "Standard", 4)
        )
        room_types[hotel_key] = cursor.fetchone()[0]

# Insert Room Inventory
for _, row in hotel_df.iterrows():
    hotel_key = (row["Country"], row["City"], row["Hotel Name"])
    cursor.execute(
        """
        INSERT INTO Hotel.RoomInventory (PropertyID, RoomID, DatesAvailable, DatesUnavailable, BasePrice, ChildPricePerNight)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            hotels[hotel_key],
            room_types[hotel_key],
            row["Check-in"],
            row["Check-out"],
            row["Adult Price Per Night"],
            row["Child Price Per Night"]
        )
    )

# Insert Airlines
airlines_dict = {}
for _, row in flight_df.iterrows():
    airline_key = (row["Airline"], row["Airline"])
    if airline_key not in airlines_dict:
        cursor.execute(
            """
            INSERT INTO Flights.Airlines (AirlineName, AirlineCode, AirlineCountry)
            VALUES (%s, %s, %s)
            RETURNING AirlineID
            """,
            (row["Airline"], row["Airline"][:2].upper(), cities[row["Destination City"]])
        )
        airlines_dict[airline_key] = cursor.fetchone()[0]

# Insert Airports
airports = {}
for _, row in flight_df.iterrows():
    for city, country in [(row["Origin City"], row["Origin Country"]), (row["Destination City"], row["Destination Country"])]:
        airport_key = (city, country)
        if airport_key not in airports:
            airport_name, airport_code = airport_mapping[city]
            cursor.execute(
                """
                INSERT INTO Flights.Airports (AirportName, AirportCode, AirportLocation)
                VALUES (%s, %s, %s)
                RETURNING AirportID
                """,
                (airport_name, airport_code, (city, country))
            )
            airports[airport_key] = cursor.fetchone()[0]

# Insert Flight Routes
routes = {}
for _, row in flight_df.iterrows():
    route_key = (row["Airline"], row["Flight Number"], row["Origin City"], row["Destination City"])
    if route_key not in routes:
        cursor.execute(
            """
            INSERT INTO Flights.FlightRoutes (AirlineID, FlightNumber, OriginAirportID, DestinationAirportID, numberOfStops)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING RouteID
            """,
            (
                airlines_dict[(row["Airline"], row["Airline"])],
                row["Flight Number"],
                airports[(row["Origin City"], row["Origin Country"])],
                airports[(row["Destination City"], row["Destination Country"])],
                row["Number of Stops"]
            )
        )
        routes[route_key] = cursor.fetchone()[0]

# Insert Flight Schedules
schedules = {}
for _, row in flight_df.iterrows():
    schedule_key = (row["Flight Number"], row["Departure Date"])
    if schedule_key not in schedules:
        dep_datetime = datetime.combine(row["Departure Date"], datetime.strptime("14:00", "%H:%M").time())
        duration_hours = random.randint(2, 15)
        arr_datetime = dep_datetime + timedelta(hours=duration_hours)
        cursor.execute(
            """
            INSERT INTO Flights.FlightSchedules (RouteID, DepatureDateTime, ArrivalDateTime)
            VALUES (%s, %s, %s)
            RETURNING ScheduleID
            """,
            (
                routes[(row["Airline"], row["Flight Number"], row["Origin City"], row["Destination City"])],
                dep_datetime,
                arr_datetime,
            )
        )
        schedules[schedule_key] = cursor.fetchone()[0]

# Insert Flight Inventory
for _, row in flight_df.iterrows():
    schedule_key = (row["Flight Number"], row["Departure Date"])
    seat_classes = [
        {"class": "Economy", "total_seats": 150, "available_seats": 50, "price": row["Adult Price"]},
        {"class": random.choice(["Business", "Premium Economy", "First"]), "total_seats": 20, "available_seats": 10, "price": row["Adult Price"] * 2},
    ]
    for seat_class in seat_classes:
        cursor.execute(
            """
            INSERT INTO Flights.FlightInventory (ScheduleID, SeatClass, TotalSeats, AvailableSeats, SeatPrice)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                schedules[schedule_key],
                seat_class["class"],
                seat_class["total_seats"],
                seat_class["available_seats"],
                seat_class["price"]
            )
        )

# Commit and close
conn.commit()
cursor.close()
conn.close()
print("All mock travel data loaded successfully!")