"use client";

const RIDE_DAYS = [
{ date: "2026-07-04", day: "Päivä 1", from: "Kiel", to: "Hamburg", km: 120, hotel: "Hotel Hamburg City" },
{ date: "2026-07-05", day: "Päivä 2", from: "Hamburg", to: "Bremen", km: 110, hotel: "Hotel Bremen" },
{ date: "2026-07-06", day: "Päivä 3", from: "Bremen", to: "Osnabrück", km: 130, hotel: "Hotel Osnabrück" },
{ date: "2026-07-07", day: "Päivä 4", from: "Osnabrück", to: "Köln", km: 150, hotel: "Hotel Köln" },
{ date: "2026-07-08", day: "Päivä 5", from: "Köln", to: "Liège", km: 120, hotel: "Hotel Liège" },
{ date: "2026-07-09", day: "Päivä 6", from: "Liège", to: "Bruxelles", km: 100, hotel: "Hotel Brussels" },
{ date: "2026-07-10", day: "Päivä 7", from: "Bruxelles", to: "Paris", km: 130, hotel: "Hotel Paris" },
];

export default function TodayPage() {
const today = new Date().toISOString().split("T")[0];
const rideDay = RIDE_DAYS.find(d => d.date === today);

return (
<div style={{ color: "white", padding: "1.5rem", maxWidth: 500, margin: "0 auto" }}>
<h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>🏁 Tänään</h1>
{rideDay ? (
<div style={{ background: "#1a1a2e", borderRadius: 12, padding: "1.5rem" }}>
<p style={{ color: "#aaa", marginBottom: 8 }}>{rideDay.date}</p>
<h2 style={{ fontSize: "1.4rem", marginBottom: 12 }}>{rideDay.day}</h2>
<p style={{ fontSize: "1.1rem", marginBottom: 8 }}>🚴 {rideDay.from} → {rideDay.to}</p>
<p style={{ fontSize: "1.1rem", marginBottom: 8 }}>📏 {rideDay.km} km</p>
<p style={{ fontSize: "1.1rem" }}>🏨 {rideDay.hotel}</p>
</div>
) : (
<div style={{ background: "#1a1a2e", borderRadius: 12, padding: "1.5rem" }}>
<p style={{ fontSize: "1.1rem", color: "#aaa" }}>Ei ajopäivää tänään.</p>
<p style={{ marginTop: 8 }}>Ajo alkaa 4.7.2026 Kielistä! 🚴‍♂️</p>
</div>
)}
</div>
);
}
