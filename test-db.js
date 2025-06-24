import pg from "pg";

export async function updateMenuItem() {
  const client = new pg.Client({
    user: "classProject",
    host: "classproject.postgres.database.azure.com",
    database: "postgres",
    password: "Youtuber47",
    port: "5432",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });

  try {
    console.log("→ connecting to database…");
    await client.connect();
    console.log("✅ connected");

    const query = "SELECT * FROM flights.airlines;";
    const result = await client.query(query);
    console.log("📋 rows returned:", result.rows);

  } catch (err) {
    console.error("❌ database error:", err);
  } finally {
    await client.end();
    console.log("🔒 connection closed");
  }
}

// invoke it:
updateMenuItem().catch(err => {
  console.error('Unhandled:', err);
  process.exit(1);
});