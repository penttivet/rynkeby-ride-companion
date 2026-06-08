export interface Phrase {
  id: string;
  label: string;
  translations: Record<string, string>;
}

export const languages = [
  { code: "fi", label: "🇫🇮 Suomi" },
  { code: "en", label: "🇬🇧 English" },
  { code: "sv", label: "🇸🇪 Svenska" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "nl", label: "🇳🇱 Nederlands" },
];

export const phrases: Phrase[] = [
  {
    id: "water",
    label: "I need water",
    translations: {
      fi: "Tarvitsen vettä",
      en: "I need water",
      sv: "Jag behöver vatten",
      de: "Ich brauche Wasser",
      fr: "J'ai besoin d'eau",
      nl: "Ik heb water nodig",
    },
  },
  {
    id: "toilet",
    label: "Where is the toilet?",
    translations: {
      fi: "Missä on vessa?",
      en: "Where is the toilet?",
      sv: "Var är toaletten?",
      de: "Wo ist die Toilette?",
      fr: "Où sont les toilettes ?",
      nl: "Waar is het toilet?",
    },
  },
  {
    id: "bike_repair",
    label: "I need a bicycle repair shop",
    translations: {
      fi: "Tarvitsen pyöräkorjaamon",
      en: "I need a bicycle repair shop",
      sv: "Jag behöver en cykelverkstad",
      de: "Ich brauche eine Fahrradwerkstatt",
      fr: "J'ai besoin d'un atelier de réparation de vélos",
      nl: "Ik heb een fietsreparatiewinkel nodig",
    },
  },
  {
    id: "ambulance",
    label: "Please call an ambulance",
    translations: {
      fi: "Soittakaa ambulanssi, olkaa hyvä",
      en: "Please call an ambulance",
      sv: "Vänligen ring en ambulans",
      de: "Bitte rufen Sie einen Krankenwagen",
      fr: "Appelez une ambulance, s'il vous plaît",
      nl: "Bel alstublieft een ambulance",
    },
  },
  {
    id: "team_intro",
    label: "I am part of a charity cycling team from Finland",
    translations: {
      fi: "Olen osa suomalaista hyväntekeväisyyspyöräilyjoukkuetta",
      en: "I am part of a charity cycling team from Finland",
      sv: "Jag är del av ett välgörenhets-cykellag från Finland",
      de: "Ich bin Teil eines Wohltätigkeits-Radsportteams aus Finnland",
      fr: "Je fais partie d'une équipe de cyclisme caritative de Finlande",
      nl: "Ik ben deel van een liefdadigheids-wielerteam uit Finland",
    },
  },
  {
    id: "paris_mission",
    label: "We are cycling to Paris for children with critical illnesses",
    translations: {
      fi: "Pyöräilemme Pariisiin vakavasti sairaiden lasten hyväksi",
      en: "We are cycling to Paris for children with critical illnesses",
      sv: "Vi cyklar till Paris för barn med livshotande sjukdomar",
      de: "Wir radeln für schwerkranke Kinder nach Paris",
      fr: "Nous cyclons jusqu'à Paris pour les enfants atteints de maladies graves",
      nl: "We fietsen naar Parijs voor kinderen met ernstige ziekten",
    },
  },
  {
    id: "fill_bottle",
    label: "Can you fill my water bottle?",
    translations: {
      fi: "Voitteko täyttää vesipulloni?",
      en: "Can you fill my water bottle?",
      sv: "Kan du fylla min vattenflaska?",
      de: "Können Sie meine Wasserflasche auffüllen?",
      fr: "Pouvez-vous remplir ma bouteille d'eau ?",
      nl: "Kunt u mijn waterfles vullen?",
    },
  },
  {
    id: "pharmacy",
    label: "Where is the nearest pharmacy?",
    translations: {
      fi: "Missä on lähin apteekki?",
      en: "Where is the nearest pharmacy?",
      sv: "Var finns närmaste apotek?",
      de: "Wo ist die nächste Apotheke?",
      fr: "Où est la pharmacie la plus proche ?",
      nl: "Waar is de dichtstbijzijnde apotheek?",
    },
  },
  {
    id: "lost",
    label: "I am lost",
    translations: {
      fi: "Olen eksyksissä",
      en: "I am lost",
      sv: "Jag har gått vilse",
      de: "Ich habe mich verirrt",
      fr: "Je suis perdu(e)",
      nl: "Ik ben verdwaald",
    },
  },
  {
    id: "taxi",
    label: "Please show this address to a taxi driver",
    translations: {
      fi: "Näyttäkää tämä osoite taksikuskille, olkaa hyvä",
      en: "Please show this address to a taxi driver",
      sv: "Visa detta till en taxichaufför",
      de: "Bitte zeigen Sie das dem Taxifahrer",
      fr: "Montrez cette adresse à un chauffeur de taxi, s'il vous plaît",
      nl: "Laat dit adres zien aan een taxichauffeur",
    },
  },
];
