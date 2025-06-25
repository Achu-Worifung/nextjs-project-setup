
export async function signup(
  email: string,
  password: string,
  firstName: string,
  lastName: string
)
{
      const client = new pg.Client({
    user: "classProject",
    host: "classproject.postgres.database.azure.com",
    database: "postgres",
    password: "Youtuber47",
    port: "5432",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });
}