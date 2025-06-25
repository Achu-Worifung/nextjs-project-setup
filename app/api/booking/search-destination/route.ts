import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameter from the request
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'man';

    // Make request to Booking.com API
    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '48908b2aa1msh03bf72b996b7b57p1e15c4jsnab9d2c2445ed',
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
      query: query,
    });

  } catch (error) {
    console.error('Error fetching destination data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method if needed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || 'man';

    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '48908b2aa1msh03bf72b996b7b57p1e15c4jsnab9d2c2445ed',
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
      query: query,
    });

  } catch (error) {
    console.error('Error fetching destination data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
