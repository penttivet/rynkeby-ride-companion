export interface Stage {
  stageNumber: number;
  date: string;
  startCity: string;
  destinationCity: string;
  distanceKm: number;
  startTime: string;
  eta: string;
  nextStop: string;
  hotel: string;
  importantMessage: string;
}

export interface HelpRequest {
  id: string;
  cyclistName: string;
  issueType: string;
  time: string;
  lat: number | null;
  lng: number | null;
  status: "open" | "in_progress" | "solved";
}

export interface CyclistProfile {
  name: string;
  team: string;
  emergencyContact: string;
}
