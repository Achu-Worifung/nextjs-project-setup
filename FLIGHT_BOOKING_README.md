# Flight Booking System

This travel booking application now includes a complete flight booking system with JWT authentication.

## Features

### 🔐 Authentication Required Booking
- Users must be signed in to book flights
- Beautiful modal prompts for authentication when not signed in
- Options to sign in or sign up directly from the booking flow

### ✈️ Flight Booking Process
1. **Browse Flights**: Users can search and view available flights
2. **Flight Details**: Click on any flight card to open detailed information
3. **Class Selection**: Choose from Economy, Business, or First class
4. **Seat Selection**: Select number of seats (up to available limit)
5. **Book Flight**: Complete booking with real-time database integration

### 🎨 UI/UX Improvements
- **Authentication Modal**: Beautiful, modern modal instead of basic alerts
- **Seat Counter**: Interactive seat selection with +/- buttons
- **Real-time Pricing**: Total price updates based on seats and class
- **Booking Status**: Visual feedback during booking process
- **Error Handling**: Clear error messages and validation

## Technical Implementation

### Database Integration
The system integrates with PostgreSQL tables:

- **ManageBookings.Bookings**: Main booking records
- **Flights.FlightBookings**: Flight-specific booking details

### API Endpoints
- `POST /api/bookings/flight`: Create new flight booking
- `GET /api/bookings/flight`: Retrieve user's flight bookings

### Authentication
- JWT token validation
- User ID extraction from tokens
- Secure booking process

### Key Components
- `AuthModal`: Beautiful authentication prompt
- `FlightDetailsDrawer`: Complete booking interface
- `BookingService`: Client-side API integration

## Setup Instructions

1. **Database Setup**:
   ```bash
   # Create your PostgreSQL database using the provided schema
   # Update .env.local with your database credentials
   ```

2. **Environment Variables**:
   ```bash
   cp .env.local.example .env.local
   # Update with your actual database credentials
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Database Schema

The booking system uses two main tables:

### ManageBookings.Bookings
- BookingID (UUID, Primary Key)
- PaymentID (UUID, Foreign Key)
- UserID (UUID, Foreign Key)
- BookingType (ENUM: 'Flight', 'Hotel', 'Car')
- BookingStatus (ENUM: 'Paid', 'Pending', 'Refunded')
- TotalPaid (DECIMAL)

### Flights.FlightBookings
- FlightBookingID (UUID, Primary Key)
- UserID (UUID, Foreign Key)
- InventoryID (UUID, Foreign Key)
- NumberSeats (INTEGER)
- SeatPrice (DECIMAL)
- BookingDateTime (TIMESTAMPTZ)
- FlightCheckInStatus (ENUM: 'Checked In', 'Pending', 'Canceled')

## Security Features

- JWT token validation on all booking endpoints
- Database transactions for data consistency
- Input validation and sanitization
- Secure error handling without exposing sensitive data

## Future Enhancements

- Payment integration (currently uses placeholder payment IDs)
- Real inventory management with flight schedules
- Booking cancellation and modification
- Email confirmation system
- Seat map selection interface
