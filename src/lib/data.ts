import type { Stage, HelpRequest, CyclistProfile } from "@/types";

export const defaultStage: Stage = {
  stageNumber: 7,
  date: "2025-07-03",
  startCity: "Düsseldorf",
  destinationCity: "Liège",
  distanceKm: 132,
  startTime: "07:30",
  eta: "15:00",
  nextStop: "Aachen – lunch break 12:00",
  hotel: "Ibis Hotel Liège Centre, Rue des Guillemins 116",
  importantMessage:
    "🌧️ Rain expected after Aachen. Keep waterproofs accessible. Support car #2 will be at km 68 with extra water and energy bars.",
};

export const mockHelpRequests: HelpRequest[] = [
  {
    id: "req-001",
    cyclistName: "Matti Korhonen",
    issueType: "Flat tire",
    time: "08:42",
    lat: 51.2217,
    lng: 6.7762,
    status: "solved",
  },
  {
    id: "req-002",
    cyclistName: "Liisa Mäkinen",
    issueType: "Need water",
    time: "10:15",
    lat: 50.7753,
    lng: 6.0839,
    status: "in_progress",
  },
  {
    id: "req-003",
    cyclistName: "Demo Rider",
    issueType: "I am lost",
    time: "11:03",
    lat: 50.6326,
    lng: 5.5797,
    status: "open",
  },
];

export const demoProfile: CyclistProfile = {
  name: "Demo Rider",
  team: "Team Rynkeby Finland",
  emergencyContact: "Support Car 1",
};

export function getStage(): Stage {
  if (typeof window === "undefined") return defaultStage;
  try {
    const saved = localStorage.getItem("rynkeby_stage");
    return saved ? { ...defaultStage, ...JSON.parse(saved) } : defaultStage;
  } catch {
    return defaultStage;
  }
}

export function saveStage(stage: Stage): void {
  localStorage.setItem("rynkeby_stage", JSON.stringify(stage));
}

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

export function updateRequestStatus(
  id: string,
  status: HelpRequest["status"]
): HelpRequest[] {
  const requests = getHelpRequests();
  const updated = requests.map((r) => (r.id === id ? { ...r, status } : r));
  saveHelpRequests(updated);
  return updated;
}
