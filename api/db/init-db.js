import Database from "better-sqlite3";

const db = new Database("universities.db");

db.exec(`
CREATE TABLE IF NOT EXISTS universities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  deadline TEXT
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  university_id TEXT NOT NULL,
  program TEXT NOT NULL,
  FOREIGN KEY (university_id) REFERENCES universities(id)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS requirements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  university_id TEXT NOT NULL,
  requirement TEXT NOT NULL,
  FOREIGN KEY (university_id) REFERENCES universities(id)
);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  university_id TEXT NOT NULL,
  type TEXT NOT NULL,   -- "apply" or "admissions"
  url TEXT NOT NULL,
  FOREIGN KEY (university_id) REFERENCES universities(id)
);
`)

console.log("✅ universities.db initialized!");
