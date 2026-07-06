
export type Song = {
  id: string;
  title: string;
  performer?: string;
  audioFile: string; // tiedostonimi kansiossa public/songs/
  lyrics?: string; // rivinvaihdot säilyvät automaattisesti
  note?: string;
};

// --- Lisää uusi laulu kopioimalla alla oleva pohja ja täyttämällä tiedot. ---
// {
//   id: "uniikki-tunniste",
//   title: "Laulun nimi",
//   performer: "Kuka lauloi / sävelsi",
//   audioFile: "tiedostonimi.mp3", // lataa public/songs/-kansioon
//   lyrics: `Ensimmäinen rivi
// Toinen rivi
// ...`,
//   note: "Vapaaehtoinen lyhyt tarina laulun taustasta",
// },

export const SONGS: Song[] = [
  {
    id: "rynkeby-laulu",
    title: "Rynkeby-laulu",
    performer: "Aki Markkanen",
    audioFile: "rynkeby-laulu.mp4",
    lyrics: undefined,
    note: "Syntyi matkalla — lisätään sanat pian.",
  },
];
