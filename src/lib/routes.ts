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
  routeUrl?: string;
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

// --- TAMPERE + JÄRVI-SUOMI (jakavat reitin, 5.7.–11.7.) ---
export const jarviTampereRideDays: RideDay[] = [
  { date: "2026-07-04", day: "Saapuminen", from: "Travemünde", to: "Lyypekki (Lübeck)", km: 20, hotel: "", lat: 53.8655, lng: 10.6866, note: "🛳️ Saapuminen satamaan illalla, siirtymä Lyypekkiin." },
  { date: "2026-07-05", day: "Päivä 1", from: "Lyypekki", to: "Walsrode", km: 173, hotel: "", lat: 52.8622, lng: 9.5928, routeUrl: "https://ridewithgps.com/routes/55456773" },
  { date: "2026-07-06", day: "Päivä 2", from: "Walsrode", to: "Ostbevern", km: 185, hotel: "", lat: 52.0492, lng: 7.8397, routeUrl: "https://ridewithgps.com/routes/55457151" },
  { date: "2026-07-07", day: "Päivä 3", from: "Ostbevern", to: "Vlodrop", km: 205, hotel: "", lat: 51.1436, lng: 6.0389, routeUrl: "https://ridewithgps.com/routes/55401155" },
  { date: "2026-07-08", day: "Päivä 4", from: "Vlodrop", to: "Anhée", km: 175, hotel: "", lat: 50.3100, lng: 4.8833, routeUrl: "https://ridewithgps.com/routes/55317651" },
  { date: "2026-07-09", day: "Päivä 5", from: "Anhée", to: "Soissons", km: 188, hotel: "", lat: 49.3817, lng: 3.3236, routeUrl: "https://ridewithgps.com/routes/45626297" },
  { date: "2026-07-10", day: "Päivä 6", from: "Soissons", to: "Senlis", km: 81, hotel: "", lat: 49.2069, lng: 2.5869, routeUrl: "https://ridewithgps.com/routes/55573622" },
  { date: "2026-07-11", day: "Päivä 7 · Maali", from: "Senlis", to: "Pariisi (velodromi)", km: 68, hotel: "", lat: 48.827227, lng: 2.411673, note: "🏁 Maali velodromilla Pariisissa!", routeUrl: "https://ridewithgps.com/routes/55517183" },
];

// --- TURKU + ÖSTERBOTHNIA (jakavat reitin, "TR Ostro 2026") ---
export const turkuOsterbothniaRideDays: RideDay[] = [
  { date: "2026-07-04", day: "Saapuminen", from: "Travemünde", to: "Lyypekki (Lübeck)", km: 20, hotel: "", lat: 53.8655, lng: 10.6866, note: "🛳️ Saapuminen satamaan illalla, siirtymä Lyypekkiin." },
  { date: "2026-07-05", day: "Päivä 1", from: "Lyypekki", to: "Verden", km: 183, hotel: "", lat: 52.9230, lng: 9.2350 },
  { date: "2026-07-06", day: "Päivä 2", from: "Verden", to: "Emsdetten", km: 185, hotel: "", lat: 52.1730, lng: 7.5270 },
  { date: "2026-07-07", day: "Päivä 3", from: "Emsdetten", to: "Sittard", km: 221, hotel: "", lat: 51.0010, lng: 5.8690 },
  { date: "2026-07-08", day: "Päivä 4", from: "Sittard", to: "Huy (Mur de Huy)", km: 156, hotel: "", lat: 50.5185, lng: 5.2390, note: "⛰️ Mur de Huy -nousu." },
  { date: "2026-07-09", day: "Päivä 5", from: "Dinant", to: "Reims", km: 176, hotel: "", lat: 49.2583, lng: 4.0317 },
  { date: "2026-07-10", day: "Päivä 6", from: "Reims", to: "Chantilly", km: 145, hotel: "", lat: 49.1940, lng: 2.4600 },
  { date: "2026-07-11", day: "Päivä 7 · Maali", from: "Chantilly", to: "Pariisi (velodromi)", km: 72, hotel: "", lat: 48.827227, lng: 2.411673, note: "🏁 Maali velodromilla Pariisissa!" },
];

// --- TEAM HÄME (oma reitti, 4.7.–11.7.) — GPX-tiedostoista ---
export const hameRideDays: RideDay[] = [
  { date: "2026-07-04", day: "Saapuminen", from: "Travemünde", to: "Lyypekki (Lübeck)", km: 23, hotel: "Traveller Hotel Lübeck", lat: 53.8514, lng: 10.6919, note: "🛳️ Saapuminen satamaan illalla, siirtymä Lyypekkiin." },
  { date: "2026-07-05", day: "Päivä 1", from: "Lyypekki", to: "Verden", km: 175, hotel: "", lat: 52.9203, lng: 9.2274 },
  { date: "2026-07-06", day: "Päivä 2", from: "Verden", to: "Bad Bentheim", km: 184, hotel: "", lat: 52.3016, lng: 7.1595 },
  { date: "2026-07-07", day: "Päivä 3", from: "Bad Bentheim", to: "Baarlo", km: 152, hotel: "", lat: 51.3253, lng: 6.0824 },
  { date: "2026-07-08", day: "Päivä 4", from: "Baarlo", to: "Namur", km: 170, hotel: "", lat: 50.4849, lng: 4.7968, note: "⛰️ Reitillä Mur de Huy." },
  { date: "2026-07-09", day: "Päivä 5", from: "Namur", to: "Fourmies", km: 96, hotel: "", lat: 50.0081, lng: 4.0637 },
  { date: "2026-07-10", day: "Päivä 6", from: "Fourmies", to: "Creil", km: 167, hotel: "", lat: 49.2888, lng: 2.5000 },
  { date: "2026-07-11", day: "Päivä 7 · Maali", from: "Creil", to: "Pariisi (velodromi)", km: 74, hotel: "Kyriad Paris Est", lat: 48.8182, lng: 2.4220, note: "🏁 Maali velodromilla — Riemukaari & Eiffel-torni!" },
];

// --- TEAM OULU (oma reitti, 4.7.–11.7.) — GPX-tiedostoista ---
export const ouluRideDays: RideDay[] = [
  { date: "2026-07-04", day: "Saapuminen", from: "Travemünde", to: "Lyypekki (Lübeck)", km: 20, hotel: "", lat: 53.8655, lng: 10.6866, note: "🛳️ Saapuminen satamaan illalla, siirtymä Lyypekkiin." },
  { date: "2026-07-05", day: "Päivä 1", from: "Lyypekki", to: "Walsrode", km: 163, hotel: "", lat: 52.8622, lng: 9.5928 },
  { date: "2026-07-06", day: "Päivä 2", from: "Walsrode", to: "Saerbeck", km: 193, hotel: "", lat: 52.1743, lng: 7.5309 },
  { date: "2026-07-07", day: "Päivä 3", from: "Saerbeck", to: "Roermond", km: 193, hotel: "", lat: 51.1942, lng: 6.0032 },
  { date: "2026-07-08", day: "Päivä 4", from: "Roermond", to: "Dinant", km: 182, hotel: "", lat: 50.2606, lng: 4.9127 },
  { date: "2026-07-09", day: "Päivä 5", from: "Dinant", to: "Laon", km: 156, hotel: "", lat: 49.5641, lng: 3.6208 },
  { date: "2026-07-10", day: "Päivä 6", from: "Laon", to: "Meaux", km: 97, hotel: "", lat: 48.9606, lng: 2.8779 },
  { date: "2026-07-11", day: "Päivä 7 · Maali", from: "Meaux", to: "Pariisi (velodromi)", km: 70, hotel: "", lat: 48.827227, lng: 2.411673, note: "🏁 Maali velodromilla — reitti kulkee Eiffel-tornin ohi!" },
];

// Yhdistää esivalmistelupäivät + ajopäivät yhdeksi reitiksi.
export function makeRoute(rideDays: RideDay[]): RideDay[] {
  return [...prepDays, ...rideDays];
}

// --- Tiimien reitit (avaimittain) ---
// Media, Tampere/Järvi-Suomi, Turku/Österbothnia, Häme ja Oulu valmiit. Espoo, Vantaa pohja.
export const ROUTES: Record<string, RideDay[]> = {
  media: mediaRideDays,
  oulu: ouluRideDays,
  "jarvi-tampere": jarviTampereRideDays,
  espoo: makeRoute(templateRideDays),
  vantaa: makeRoute(templateRideDays),
  "turku-osterbothnia": turkuOsterbothniaRideDays,
  hame: hameRideDays,
};

// --- Tiimit (näytetään valitsimessa). ---
export const TEAMS: { label: string; routeKey: string }[] = [
  { label: "Media Team", routeKey: "media" },
  { label: "Team Oulu", routeKey: "oulu" },
  { label: "Team Tampere-Järvi-Suomi", routeKey: "jarvi-tampere" },
  { label: "Team Espoo", routeKey: "espoo" },
  { label: "Team Vantaa", routeKey: "vantaa" },
  { label: "Team Turku-Österbothnia", routeKey: "turku-osterbothnia" },
  { label: "Team Häme", routeKey: "hame" },
];
