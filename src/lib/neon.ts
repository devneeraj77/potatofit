import { neon } from "@neondatabase/serverless";

export interface NeonAdmin {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  created_at?: string;
  notes?: string;
  password?: string;
}

const DATABASE_URL = process.env.DATABASE_URL;

export function getNeonSql() {
  if (!DATABASE_URL) {
    return null;
  }
  return neon(DATABASE_URL);
}

export async function initNeonSchema() {
  const sql = getNeonSql();
  if (!sql) return false;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        notes TEXT,
        password TEXT
      );
    `;

    // Ensure password column exists if table was created previously
    try {
      await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS password TEXT;`;
    } catch {
      // Column may already exist
    }

    await sql`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT,
        category_id VARCHAR(100),
        category_name VARCHAR(255),
        cover_image TEXT,
        read_time VARCHAR(50),
        tags TEXT[],
        status VARCHAR(50) DEFAULT 'draft',
        author JSONB,
        views INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        published_at TIMESTAMPTZ
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        color VARCHAR(50) DEFAULT '#f7fe72',
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    return true;
  } catch (err) {
    console.warn("[Neon DB] Schema init caught:", err);
    return false;
  }
}

export async function fetchNeonAdmins(): Promise<NeonAdmin[] | null> {
  const sql = getNeonSql();
  if (!sql) return null;

  try {
    const rows = await sql`
      SELECT id, email, name, role, status, created_at, notes
      FROM admins
      ORDER BY created_at ASC;
    `;
    return rows as NeonAdmin[];
  } catch (err) {
    console.warn("[Neon DB] fetchNeonAdmins caught:", err);
    return null;
  }
}

let schemaInitialized = false;

export async function insertNeonAdmin(admin: NeonAdmin): Promise<boolean> {
  const sql = getNeonSql();
  if (!sql) return false;

  if (!schemaInitialized) {
    await initNeonSchema();
    schemaInitialized = true;
  }

  try {
    await sql`
      INSERT INTO admins (id, email, name, role, status, notes, password)
      VALUES (${admin.id}, ${admin.email.toLowerCase()}, ${admin.name}, ${admin.role}, ${admin.status}, ${admin.notes || ""}, ${admin.password || null})
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        password = COALESCE(EXCLUDED.password, admins.password);
    `;
    return true;
  } catch (err: unknown) {
    const errorObj = err as { code?: string };
    if (errorObj?.code === "42P01") {
      await initNeonSchema();
      try {
        await sql`
          INSERT INTO admins (id, email, name, role, status, notes, password)
          VALUES (${admin.id}, ${admin.email.toLowerCase()}, ${admin.name}, ${admin.role}, ${admin.status}, ${admin.notes || ""}, ${admin.password || null})
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            status = EXCLUDED.status,
            notes = EXCLUDED.notes,
            password = COALESCE(EXCLUDED.password, admins.password);
        `;
        return true;
      } catch (retryErr) {
        console.warn("[Neon DB] insertNeonAdmin retry error:", retryErr);
        return false;
      }
    }
    console.warn("[Neon DB] insertNeonAdmin caught:", err);
    return false;
  }
}

export async function deleteNeonAdmin(email: string): Promise<boolean> {
  const sql = getNeonSql();
  if (!sql) return false;

  try {
    await sql`
      DELETE FROM admins WHERE LOWER(email) = LOWER(${email.trim()});
    `;
    return true;
  } catch (err) {
    console.warn("[Neon DB] deleteNeonAdmin caught:", err);
    return false;
  }
}
