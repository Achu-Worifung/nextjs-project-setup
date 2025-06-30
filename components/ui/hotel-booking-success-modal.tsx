"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { HotelBooking } from '@/lib/booking-service';
import { CheckCircle, MapPin, Calendar, Users, Bed, Star, X } from 'lucide-react';

interface HotelBookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: HotelBooking | null;
}

export function HotelBookingSuccessModal({
  isOpen,
  onClose,
  booking,
}: HotelBookingSuccessModalProps) {
  if (!booking || !isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDuration = () => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center p-6">
          {/* Success Animation */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hotel Booking Confirmed! 🎉
          </h2>
          <p className="text-gray-600 mb-8">
            Your hotel reservation has been successfully booked. A confirmation email has been sent to your inbox.
          </p>

          {/* Booking Details Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {booking.hotelName}
              </h3>
              {booking.hotelRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{booking.hotelRating}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Location */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{booking.location}</p>
                </div>
              </div>

              {/* Room Type */}
              <div className="flex items-center gap-3">
                <Bed className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Room Type</p>
                  <p className="font-medium">{booking.roomType}</p>
                </div>
              </div>

              {/* Check-in */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                </div>
              </div>

              {/* Check-out */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{getDuration()} night{getDuration() > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Room Description */}
            {booking.roomDescription && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Room Description</p>
                <p className="text-sm text-gray-700">{booking.roomDescription}</p>
              </div>
            )}

            {/* Amenities */}
            {booking.amenities && booking.amenities.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {booking.amenities.slice(0, 6).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {booking.amenities.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{booking.amenities.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Total Cost */}
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Paid:</span>
              <span className="text-2xl font-bold text-green-600">
                ${booking.totalPaid.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Booking Reference */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
            <p className="font-mono text-lg font-semibold text-gray-900">
              {booking.hotelBookingId.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Keep this reference number for your records
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                window.print();
              }}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Print Confirmation
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <span className="text-blue-600 font-medium">support@travelbook.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
