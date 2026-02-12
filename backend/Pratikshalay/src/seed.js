import { initDb, run } from "./db.js";

const doctors = [
  {
    id: "doc-1",
    name: "Dr. Ashish Kumar Patel",
    degree: "MBBS, DNB, PGDHCM, FICM",
    specialty: "General Physician",
    address: "A3/103 Pioneer Daffodils, Jaitala, Nagpur",
    experience: 12,
    fee: 400,
    rating: 4.7,
    distance: 0.0,
    available: "Today 4:30 PM",
  },
  {
    id: "doc-2",
    name: "Dr. Srinivas",
    degree: "MBBS",
    specialty: "Family Medicine",
    address: "Hyderabad, Andhra Pradesh, Telangana",
    experience: 9,
    fee: 350,
    rating: 4.4,
    distance: 0.0,
    available: "Tomorrow 10:00 AM",
  },
  {
    id: "doc-3",
    name: "Dr. Riya Kapoor",
    degree: "MBBS, MD",
    specialty: "Dermatology",
    address: "Sadar Bazar, Nagpur",
    experience: 8,
    fee: 500,
    rating: 4.8,
    distance: 1.2,
    available: "Today 6:15 PM",
  },
  {
    id: "doc-4",
    name: "Dr. Amit Desai",
    degree: "MBBS, MS",
    specialty: "Orthopedics",
    address: "Civil Lines, Nagpur",
    experience: 14,
    fee: 600,
    rating: 4.5,
    distance: 2.6,
    available: "Tomorrow 12:30 PM",
  },
];

async function seed() {
  initDb();
  await run("DELETE FROM doctors");
  for (const doctor of doctors) {
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

  console.log("Seeded doctors:", doctors.length);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
