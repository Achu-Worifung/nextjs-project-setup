import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/booking/search-hotels - Request received');
    
    const body = await request.json();
    console.log('📋 Request body:', body);
    
    const {
      dest_id,
      search_type = 'CITY',
      adults = 1,
      children_age = '0,17',
      room_qty = 1,
      page_number = 1,
      units = 'metric',
      temperature_unit = 'c',
      languagecode = 'en-us',
      currency_code = 'USD',
      arrival_date = '2025-06-24',
      departure_date = '2025-07-25'
    } = body;

    // Validate required parameters
    if (!dest_id) {
      console.error('Missing dest_id parameter');
      return NextResponse.json(
        { success: false, error: 'dest_id is required' },
        { status: 400 }
      );
    }

    // Construct the API URL
    const apiUrl = new URL('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels');
    apiUrl.searchParams.append('dest_id', dest_id.toString());
    apiUrl.searchParams.append('search_type', search_type.toString());
    apiUrl.searchParams.append('adults', adults.toString());
    apiUrl.searchParams.append('children_age', children_age.toString());
    apiUrl.searchParams.append('room_qty', room_qty.toString());
    apiUrl.searchParams.append('page_number', page_number.toString());
    apiUrl.searchParams.append('units', units.toString());
    apiUrl.searchParams.append('temperature_unit', temperature_unit.toString());
    apiUrl.searchParams.append('languagecode', languagecode.toString());
    apiUrl.searchParams.append('currency_code', currency_code.toString());
    apiUrl.searchParams.append('arrival_date', arrival_date.toString());
    apiUrl.searchParams.append('departure_date', departure_date.toString());

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '48908b2aa1msh03bf72b996b7b57p1e15c4jsnab9d2c2445ed',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    });

    console.log(`response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: `External API error: ${response.status} - ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }    const data = await response.json();
    console.log('📦 Full External API response:', JSON.stringify(data, null, 2));
    console.log('📦 External API response structure:', {
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
      status: data?.status,
      message: data?.message,
      hotelsCount: data?.data?.hotels?.length || data?.hotels?.length || 0
    });
    
    // Check if API returned an error - fix the logic here
    if (data?.status === false || (data?.status !== true && data?.message && data?.message.toLowerCase().includes('error'))) {
      console.error('🚨 API returned error:', data?.message || data?.status);
      return NextResponse.json(
        { 
          success: false, 
          error: `API Error: ${data?.message || data?.status}`,
          apiResponse: data
        },
        { status: 400 }
      );
    }
    
    // Extract hotels from the response - the API seems to return data.data.hotels
    const hotels = data?.data?.hotels || data?.hotels || data?.results || [];
    const total = data?.data?.total_count || data?.total_count || data?.total || hotels.length;
    
    console.log(` Returning ${hotels.length} hotels`);
    
    return NextResponse.json({
      success: true,
      data: hotels,
      total: total,
      dest_id: dest_id,
    });

  } catch (error) {
    console.error('💥 Unexpected error in POST /api/booking/search-hotels:', error);
    console.error('📊 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        type: error instanceof Error ? error.name : 'UnknownError'
      },
      { status: 500 }
    );
  }
}

// Optional GET method for direct URL parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const dest_id = searchParams.get('dest_id');
    if (!dest_id) {
      return NextResponse.json(
        { success: false, error: 'dest_id is required' },
        { status: 400 }
      );
    }

    const search_type = searchParams.get('search_type') || 'city';
    const adults = searchParams.get('adults') || '1';
    const children_age = searchParams.get('children_age') || '0,17';
    const room_qty = searchParams.get('room_qty') || '1';
    const page_number = searchParams.get('page_number') || '1';
    const units = searchParams.get('units') || 'metric';
    const temperature_unit = searchParams.get('temperature_unit') || 'c';
    const languagecode = searchParams.get('languagecode') || 'en-us';
    const currency_code = searchParams.get('currency_code') || 'USD';

    // Construct the API URL
    const apiUrl = new URL('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels');
    apiUrl.searchParams.append('dest_id', dest_id);
    apiUrl.searchParams.append('search_type', search_type);
    apiUrl.searchParams.append('adults', adults);
    apiUrl.searchParams.append('children_age', children_age);
    apiUrl.searchParams.append('room_qty', room_qty);
    apiUrl.searchParams.append('page_number', page_number);
    apiUrl.searchParams.append('units', units);
    apiUrl.searchParams.append('temperature_unit', temperature_unit);
    apiUrl.searchParams.append('languagecode', languagecode);
    apiUrl.searchParams.append('currency_code', currency_code);

    // Make request to Booking.com API
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '48908b2aa1msh03bf72b996b7b57p1e15c4jsnab9d2c2445ed',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data?.data?.hotels || [],
      total: data?.data?.total_count || 0,
      dest_id: dest_id,
    });

  } catch (error) {
    console.error('Error fetching hotels:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
