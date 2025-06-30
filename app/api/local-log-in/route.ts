import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pg from "pg";
import jwt from "jsonwebtoken";


export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Validate user credentials
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }


  try {
    // Connect to the database
    const client = new pg.Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT) || 5432,
        ssl: {
          rejectUnauthorized: false,
          require: true, 
        },
        connectionTimeoutMillis: 15000,
        query_timeout: 10000,
      });
    await client.connect();

    // Check if user exists
    const userResult = await client.query("SELECT * FROM usersandpayments.users WHERE email = $1", [email]);
    const user = userResult.rows[0];
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordhash);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ 
        userId: user.userid,  
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email
      }, process.env.JWT_SECRET);

    // Respond with token
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}