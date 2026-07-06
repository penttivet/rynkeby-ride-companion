"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

type GpsTrackingContextValue = {
  tracking: boolean;
  gpsError: string;
  lastUpdate: string;
  teamId: string | null;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
};

const GpsTrackingContext = createContext<GpsTrackingContextValue | null>(null);

function getCurrentTeamId(): string | null {
  try {
    const user = JSON.parse(localStorage.getItem("rynkeby_user") || "{}");
    return user.teamId || null;
  } catch {
    return null;
  }
}

export function GpsTrackingProvider({ children }: { children: React.ReactNode }) {
  const [tracking, setTracking] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [teamId, setTeamId] = useState<string | null>(null);

  const watchRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);
  const trackingRef = useRef<boolean>(false);
  const teamIdRef = useRef<string | null>(null);

  useEffect(() => {
    const tid = getCurrentTeamId();
    setTeamId(tid);
    teamIdRef.current = tid;
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      const nav = navigator as any;
      if (nav.wakeLock && nav.wakeLock.request) {
        wakeLockRef.current = await nav.wakeLock.request("screen");
      }
    } catch {}
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {}
  }, []);

  const sendLocation = useCallback(async (currentTeamId: string, lat: number, lng: number) => {
    try {
      await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: currentTeamId, lat, lng }),
      });
      setLastUpdate(new Date().toLocaleTimeString("fi-FI"));
    } catch {}
  }, []);

  const beginWatch = useCallback(
    (currentTeamId: string) => {
      if (!navigator.geolocation) {
        setGpsError("GPS ei ole käytettävissä tässä laitteessa");
        return;
      }
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          sendLocation(currentTeamId, pos.coords.latitude, pos.coords.longitude);
          setGpsError("");
          setTracking(true);
        },
        (err) => {
          if (err.code === err.TIMEOUT) {
            setGpsError("Heikko GPS-signaali — haetaan sijaintia… (mene ulos / lähelle ikkunaa)");
          } else if (err.code === err.PERMISSION_DENIED) {
            setGpsError("Sijaintilupa puuttuu — salli sijainti selaimen ja puhelimen asetuksista");
            setTracking(false);
            trackingRef.current = false;
          } else {
            setGpsError("GPS-virhe: " + err.message);
          }
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 30000 }
      );
    },
    [sendLocation]
  );

  const startTracking = useCallback(async () => {
    const currentTeamId = getCurrentTeamId();
    if (!currentTeamId) {
      setGpsError("Kirjaudu ensin sisään /join-sivulla, jotta tiimisi tunnistetaan");
      return;
    }
    setTeamId(currentTeamId);
    teamIdRef.current = currentTeamId;
    setGpsError("");
    setTracking(true);
    trackingRef.current = true;
    await requestWakeLock();
    beginWatch(currentTeamId);
  }, [requestWakeLock, beginWatch]);

  const stopTracking = useCallback(async () => {
    trackingRef.current = false;
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    await releaseWakeLock();
    setTracking(false);
    setLastUpdate("");
    const currentTeamId = teamIdRef.current || getCurrentTeamId();
    if (!currentTeamId) return;
    try {
      await fetch("/api/locations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: currentTeamId }),
      });
    } catch {}
  }, [releaseWakeLock]);

  // Kun appi palaa näkyviin (esim. selaus kuvissa ja takaisin), käynnistä watch uudelleen
  // ja hae wake lock uudelleen, jos seuranta oli päällä.
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState === "visible" && trackingRef.current) {
        await requestWakeLock();
        const tid = teamIdRef.current || getCurrentTeamId();
        if (tid) beginWatch(tid);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [requestWakeLock, beginWatch]);

  // Provider elää layoutissa koko sovelluksen ajan, joten tätä ei kutsuta
  // sivunvaihdon takia — vain kun koko appi suljetaan/latautuu uudelleen.
  useEffect(() => {
    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

  return (
    <GpsTrackingContext.Provider
      value={{ tracking, gpsError, lastUpdate, teamId, startTracking, stopTracking }}
    >
      {children}
    </GpsTrackingContext.Provider>
  );
}

export function useGpsTracking() {
  const ctx = useContext(GpsTrackingContext);
  if (!ctx) {
    throw new Error("useGpsTracking must be used within GpsTrackingProvider");
  }
  return ctx;
}
