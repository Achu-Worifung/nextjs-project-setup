"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, Plane, Calendar, Users, CreditCard, MapPin } from "lucide-react";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    bookingId: string;
    flightBookingId: string;
    flightNumber: string;
    airline: string;
    route: string;
    departureTime: string;
    flightClass: string;
    numberOfSeats: number;
    totalPaid: number;
    status: string;
  } | null;
}

export function BookingSuccessModal({
  isOpen,
  onClose,
  booking
}: BookingSuccessModalProps) {
  if (!isOpen || !booking) return null;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDateTime = (dateTimeString: string) => {
    try {
      return new Date(dateTimeString).toLocaleString();
    } catch {
      return dateTimeString;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Card className="relative w-full max-w-lg mx-auto shadow-2xl border-0 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Success Header */}
        <CardHeader className="text-center pb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white/50"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your flight has been successfully booked
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Booking Reference */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
            <p className="text-lg font-mono font-semibold text-gray-900 select-all">
              {booking.bookingId.split('-')[0].toUpperCase()}
            </p>
          </div>

          {/* Flight Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {booking.airline} {booking.flightNumber}
                </p>
                <p className="text-sm text-gray-600">{booking.route}</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {booking.status}
              </Badge>
            </div>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Departure</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(booking.departureTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Passengers</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.numberOfSeats} × {booking.flightClass}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Total Paid</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(booking.totalPaid)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Browsing
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would navigate to bookings page
                onClose();
              }}
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              View Bookings
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              Confirmation email sent to your registered address
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
