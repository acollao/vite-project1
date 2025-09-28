// server.js
import express from "express";
import Database from "better-sqlite3";
import cors from "cors";

const app = express();
const db = new Database("api/universities.db");

app.use(cors());
app.use(express.json());


// 🏫 Get all universities (with nested data)
app.get("/api/universities", (req, res) => {
  const universities = db.prepare(`SELECT * FROM universities`).all();

  const result = universities.map((uni) => {
    const programs = db
      .prepare(`SELECT program FROM programs WHERE university_id = ?`)
      .all(uni.id)
      .map((p) => p.program);

    const requirements = db
      .prepare(`SELECT requirement FROM requirements WHERE university_id = ?`)
      .all(uni.id)
      .map((r) => r.requirement);

    const links = db
      .prepare(`SELECT type, url FROM links WHERE university_id = ?`)
      .all(uni.id)
      .reduce((acc, { type, url }) => {
        acc[type] = url;
        return acc;
      }, {});

    return {
      id: uni.id, // string or autoincrement depending on schema
      name: uni.name,
      location: uni.location,
      deadline: uni.deadline,
      exam: {
        name: uni.exam_name,
        window: uni.exam_window,
      },
      programs,
      requirements,
      links,
    };
  });

  res.json(result);
});


// 🏫 Get all universities (basic info only)
app.get("/api/test", (req, res) => {
  const universities = db.prepare(`SELECT * FROM universities`).all();
  res.json(universities);
});

// 🏫 Get single university (with programs, requirements, links)
app.get("/api/universities/:id", (req, res) => {
  const { id } = req.params;

  const uni = db
    .prepare(`SELECT * FROM universities WHERE id = ?`)
    .get(id);

  if (!uni) {
    return res.status(404).json({ error: "University not found" });
  }

  const programs = db
    .prepare(`SELECT program FROM programs WHERE university_id = ?`)
    .all(id)
    .map((p) => p.program);

  const requirements = db
    .prepare(`SELECT requirement FROM requirements WHERE university_id = ?`)
    .all(id)
    .map((r) => r.requirement);

  const links = db
    .prepare(`SELECT type, url FROM links WHERE university_id = ?`)
    .all(id)
    .reduce((acc, { type, url }) => {
      acc[type] = url;
      return acc;
    }, {});

  // Rebuild JSON format
  const response = {
    id: uni.id,
    name: uni.name,
    location: uni.location,
    deadline: uni.deadline,
    exam: {
      name: uni.exam_name,
      window: uni.exam_window,
    },
    programs,
    requirements,
    links,
  };

  res.json(response);
});


// 🆕 POST - Add new university
app.post("/api/universities", (req, res) => {
  const { name, location, deadline, exam, programs, requirements, links } =
    req.body;

  try {
    // Insert main record
    const result = db.prepare(
      `INSERT INTO universities (name, location, deadline, exam_name, exam_window)
       VALUES (?, ?, ?, ?, ?)`
    ).run(name, location, deadline, exam.name, exam.window);

    const uniId = result.lastInsertRowid; // 👈 generated id

    // Insert related data
    const insertProgram = db.prepare(
      `INSERT INTO programs (university_id, program) VALUES (?, ?)`
    );
    const insertRequirement = db.prepare(
      `INSERT INTO requirements (university_id, requirement) VALUES (?, ?)`
    );
    const insertLink = db.prepare(
      `INSERT INTO links (university_id, type, url) VALUES (?, ?, ?)`
    );

    programs.forEach((p) => insertProgram.run(uniId, p));
    requirements.forEach((r) => insertRequirement.run(uniId, r));
    Object.entries(links).forEach(([type, url]) =>
      insertLink.run(uniId, type, url)
    );

    res.status(201).json({ message: "University added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✏️ PUT - Update university
app.put("/api/universities/:id", (req, res) => {
  const { id } = req.params;
  const { name, location, deadline, exam, programs, requirements, links } =
    req.body;

  const uni = db.prepare(`SELECT * FROM universities WHERE id = ?`).get(id);
  if (!uni) return res.status(404).json({ error: "University not found" });

  try {
    // Update main university
    db.prepare(
      `UPDATE universities
       SET name = ?, location = ?, deadline = ?, exam_name = ?, exam_window = ?
       WHERE id = ?`
    ).run(name, location, deadline, exam.name, exam.window, id);

    // Clear related data
    db.prepare(`DELETE FROM programs WHERE university_id = ?`).run(id);
    db.prepare(`DELETE FROM requirements WHERE university_id = ?`).run(id);
    db.prepare(`DELETE FROM links WHERE university_id = ?`).run(id);

    // Re-insert
    const insertProgram = db.prepare(
      `INSERT INTO programs (university_id, program) VALUES (?, ?)`
    );
    const insertRequirement = db.prepare(
      `INSERT INTO requirements (university_id, requirement) VALUES (?, ?)`
    );
    const insertLink = db.prepare(
      `INSERT INTO links (university_id, type, url) VALUES (?, ?, ?)`
    );

    programs.forEach((p) => insertProgram.run(id, p));
    requirements.forEach((r) => insertRequirement.run(id, r));
    Object.entries(links).forEach(([type, url]) =>
      insertLink.run(id, type, url)
    );

    res.json({ message: "University updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🗑️ DELETE - Remove university
app.delete("/api/universities/:id", (req, res) => {
  const { id } = req.params;

  const uni = db.prepare(`SELECT * FROM universities WHERE id = ?`).get(id);
  if (!uni) return res.status(404).json({ error: "University not found" });

  try {
     // Delete child records first
    db.prepare(`DELETE FROM programs WHERE university_id = ?`).run(id);
    db.prepare(`DELETE FROM requirements WHERE university_id = ?`).run(id);
    db.prepare(`DELETE FROM links WHERE university_id = ?`).run(id);

     // Delete the university
    db.prepare(`DELETE FROM universities WHERE id = ?`).run(id);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  
  res.json({ message: "University deleted successfully" });
});

// 🚀 Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ API server running at http://localhost:${PORT}`);
});
