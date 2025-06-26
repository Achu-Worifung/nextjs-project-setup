import { NextRequest, NextResponse } from "next/server";
import pg from "pg";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;
export async function POST(req: NextRequest)
{
    const {id, email, fName, lName} = await req.json();

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

      try 
      {
        await client.connect();
        //check if an user with the same email already exists
        const checkUserQuery = `SELECT * FROM usersandpayments.users WHERE email = $1`;
        const checkUserValues = [email];
        const checkUserResult = await client.query(checkUserQuery, checkUserValues);
        const user = checkUserResult.rows[0];
        if (user) {
         //if user already exist log them in
          if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return NextResponse.json(
              { error: "Server configuration error" },
              { status: 500 }
            );
          }
          const token = jwt.sign(
            { firstName: user.firstname, lastName: user.lastname, email: user.email },
            JWT_SECRET
          );
          return NextResponse.json({ token }, { status: 200 });
        }
        
        const query = `INSERT INTO usersandpayments.users (firstname, lastname, email, passwordhash, createdat, updatedat ) VALUES ($1, $2, $3, $4, $5, $6)`;
        const values = [fName, lName, email, id, new Date(), new Date()];
        await client.query(query, values);
          // Generate JWT token
          if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return NextResponse.json(
              { error: "Server configuration error" },
              { status: 500 }
            );
          }
            const token = jwt.sign(
                {firstName: fName, lastName: lName, email:email },
                JWT_SECRET
            );
            return NextResponse.json({ token }, { status: 201 });
      } catch (error) {
        console.error("Error during Google sign-up:", error);
        return NextResponse.json(
          { error: "Error during sign-up" },
          { status: 500 }
        );
      } finally {
        await client.end();
      }
}

