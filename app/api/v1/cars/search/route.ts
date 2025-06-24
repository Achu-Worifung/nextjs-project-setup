import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    pickupLatitude,
    pickupLongitude,
    dropoffLatitude,
    dropoffLongitude,
    pickupDate, // not used by API, but may be later
    dropoffDate,
    pickupTime,
    dropoffTime,
    driverAge = 30,
    currencyCode = "USD",
    location = "US",
  } = await req.json();

  const url = new URL('https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals');
  url.searchParams.append('pick_up_latitude', pickupLatitude);
  url.searchParams.append('pick_up_longitude', pickupLongitude);
  url.searchParams.append('drop_off_latitude', dropoffLatitude);
  url.searchParams.append('drop_off_longitude', dropoffLongitude);
  url.searchParams.append('pick_up_time', pickupTime);
  url.searchParams.append('drop_off_time', dropoffTime);
  url.searchParams.append('driver_age', driverAge.toString());
  url.searchParams.append('currency_code', currencyCode);
  url.searchParams.append('location', location);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '60adf17008msh63e4a1af385166bp1c2d84jsn4e4c2a9332dc',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `RapidAPI error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API request failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
