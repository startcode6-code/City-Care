export type Department = {
  slug: string;
  name: string;
  summary: string;
  services: string[];
};

export const departments: Department[] = [
  {
    slug: "cardiology",
    name: "Cardiology",
    summary: "Heart checks, ECG and echo tests, and long-term care for blood pressure and heart disease.",
    services: ["ECG and echocardiography", "Treadmill stress test", "Blood pressure clinic", "Cardiac rehabilitation"],
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    summary: "Treatment for bones, joints and sports injuries, from fractures to joint replacement.",
    services: ["Fracture care", "Joint replacement", "Sports injury clinic", "Physiotherapy"],
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    summary: "Care from newborn to teen: vaccinations, growth checks and treatment for childhood illness.",
    services: ["Newborn care", "Vaccination clinic", "Growth and nutrition", "Child emergency"],
  },
  {
    slug: "neurology",
    name: "Neurology",
    summary: "Diagnosis and care for headaches, epilepsy, stroke recovery and nerve conditions.",
    services: ["EEG and nerve studies", "Stroke recovery", "Migraine clinic", "Memory clinic"],
  },
  {
    slug: "general-surgery",
    name: "General Surgery",
    summary: "Planned and emergency surgery, with keyhole options where they suit the patient.",
    services: ["Laparoscopic surgery", "Hernia and gallbladder", "Emergency surgery", "Day-care procedures"],
  },
  {
    slug: "dermatology",
    name: "Dermatology",
    summary: "Skin, hair and nail care, from acne and allergies to minor procedures.",
    services: ["Acne and allergy care", "Hair and scalp clinic", "Minor skin procedures", "Skin allergy testing"],
  },
];

export type Doctor = {
  slug: string;
  name: string;
  department: string;
  role: string;
  years: number;
  days: string;
  languages: string;
  bio: string;
};

export const doctors: Doctor[] = [
  {
    slug: "sarah-chen",
    name: "Dr. Sarah Chen",
    department: "Cardiology",
    role: "Consultant Cardiologist",
    years: 14,
    days: "Mon, Wed, Fri",
    languages: "English, Mandarin",
    bio: "Dr. Chen focuses on preventive cardiology and heart failure care. She sees patients for blood pressure, cholesterol and chest pain assessments.",
  },
  {
    slug: "michael-okafor",
    name: "Dr. Michael Okafor",
    department: "Orthopedics",
    role: "Orthopedic Surgeon",
    years: 18,
    days: "Tue, Thu, Sat",
    languages: "English, Igbo",
    bio: "Dr. Okafor performs knee and hip replacements and treats sports injuries. He works closely with our physiotherapy team on recovery plans.",
  },
  {
    slug: "priya-nair",
    name: "Dr. Priya Nair",
    department: "Pediatrics",
    role: "Senior Pediatrician",
    years: 12,
    days: "Mon to Fri",
    languages: "English, Hindi, Malayalam",
    bio: "Dr. Nair looks after children from birth to 16. She runs our vaccination clinic and the weekly growth and nutrition check.",
  },
  {
    slug: "james-carter",
    name: "Dr. James Carter",
    department: "Neurology",
    role: "Consultant Neurologist",
    years: 16,
    days: "Tue, Thu",
    languages: "English",
    bio: "Dr. Carter treats migraine, epilepsy and movement disorders, and leads our stroke recovery programme.",
  },
  {
    slug: "elena-rossi",
    name: "Dr. Elena Rossi",
    department: "General Surgery",
    role: "Laparoscopic Surgeon",
    years: 15,
    days: "Mon, Wed, Sat",
    languages: "English, Italian",
    bio: "Dr. Rossi specialises in keyhole surgery for gallbladder, hernia and appendix problems, with most patients going home the same or next day.",
  },
  {
    slug: "amir-hassan",
    name: "Dr. Amir Hassan",
    department: "Dermatology",
    role: "Consultant Dermatologist",
    years: 10,
    days: "Mon, Tue, Thu",
    languages: "English, Arabic",
    bio: "Dr. Hassan treats acne, eczema, hair loss and skin allergies, and performs minor skin procedures in the day-care unit.",
  },
  {
    slug: "grace-liu",
    name: "Dr. Grace Liu",
    department: "Pediatrics",
    role: "Neonatologist",
    years: 9,
    days: "Wed to Sun",
    languages: "English, Cantonese",
    bio: "Dr. Liu cares for premature and newborn babies in our neonatal unit and guides parents through the first months at home.",
  },
  {
    slug: "david-mensah",
    name: "Dr. David Mensah",
    department: "Cardiology",
    role: "Interventional Cardiologist",
    years: 20,
    days: "Tue, Fri",
    languages: "English, Twi",
    bio: "Dr. Mensah performs angiograms and angioplasty, and is on call for cardiac emergencies.",
  },
];

export type Facility = {
  slug: string;
  name: string;
  imageName: string;
  summary: string;
};

export const facilities: Facility[] = [
  {
    slug: "operating-theater",
    name: "Operating Theater",
    imageName: "facility-operating-theater",
    summary: "Six modular theaters with laminar airflow and integrated imaging.",
  },
  {
    slug: "icu",
    name: "ICU",
    imageName: "facility-icu",
    summary: "Single-bed intensive care rooms, monitored around the clock by a dedicated team.",
  },
  {
    slug: "diagnostic-lab",
    name: "Diagnostic Lab",
    imageName: "facility-diagnostic-lab",
    summary: "Most routine results in under four hours, with urgent tests reported in one.",
  },
  {
    slug: "imaging",
    name: "Radiology and Imaging",
    imageName: "facility-imaging",
    summary: "MRI, CT, ultrasound and digital X-ray under one roof.",
  },
  {
    slug: "emergency",
    name: "Emergency Wing",
    imageName: "facility-emergency",
    summary: "Trauma bays, a resuscitation room and ambulance access, open every hour of every day.",
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    imageName: "facility-pharmacy",
    summary: "In-house pharmacy open 24 hours, with prescription pickup at discharge.",
  },
];

export type HealthPackage = {
  slug: string;
  name: string;
  audience: string;
  price: number;
  tests: string[];
};

export const packages: HealthPackage[] = [
  {
    slug: "comprehensive-checkup",
    name: "Comprehensive Checkup",
    audience: "Adults 18 to 59",
    price: 490,
    tests: [
      "Full blood count and lipid profile",
      "Liver, kidney and thyroid tests",
      "ECG and chest X-ray",
      "Doctor consultation and written report",
    ],
  },
  {
    slug: "senior-citizen-care",
    name: "Senior Citizen Care",
    audience: "Ages 60 and above",
    price: 590,
    tests: [
      "Bone density scan",
      "Heart and blood pressure review",
      "Vision and hearing screening",
      "Diabetes and kidney panel",
      "Physician consultation",
    ],
  },
  {
    slug: "womens-wellness",
    name: "Women's Wellness",
    audience: "Women 21 and above",
    price: 490,
    tests: [
      "Breast exam and ultrasound",
      "Cervical screening",
      "Thyroid and hemoglobin tests",
      "Bone health check",
      "Gynecologist consultation",
    ],
  },
];

export const testimonials = [
  {
    quote:
      "The cardiology team explained every test before doing it. My father was home within two days and knew exactly what to do next.",
    name: "Anita Sharma",
    meta: "Daughter of a cardiology patient",
  },
  {
    quote:
      "I booked online at night and was seen the next morning. The knee surgery went well and the physiotherapists never rushed me.",
    name: "Daniel Brooks",
    meta: "Orthopedics patient",
  },
  {
    quote:
      "Our son had a high fever at 2 AM. The emergency doctor saw us in minutes and the pediatric nurse stayed with him throughout.",
    name: "Maria Lopez",
    meta: "Parent, emergency visit",
  },
];

export const highlights = [
  { title: "24×7 Emergency", text: "Doctors on call every hour" },
  { title: "Experienced Doctors", text: "50+ specialists" },
  { title: "Modern Facilities", text: "Advanced diagnostics and imaging" },
] as const;

export const appointmentSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "4:30 PM", "6:00 PM"] as const;

export function departmentSlugFromName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}
