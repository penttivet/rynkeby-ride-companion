export interface RynkebyUser {
  name: string;
  teamId: string;
  teamName: string;
}

export function getUser(): RynkebyUser | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("rynkeby_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: RynkebyUser): void {
  localStorage.setItem("rynkeby_user", JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem("rynkeby_user");
}
