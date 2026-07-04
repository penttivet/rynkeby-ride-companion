export type RideDay = {
  date: string;
  day: string;
  from: string;
  to: string;
  km: number;
  hotel: string;
  lat: number;
  lng: number;
  prep?: boolean;
  note?: string;
};

// --- Esivalmistelupäivät (yhteiset niille tiimeille jotka käyttävät pohjaa) ---
export const prepDays: RideDay[] = [
  { date: "2026-06-29", day: "Esivalmistelu", from: "", to: "Espoo", km: 0, hotel: "Koti — pakkaa ja huolla pyörä", lat: 60.2055, lng: 24.6559, prep: true, note: "🧰 Tarkista pyörä, varaosat ja varusteet." },
  { date: "2026-06-30", day: "Esivalmistelu", from: "", to: "Espoo", km: 0, hotel: "Koti — viimeiset valmistelut", lat: 60.2055, lng: 24.6559, prep: true, note: "💤 Lepää ja tankkaa hyvin ennen matkaa." },
  { date: "2026-07-01", day: "Esivalmistelu", from: "", to: "Espoo", km: 0, hotel: "Koti — lähtövalmius", lat: 60.2055, lng: 24.6559, prep: true, note: "📋 Käy läpi matkalista ja dokumentit." },
  { date: "2026-07-02", day: "Matkapäivä", from: "Espoo", to: "Kiel", km: 0, hotel: "Matka kohti Kieliä", lat: 54.3233, lng: 10.1228, prep: true, note: "🚗 Siirtyminen lähtöpaikalle." },
  { date: "2026-07-03", day: "Lähtöä edeltävä päivä", from: "Kiel", to: "Kiel", km: 0, hotel: "Hotelli — lähtöbriefing", lat: 54.3233, lng: 10.1228, prep: true, note: "🎒 Briefing ja viimeinen pyörähuolto." },
];

// --- Reittipohja. Kopioi tämä ja muokkaa kaupungit/hotellit tiimikohtaisesti. ---
export const templateRideDays: RideDay[] = [
  { date: "2026-07-04", day: "Päivä 1", from: "Kiel", to: "Hamburg", km: 120, hotel: "Hotel Hamburg City", lat: 53.5511, lng: 9.9937 },
  { date: "2026-07-05", day: "Päivä 2", from: "Hamburg", to: "Bremen", km: 110, hotel: "Hotel Bremen", lat: 53.0793, lng: 8.8017 },
  { date: "2026-07-06", day: "Päivä 3", from: "Bremen", to: "Osnabrück", km: 130, hotel: "Hotel Osnabrück", lat: 52.2799, lng: 8.0472 },
  { date: "2026-07-07", day: "Päivä 4", from: "Osnabrück", to: "Köln", km: 150, hotel: "Hotel Köln", lat: 50.9375, lng: 6.9603 },
  { date: "2026-07-08", day: "Päivä 5", from: "Köln", to: "Liège", km: 120, hotel: "Hotel Liège", lat: 50.6326, lng: 5.5797 },
  { date: "2026-07-09", day: "Päivä 6", from: "Liège", to: "Bruxelles", km: 100, hotel: "Hotel Brussels", lat: 50.8503, lng: 4.3517 },
  { date: "2026-07-10", day: "Päivä 7", from: "Bruxelles", to: "Paris", km: 130, hotel: "Hotel Paris", lat: 48.8566, lng: 2.3522 },
];

// --- MEDIA TEAMIN OIKEA REITTI (Travemünde -> Pariisi) ---
export const mediaRideDays: RideDay[] = [
  { date: "2026-07-04", day: "Päivä 1 · Saapuminen", from: "Travemünde", to: "Lyypekki (Lübeck)", km: 20, hotel: "Intercity Hotel Lübeck · Team Oulu", lat: 53.8655, lng: 10.6866, note: "🛳️ Saapuminen satamaan illalla, lyhyt siirtymä Lyypekkiin. Yövytään Team Oulun kanssa." },
  { date: "2026-07-05", day: "Päivä 2", from: "Lyypekki", to: "Walsrode", km: 163, hotel: "Hotel Louisenhöhe, Walsrode · Team Järvi-Suomi", lat: 52.8622, lng: 9.5928, note: "🤝 Yövytään Team Järvi-Suomen kanssa." },
  { date: "2026-07-06", day: "Päivä 3", from: "Walsrode", to: "Rheine", km: 217, hotel: "Hotel Lücke, Rheine · Team Espoo", lat: 52.2775, lng: 7.4408, note: "🤝 Yövytään Team Espoon kanssa." },
  { date: "2026-07-07", day: "Päivä 4", from: "Rheine", to: "Heinsberg", km: 221, hotel: "Hotel Cortsen, Heinsberg · Team Vantaa", lat: 51.0640, lng: 6.0995, note: "🤝 Yövytään Team Vantaan kanssa." },
  { date: "2026-07-08", day: "Päivä 5", from: "Heinsberg", to: "Dinant", km: 175, hotel: "Hotel La Merveilleuse, Dinant · Team Turku", lat: 50.2606, lng: 4.9127, note: "🤝 Yövytään Team Turun kanssa." },
  { date: "2026-07-09", day: "Päivä 6 · Pitkä etappi", from: "Dinant", to: "Creil", km: 309, hotel: "Hotel Ibis Creil sur Oise · Team Häme", lat: 49.2583, lng: 2.4869, note: "🌙 Päivän pisin etappi (309 km). Yövytään Team Hämeen kanssa." },
  { date: "2026-07-10", day: "Päivä 7 · Maali", from: "Creil", to: "Pariisi", km: 70, hotel: "Novotel Charenton, Paris · 2 yötä", lat: 48.8566, lng: 2.3522, note: "🏁 Maali Pariisissa! 2 yötä, yövytään säätiön henkilökunnan kanssa." },
];

// Yhdistää esivalmistelupäivät + ajopäivät yhdeksi reitiksi.
export function makeRoute(rideDays: RideDay[]): RideDay[] {
  return [...prepDays, ...rideDays];
}

// --- Tiimien reitit (avaimittain) ---
// Media-tiimillä on jo oikea reitti. Muut käyttävät toistaiseksi pohjaa —
// korvaa makeRoute(templateRideDays) -> oma reitti kun tiedät kaupungit/hotellit.
export const ROUTES: Record<string, RideDay[]> = {
  media: mediaRideDays,
  oulu: makeRoute(templateRideDays),
  "jarvi-tampere": makeRoute(templateRideDays),
  espoo: makeRoute(templateRideDays),
  vantaa: makeRoute(templateRideDays),
  "turku-osterbothnia": makeRoute(templateRideDays),
  hame: makeRoute(templateRideDays),
};

// --- Tiimit (näytetään valitsimessa). Parit jakavat saman reittiavaimen. ---
export const TEAMS: { label: string; routeKey: string }[] = [
  { label: "Media Team", routeKey: "media" },
  { label: "Team Oulu", routeKey: "oulu" },
  { label: "Team Järvi-Suomi", routeKey: "jarvi-tampere" },
  { label: "Team Tampere", routeKey: "jarvi-tampere" },
  { label: "Team Espoo", routeKey: "espoo" },
  { label: "Team Vantaa", routeKey: "vantaa" },
  { label: "Team Turku", routeKey: "turku-osterbothnia" },
  { label: "Team Österbothnia", routeKey: "turku-osterbothnia" },
  { label: "Team Häme", routeKey: "hame" },
];
