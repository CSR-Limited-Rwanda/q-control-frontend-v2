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