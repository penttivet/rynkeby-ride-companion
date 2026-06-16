"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TEAMS = [
{ id: "media", name: "Media Team", emoji: "🎥", password: "media2026" },
{ id: "oulu", name: "Team Oulu", emoji: "🚴", password: "oulu2026" },
{ id: "jarvi-suomi", name: "Team Järvi-Suomi", emoji: "🚴", password: "jarvi2026" },
{ id: "espoo", name: "Team Espoo", emoji: "🚴", password: "espoo2026" },
{ id: "vantaa", name: "Team Vantaa", emoji: "🚴", password: "vantaa2026" },
{ id: "turku", name: "Team Turku", emoji: "🚴", password: "turku2026" },
{ id: "hame", name: "Team Häme", emoji: "🚴", password: "hame2026" },
{ id: "support", name: "Support Team", emoji: "🚗", password: "support2026" },
];

function resizeImage(file: File, maxSize = 200): Promise<string> {
return new Promise((resolve) => {
const reader = new FileReader();
reader.onload = (e) => {
const img = new Image();
img.onload = () => {
const canvas = document.createElement("canvas");
const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
canvas.width = Math.round(img.width * scale);
canvas.height = Math.round(img.height * scale);
const ctx = canvas.getContext("2d")!;
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
resolve(canvas.toDataURL("image/jpeg", 0.6));
};
img.src = e.target?.result as string;
};
reader.readAsDataURL(file);
});
}
