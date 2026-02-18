import { initDb, run } from "./db.js";
import { defaultDoctors } from "./defaultDoctors.js";

async function seed() {
  initDb();
  await run("DELETE FROM doctors");
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

  console.log("Seeded doctors:", defaultDoctors.length);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
