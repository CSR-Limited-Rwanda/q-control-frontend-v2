export const howComplaintIsReceived = [
  "Phone number",
  "Verbal",
  "Email",
  "In person",
];

export const generalOutcomeOptions = [
  { label: "No Apparent Injury", value: "No apparent injury" },
  { label: "Delay in treatment", value: "Delay in treatment" },
  { label: "Loss of consciousness", value: "Loss of consciousness" },
  { label: "Death", value: "Death" },
  { label: "Abrasion", value: "Abrasion" },
  { label: "Dislocation", value: "Dislocation" },
  { label: "Neurologic change", value: "Neurologic change" },
  { label: "Allergic reaction", value: "Allergic reaction" },
  { label: "Ecchymosis", value: "Ecchymosis" },
  { label: "Pain", value: "pain" },
  { label: "Amputation", value: "Amputation" },
  { label: "Fracture", value: "Fracture" },
  { label: "Sprain/strain", value: "Sprain/strain" },
  { label: "Burn", value: "Burn" },
  { label: "Hematoma", value: "Hematoma" },
  { label: "Infection", value: "Infection" },
  { label: "Lab redraw required", value: "Lab redraw required" },
  { label: "Laceration", value: "Laceration" },
  { label: "Other", value: "Other" },
];

export const outcomeReasons = [
  { name: "Reason for admission" },
  { name: "Preventable" },
  { name: "Dose related" },
];
export const incidentTypesData = {
  fall_related: [
    { name: "Reported fall not observed by staff" },
    { name: "Found on floor" },
    { name: "Lowered/assisted to floor" },
    { name: "Fall from " },
    { name: "While standing" },
    { name: "While sitting" },
    { name: "While walking" },
  ],

  treatment_related: [
    { name: "Blood product problem" },
    { name: "Consent" },
    { name: "Incorrect site" },
    { name: "Incorrect prep" },
    { name: "Patient identification" },
    { name: "Sterility issue" },
    { name: "Tissue/ specimen problem" },
    { name: "Medication problem" },
    { name: "Other" },
  ],
  others: [
    { name: "Contraband" },
    { name: "Left AMA" },
    { name: "Pulled out tubing/catheter" },
    { name: "Delay in Treatment/Exam" },
    { name: "Left Without Being Seen" },
    { name: "Self injury" },
    { name: "Elopement" },
    { name: "Order/no treatment" },
    { name: "Suicide or Attempted" },
    { name: "Fainted without fall" },
    { name: "Order not followed" },
    { name: "Medical record issue" },
    { name: "Specimen" },
    { name: "Mislabeled" },
    { name: "Unusable" },
    { name: "Missing" },
    { name: "IT malfunction(s)" },
    { name: "Violent/disruptive behavior" },
    { name: "Confidentiality/HIPAA" },
    { name: "Police Notified" },
    { name: "Other" },
  ],
  equipment_malfunction_defect: [
    { name: "Equipment type" },
    { name: "Manufacturer" },
    { name: "serial no" },
    { name: "lot/control no" },
    { name: "Removed from service" },
    { name: "Clinical engineering" },
  ],

  fell_of_of: [{ name: "Bed" }, { name: "Chair" }, { name: "Equipment" }],

  injury_or_outcome: [
    { name: "Wound" },
    { name: "Fracture" },
    { name: "Dislocation" },
    { name: "Concussion" },
  ],

  agreements: [
    { name: "Side rails up" },
    { name: "Safety plan/fall protocol initiated?" },
    { name: "Restraint on" },
    { name: "Wrist restraints" },
    { name: "Four side rails" },
    { name: "Chemical" },
    { name: "Bed height Up" },
    { name: "Bed height Down" },
    { name: "Wheels locked" },
    { name: "Call in reach" },
    { name: "Bed alarm used" },
    { name: "Chair alarm used" },
    { name: "Gait belt used " },
    { name: "History of falls" },
    { name: "Post-Fall Review" },
  ],

  incident_agreement: [
    { name: "Anaphylactic" },
    { name: "Bleeding" },
    { name: "Cardiac arrest" },
    { name: "Cardiovascular" },
    { name: "Dermatologic(rash)" },
    { name: "Elevated INR" },
    { name: "Hepatic" },
    { name: "Hypotensive" },
    { name: "Itching" },
    { name: "Musculoskeletal" },
    { name: "Confusion" },
    { name: "Pulmonary" },
    { name: "Renal" },
    { name: "Tachycardia" },
    { name: "Hives" },
    { name: "Vaccine" },
    { name: "Hematologic" },
    { name: "Vascular" },
    { name: "Elevated temp" },
    { name: "Electrolyte imbalance" },
    { name: "Eeurologic(seizures,EPS0" },
    { name: "GI(nausea/vomiting/diarrhea)" },
    { name: "Other" },
  ],

  general_reaction_classification: [
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
    { name: "Anaphylactic" },
  ],
};

export const statusesPrionToIncident = [
  {
    description: "Agitated",
  },
  {
    description: "Sedated",
  },
  {
    description: "Medicated",
  },
  {
    description: "Alert/Oriented",
  },
  {
    description: "Confused/Disoriented",
  },
  {
    description: "Unconscious",
  },
  {
    description: "Anesthetized",
  },
  {
    description: "Other",
  },
  {
    description: "Dementia",
  },
];

export const hoursArray = [...Array(25).keys()].map((h) =>
  h.toString().padStart(2, "0")
);
export const minutesArray = [...Array(60).keys()].map((m) =>
  m.toString().padStart(2, "0")
);

export const drugRoutes = [
  { label: "IV Push", value: "IV Push" },
  { label: "IV Drip", value: "IV Drip" },
  { label: "IM", value: "IM" },
  { label: "Vaginal", value: "Vaginal" },
  { label: "SC", value: "SC" },
  { label: "PO", value: "PO" },
  { label: "Per Rect", value: "Per Rect" },
  { label: "Per Tube", value: "Per Tube" },
  { label: "Per Trach", value: "Per Trach" },
  { label: "Topical", value: "Topical" },
  { label: "Other", value: "Other" },
];

export const whatHappenedOptions = [
  { value: "Person", label: "Person" },
  { value: "Formulation", label: "Formulation" },
  { value: "Position", label: "Position" },
  {
    value: "Criteria Not Met",
    label: "Given when criteria not met (e.g. BP, blood sugar, pain)",
  },
  { value: "Treatment Error", label: "Treatment error" },
  { value: "drug", label: "Drug" },
  { value: "IV Rate", label: "IV Rate" },
  { value: "texture", label: "Texture" },
  { value: "Extra Dose Given", label: "Extra dose given" },
  { value: "Other", label: "Other", isOther: true },
  { value: "dose", label: "Dose" },
  { value: "Iv Solution", label: "IV Solution" },
  { value: "Dose Omitted", label: "Dose Omitted" },
  {
    value: "Allergy To Drug",
    label: "Given in the presence of documented allergy to drug",
  },
];

export const severityCategories = [
  {
    category: "Category A",
    value: 1,
    description:
      "Circumstances or events that have the capacity to cause a medication-use error.",
  },
  {
    category: "Category B",
    value: 2,
    description:
      "Error occurred, but was detected before it reached the individual.",
  },
  {
    category: "Category C",
    value: 3,
    description:
      "Error occurred, reached the individual, but caused no harm or is unlikely to cause harm.",
  },
  {
    category: "Category D",
    value: 4,
    description:
      "Error will require additional person monitoring, but is unlikely to result in a change in vital signs or cause harm.",
  },
  {
    category: "Category E",
    value: 5,
    description:
      "Error requires intervention and caused or is likely to cause the person temporary harm.",
  },
  {
    category: "Category F",
    value: 6,
    description:
      "Error caused or is likely to cause temporary harm requiring hospitalization.",
  },
  {
    category: "Category G",
    value: 7,
    description:
      "Error caused or is likely to cause permanent harm to the person.",
  },
  {
    category: "Category H",
    value: 8,
    description:
      "Error resulted in a near death event (e.g. anaphylaxis, cardiac arrest).",
  },
  {
    category: "Category I",
    value: 9,
    description: "Error resulted in or contributed to the person’s death.",
  },
];

export const injuresTypes = [
  "Not applicable",
  "Yelling",
  "Stabbed",
  "Spit upon",
  "Cursing/berating",
  "Cut",
  "Bitten",
  "Bodily harm",
  "Grabbed/choked",
  "Punched/hit/slapped",
  "Shot",
  "Sexual assault",
  "Kicked",
];

export const adrOutCome = [
  { name: "Reason for Admission" },
  { name: "Preventable" },
  { name: "Dose Related" },
];

export const outComeData = {
  Mild: [{ name: " required no intervention no ,apparent harm to patient" }],
  Moderate: [
    { name: "Required treatment or intervention due to temporary harm" },
    { name: "Increased monitoring" },
    { name: "Prolonged hospitalization" },
  ],
  Severe: [
    { name: "Death" },
    { name: "Increased length of stay" },
    { name: "Permanent disability" },
  ],
};

export const contributingFactors = [
  {
    factor: "PRODUCT",
    description:
      "E.G. Unclear manufacturing labeling, “sound-alike” drug names, look-alike packaging, omission or misuse of a prefix or suffix such as “fos” phenytoin or diltiazem “CD” etc.",
  },
  {
    factor: "MEDICATION USE SYSTEM",
    description:
      "E.G. Side-by-side storage of look-alike drugs, lack of standardization in practice, competing distractions, etc.",
  },
  {
    factor: "COMMUNICATION DYNAMICS",
    description:
      "E.G. Lack of clear, accurate, and timely written and oral communications related to drug regimen, lack of interactions that are free of fear of intimidation, punishment, and embarrassment etc.",
  },
  {
    factor: "STAFF COMPETENCY",
    description:
      "E.G. Inadequate training or supervision, unfamiliarity with medication or procedures, fatigue, stress, or complacency.",
  },
  {
    factor: "PATIENT FACTORS",
    description:
      "E.G. Non-adherence to prescribed treatment, miscommunication about allergies or prior medication reactions, and medical history complexities.",
  },
  {
    factor: "ENVIRONMENTAL FACTORS",
    description:
      "E.G. Poor lighting, high noise levels, interruptions, or limited workspace leading to errors.",
  },
  {
    factor: "TECHNOLOGY FAILURE",
    description:
      "E.G. Malfunctioning equipment, errors in automated systems, or lack of integration between electronic medical records and pharmacy databases.",
  },
  {
    factor: "POLICIES AND PROCEDURES",
    description:
      "E.G. Lack of clear protocols, failure to follow best practices, or outdated procedures that contribute to medication errors.",
  },
  {
    factor: "LEADERSHIP",
    description:
      "E.G. Lack of oversight, poor communication from management, or failure to implement risk-reduction strategies.",
  },
];

export const errorTypes = [
  {
    name: "PRESCRIBING",
    description:
      "E.G. Incomplete or unclear order, excessive quantity prescribed, wrong drug, etc.",
  },
  {
    name: "TRANSCRIBING",
    description:
      "E.G. Order entered on wrong person, order content changed during schedule revision, incorrect verbal order, etc.",
  },
  {
    name: "PROCUREMENT & STORAGE",
    description:
      "E.G. Lack of standardized storage locations, lack of safe drug storage and stocking practices, lack of standardization of stock drug concentrations, expired drugs, provider failed to fill prescription, etc.",
  },
  {
    name: "DISPENSING",
    description:
      "E.G. Medication mislabeled, wrong medication stocked in satellite pharmacy, wrong medication withdrawn from satellite pharmacy, inaccurate dose calculation, etc.",
  },
  {
    name: "ADMINISTERING",
    description:
      "E.G. Medication label misread or not read, previous dose given but not charted or charted incorrectly, person identification not verified, person not available on unit, etc.",
  },
  {
    name: "MONITORING",
    description:
      "E.G. Inaccurate documentation of person’s weight, necessary tests or procedures not ordered, test/procedure results misinterpreted, test/procedure results not charted or charted incorrectly, lapse in profile or new order review, etc.",
  },
];

export const sourcesOfInformation = [
  {
    label: "Patient satisfaction survey",
    value: "Patient satisfaction survey",
  },
  { label: "Letter", value: "Letter" },
  { label: "Leadership Rounds", value: "Leadership Rounds" },
  {
    label: "Verbal Report from patient and/or visitor",
    value: "Verbal Report form patient and /or visitor",
  },
  { label: "Other", value: "Other" },
];
