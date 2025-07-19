// Next.js API route to proxy car booking requests to Car Booking Service
export async function POST(req) {
  try {
    const body = await req.json();
    const token = req.headers.get('authorization');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing Authorization token' }), { status: 401 });
    }
    // Forward booking request to Car Booking Service
    const bookingRes = await fetch('http://localhost:8001/car/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    });
    const bookingData = await bookingRes.json();
    return new Response(JSON.stringify(bookingData), { status: bookingRes.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Booking failed' }), { status: 500 });
  }
}
