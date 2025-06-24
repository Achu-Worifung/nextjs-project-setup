// app/api/v1/cars/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {
    pickupLatitude,
    pickupLongitude,
    dropoffLatitude,
    dropoffLongitude,
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
  } = await req.json();

  const availableCars = [
    {
      id: "1",
      name: "Toyota Camry",
      pricePerDay: 45,
      image: "/images/camry.jpg",
    },
    {
      id: "2",
      name: "Honda Civic",
      pricePerDay: 40,
      image: "/images/civic.jpg",
    },
  ];

  return NextResponse.json({ cars: availableCars });
}
