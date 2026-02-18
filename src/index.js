import express from "express";
import cors from "cors";
import morgan from "morgan";
import crypto from "crypto";
import { initDb, all, get, run } from "./db.js";
import { defaultDoctors } from "./defaultDoctors.js";

const app = express();
const port = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN || "*";
const allowedOrigins = corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);
app.use(express.json());
app.use(morgan("dev"));

initDb();

async function seedDoctorsIfEmpty() {
  const row = await get("SELECT COUNT(*) as count FROM doctors");
  if ((row?.count || 0) > 0) return;

  for (const doctor of defaultDoctors) {
    await run(
      `INSERT INTO doctors (id, name, degree, specialty, address, experience, fee, rating, distance, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctor.id,
        doctor.name,
        doctor.degree,
        doctor.specialty,
        doctor.address,
        doctor.experience,
        doctor.fee,
        doctor.rating,
        doctor.distance,
        doctor.available,
      ]
    );
  }

  console.log(`Seeded default doctors: ${defaultDoctors.length}`);
}

app.get("/", (req, res) => {
  res.json({
    name: "Pratikshalay API",
    version: "1.0.0",
    status: "ok",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/doctors", async (req, res) => {
  try {
    const { q, specialty, sortBy = "distance" } = req.query;
    let query = "SELECT * FROM doctors";
    const params = [];
    const filters = [];

    if (q) {
      filters.push("(name LIKE ? OR specialty LIKE ? OR address LIKE ?)");
      const term = `%${q}%`;
      params.push(term, term, term);
    }

    if (specialty && specialty !== "All") {
      filters.push("specialty = ?");
      params.push(specialty);
    }

    if (filters.length > 0) {
      query += ` WHERE ${filters.join(" AND ")}`;
    }

    if (sortBy === "rating") {
      query += " ORDER BY rating DESC";
    } else {
      query += " ORDER BY distance ASC";
    }

    const doctors = await all(query, params);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

app.post("/api/doctors", async (req, res) => {
  try {
    const {
      id,
      name,
      degree = "",
      specialty = "",
      address = "",
      experience = 0,
      fee = 0,
      rating = 0,
      distance = 0,
      available = "On Request",
    } = req.body;

    if (!id || !name) {
      res.status(400).json({ error: "id and name are required" });
      return;
    }

    await run(
      `INSERT INTO doctors (id, name, degree, specialty, address, experience, fee, rating, distance, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, degree, specialty, address, experience, fee, rating, distance, available]
    );

    res.status(201).json({
      id,
      name,
      degree,
      specialty,
      address,
      experience,
      fee,
      rating,
      distance,
      available,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create doctor" });
  }
});

app.get("/api/doctors/:id", async (req, res) => {
  try {
    const doctor = await get("SELECT * FROM doctors WHERE id = ?", [req.params.id]);
    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
});

app.get("/api/favorites", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    const favorites = await all(
      "SELECT doctor_id FROM favorites WHERE user_id = ?",
      [userId]
    );
    res.json(favorites.map((row) => row.doctor_id));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId = "guest", doctorId } = req.body;
    if (!doctorId) {
      res.status(400).json({ error: "doctorId is required" });
      return;
    }
    await run(
      "INSERT OR IGNORE INTO favorites (user_id, doctor_id) VALUES (?, ?)",
      [userId, doctorId]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

app.delete("/api/favorites/:doctorId", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    await run("DELETE FROM favorites WHERE user_id = ? AND doctor_id = ?", [
      userId,
      req.params.doctorId,
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    const doctorRow = await get("SELECT COUNT(*) as count FROM doctors");
    const bookingRow = await get(
      "SELECT COUNT(*) as count FROM bookings WHERE user_id = ?",
      [userId]
    );
    const ratingRow = await get("SELECT AVG(rating) as avg FROM doctors");
    res.json({
      doctorCount: doctorRow?.count || 0,
      bookingCount: bookingRow?.count || 0,
      avgRating: ratingRow?.avg ? Number(ratingRow.avg.toFixed(1)) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    const bookings = await all(
      `SELECT bookings.*, doctors.name as doctor_name, doctors.specialty as doctor_specialty
       FROM bookings
       LEFT JOIN doctors ON bookings.doctor_id = doctors.id
       WHERE bookings.user_id = ?
       ORDER BY bookings.id DESC`,
      [userId]
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { userId = "guest", doctorId, date, time } = req.body;
    if (!doctorId || !date || !time) {
      res.status(400).json({ error: "doctorId, date, and time are required" });
      return;
    }

    const result = await run(
      "INSERT INTO bookings (user_id, doctor_id, date, time, status) VALUES (?, ?, ?, ?, ?)",
      [userId, doctorId, date, time, "confirmed"]
    );

    res.status(201).json({
      id: result.lastID,
      userId,
      doctorId,
      date,
      time,
      status: "confirmed",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    await run("DELETE FROM bookings WHERE id = ? AND user_id = ?", [
      req.params.id,
      userId,
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, allowReplace = false } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email, and password are required" });
      return;
    }

    const existing = await get("SELECT * FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);

    if (existing && !allowReplace) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    const passwordHash = `${salt}:${hash}`;
    const createdAt = new Date().toISOString();

    if (existing && allowReplace) {
      await run(
        "UPDATE users SET name = ?, password_hash = ? WHERE email = ?",
        [name, passwordHash, email.toLowerCase()]
      );
      res.status(200).json({
        id: existing.id,
        name,
        email: email.toLowerCase(),
        updated: true,
      });
      return;
    }

    const result = await run(
      "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
      [name, email.toLowerCase(), passwordHash, createdAt]
    );

    res.status(201).json({
      id: result.lastID,
      name,
      email: email.toLowerCase(),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to sign up" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const user = await get("SELECT * FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const [salt, storedHash] = user.password_hash.split(":");
    const hash = hashPassword(password, salt);

    if (hash !== storedHash) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to login" });
  }
});

app.put("/api/auth/profile", async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId || !name || !email) {
      res.status(400).json({ error: "userId, name, and email are required" });
      return;
    }

    const existing = await get(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email.toLowerCase(), userId]
    );
    if (existing) {
      res.status(409).json({ error: "Email already in use by another account" });
      return;
    }

    await run("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email.toLowerCase(),
      userId,
    ]);

    res.json({ id: userId, name, email: email.toLowerCase() });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

async function startServer() {
  try {
    await seedDoctorsIfEmpty();
    app.listen(port, () => {
      console.log(`Pratikshalay API running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
