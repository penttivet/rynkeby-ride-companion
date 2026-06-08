import type { Stage, HelpRequest, CyclistProfile } from "@/types";

export const stages: Stage[] = [
  {
    stageNumber: 1,
    date: "2026-07-04",
    startCity: "Travemünde",
    destinationCity: "Lübeck",
    distanceKm: 20,
    startTime: "10:00",
    eta: "12:00",
    nextStop: "Lübeck city center",
    hotel: "Intercity Hotel Lübeck — Staying with Team Oulu",
    importantMessage: "🚢 Welcome to the ride! Short stage today — enjoy Lübeck!",
  },
  {
    stageNumber: 2,
    date: "2026-07-05",
    startCity: "Lübeck",
    destinationCity: "Walsrode",
    distanceKm: 163,
    startTime: "07:00",
    eta: "16:00",
    nextStop: "Lunch break at km 80",
    hotel: "Hotel Louisenhöhe, Walsrode — Staying with Team Järvi-Suomi",
    importantMessage: "💪 Long day ahead — 163 km. Stay hydrated!",
  },
  {
    stageNumber: 3,
    date: "2026-07-06",
    startCity: "Walsrode",
    destinationCity: "Rheine",
    distanceKm: 217,
    startTime: "07:00",
    eta: "17:30",
    nextStop: "Lunch break at km 100",
    hotel: "Hotel Lücke, Rheine — Staying with Team Espoo",
    importantMessage: "🚴 Big day — 217 km. Support cars at km 70 and km 140.",
  },
  {
    stageNumber: 4,
    date: "2026-07-07",
    startCity: "Rheine",
    destinationCity: "Heninsberg",
    distanceKm: 221,
    startTime: "07:00",
    eta: "17:30",
    nextStop: "Lunch break at km 110",
    hotel: "Hotel Cortsen, Heninsberg — Staying with Team Vantaa",
    importantMessage: "🇧🇪 Entering Belgium today! 221 km — pace yourself.",
  },
  {
    stageNumber: 5,
    date: "2026-07-08",
    startCity: "Heninsberg",
    destinationCity: "Dinant",
    distanceKm: 175,
    startTime: "07:00",
    eta: "16:00",
    nextStop: "Lunch break at km 85",
    hotel: "Hotel La Merveilleuse, Dinant — Staying with Team Turku",
    importantMessage: "🏰 Beautiful route through Belgian Ardennes today!",
  },
  {
    stageNumber: 6,
    date: "2026-07-09",
    startCity: "Dinant",
    destinationCity: "Creil sur Oise",
    distanceKm: 309,
    startTime: "06:30",
    eta: "19:00",
    nextStop: "Lunch break at km 150",
    hotel: "Hotel Ibis Creil sur Oise — Staying with Team Häme",
    importantMessage: "🇫🇷 Entering France! 309 km — Paris tomorrow! You can do it!",
  },
  {
    stageNumber: 7,
    date: "2026-07-10",
    startCity: "Creil sur Oise",
    destinationCity: "Paris",
    distanceKm: 70,
    startTime: "08:00",
    eta: "13:00",
    nextStop: "Final push to Paris!",
    hotel: "Novotel Charenton, Paris — 2 nights with Foundation staff",
    importantMessage: "🎉 PARIS TODAY! Last 70 km — enjoy every moment. You made it! 🏆",
  },
];

export function getTodayStage(): Stage {
  const today = new Date().toISOString().split("T")[0];
  const found = stages.find((s) => s.date === today);
  if (found) return found;
  if (today < stages[0].date) return stages[0];
  return stages[stages.length - 1];
}

export function getStage(): Stage {
  if (typeof window === "undefined") return getTodayStage();
  try {
    const saved = localStorage.getItem("rynkeby_stage_override");
    if (saved) return JSON.parse(saved);
  } catch {}
  return getTodayStage();
}

export function saveStage(stage: Stage): void {
  localStorage.setItem("rynkeby_stage_override", JSON.stringify(stage));
}

export function clearStageOverride(): void {
  localStorage.removeItem("rynkeby_stage_override");
}

export const demoProfile: CyclistProfile = {
  name: "Demo Rider",
  team: "Team Rynkeby Finland",
  emergencyContact: "Support Car 1",
};

export const mockHelpRequests: HelpRequest[] = [
  {
    id: "req-001",
    cyclistName: "Matti Korhonen",
    issueType: "Flat tire",
    time: "08:42",
    lat: 53.8655,
    lng: 10.6866,
    status: "solved",
  },
  {
    id: "req-002",
    cyclistName: "Liisa Mäkinen",
    issueType: "Need water",
    time: "10:15",
    lat: 52.9755,
    lng: 9.4452,
    status: "open",
  },
];

export function getHelpRequests(): HelpRequest[] {
  if (typeof window === "undefined") return mockHelpRequests;
  try {
    const saved = localStorage.getItem("rynkeby_help_requests");
    return saved ? JSON.parse(saved) : mockHelpRequests;
  } catch {
    return mockHelpRequests;
  }
}

export function saveHelpRequests(requests: HelpRequest[]): void {
  localStorage.setItem("rynkeby_help_requests", JSON.stringify(requests));
}

export function addHelpRequest(request: HelpRequest): void {
  const existing = getHelpRequests();
  saveHelpRequests([request, ...existing]);
}

export function updateRequestStatus(id: string, status: HelpRequest["status"]): HelpRequest[] {
  const requests = getHelpRequests();
  const updated = requests.map((r) => (r.id === id ? { ...r, status } : r));
  saveHelpRequests(updated);
  return updated;
}
