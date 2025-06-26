import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pg from "pg";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  const {
    firstName,
    middleName = "",
    lastName,
    email,
    password,
  } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

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

  let userId;
  try {
    console.log("Attempting database connection with SSL config:", {
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      port: Number(process.env.PGPORT) || 5432,
      ssl: "REQUIRED",
    });

    await client.connect();
    console.log("Database connected successfully with SSL");

    // Check if user already exists
    const checkUserQuery =
      "SELECT userid FROM usersandpayments.users WHERE email = $1";
    const existingUser = await client.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const query = `
      INSERT INTO usersandpayments.users
        (firstname, middlename, lastname, email, passwordhash, createdat, updatedat)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING userid
    `;
    const values = [
      firstName,
      middleName || null,
      lastName,
      email,
      hashedPassword,
      new Date(),
      new Date(),
    ];

    // 🔧 FIX: Capture the result and extract userId
    const result = await client.query(query, values);
    userId = result.rows[0].userid;
    console.log("User created with ID:", userId);
    
  } catch (error: any) {
    console.error("Database operation failed:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });

    // Return specific error messages based on error type
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          error:
            "Database server is not reachable. Please check your connection.",
        },
        { status: 503 }
      );
    } else if (error.code === "ENOTFOUND") {
      return NextResponse.json(
        {
          error:
            "Database host not found. Please check your PGHOST environment variable.",
        },
        { status: 503 }
      );
    } else if (error.code === "28P01") {
      return NextResponse.json(
        {
          error:
            "Invalid database credentials. Please check your username and password.",
        },
        { status: 503 }
      );
    } else if (error.code === "28000") {
      return NextResponse.json(
        {
          error:
            "SSL connection required or host not allowed. Check your database SSL settings.",
        },
        { status: 503 }
      );
    } else if (error.code === "3D000") {
      return NextResponse.json(
        {
          error:
            "Database does not exist. Please check your PGDATABASE environment variable.",
        },
        { status: 503 }
      );
    } else if (error.code === "23505") {
      return NextResponse.json(
        {
          error: "User with this email already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Database operation failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    try {
      await client.end();
      console.log("Database connection closed");
    } catch (closeError) {
      console.error("Error closing database connection:", closeError);
    }
  }

  // 🔧 FIX: Check if userId exists before generating token
  if (!userId) {
    console.error("User ID not found after database insertion");
    return NextResponse.json(
      { error: "User creation failed - no user ID returned" },
      { status: 500 }
    );
  }

  // Generate JWT token
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const token = jwt.sign(
      {
        userid: userId,
        firstName,
        lastName,
        email,
      },
      JWT_SECRET
      
    );

    console.log("User signup completed successfully for:", email);

    return NextResponse.json(
      {
        message: "User signed up successfully",
        token,
        user: {
          userid: userId,
          firstName,
          lastName,
          email,
        },
      },
      { status: 201 }
    );
  } catch (jwtError) {
    console.error("JWT generation failed:", jwtError);
    return NextResponse.json(
      { error: "Token generation failed" },
      { status: 500 }
    );
  }
}