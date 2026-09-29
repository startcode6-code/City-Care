export type Department = {
  slug: string;
  name: string;
  summary: string;
  images: string;
  services: string[];
};

export const departments: Department[] = [
  {
    slug: "general-medicine-icu",
    name: "General Medicine & ICU",
    summary:
      "Comprehensive medical care for adults, including diagnosis, treatment and intensive care for serious medical conditions.",
    images: "/images/icu.png",
    services: [
      "General medical consultation",
      "Critical care and ICU management",
      "Fever and infection management",
      "Diabetes and hypertension care",
      "Respiratory and chest conditions",
      "Medical emergency care",
      "Patient monitoring and stabilization",
    ],
  },

  {
    slug: "general-surgery",
    name: "General Surgery",
    summary:
      "Surgical treatment for common and emergency conditions with modern operative and post-operative care.",
    images: "/images/general_surgery.png",  
    services: [
      "Laparoscopic surgery",
      "Open surgical procedures",
      "Hernia surgery",
      "Gallbladder surgery",
      "Appendix surgery",
      "Emergency surgery",
      "Abdominal and gastrointestinal surgery",
      "Day-care surgical procedures",
    ],
  },

  {
    slug: "orthopedics",
    name: "Orthopedics",
    summary:
      "Comprehensive care for bones, joints, muscles and injuries, including trauma and orthopedic surgery.",
    images: "/images/orthopedics.png",  
    services: [
      "Fracture treatment",
      "Joint replacement",
      "Arthroscopy",
      "Sports injury treatment",
      "Bone and joint disorders",
      "Spine and back care",
      "Trauma and injury management",
      "Physiotherapy and rehabilitation",
    ],
  },

  {
    slug: "oral-maxillofacial-surgery",
    name: "Oral & Maxillofacial Surgery",
    summary:
      "Specialized surgical care for conditions affecting the mouth, jaw, face and related structures.",
    images: "/images/Maxillofacial.png",  
    services: [
      "Jaw surgery",
      "Facial trauma management",
      "Dental and oral surgical procedures",
      "Impacted tooth surgery",
      "Cyst and lesion removal",
      "Facial infection management",
      "Reconstructive oral surgery",
    ],
  },

  {
    slug: "neurosurgery",
    name: "Neurosurgery",
    summary:
      "Specialized surgical care for conditions affecting the brain, spine, nerves and nervous system.",
    images: "/images/Neurosurgery.png",  
    services: [
      "Brain surgery",
      "Spine surgery",
      "Head injury management",
      "Neuro-trauma care",
      "Brain and spinal disorders",
      "Emergency neurosurgical care",
      "Post-operative neurological care",
    ],
  },

  {
    slug: "plastic-surgery",
    name: "Plastic Surgery",
    summary:
      "Reconstructive and surgical care for injuries, wounds, burns and conditions requiring tissue restoration.",
    images: "/images/plastice.png",  
    services: [
      "Reconstructive surgery",
      "Burn injury management",
      "Wound care and reconstruction",
      "Scar revision",
      "Soft tissue reconstruction",
      "Hand and facial reconstruction",
      "Post-trauma reconstruction",
    ],
  },

  {
    slug: "urology",
    name: "Urology",
    summary:
      "Diagnosis and treatment of conditions affecting the urinary system and male reproductive system.",
    images: "/images/urology.png",  
    services: [
      "Kidney stone treatment",
      "Urinary tract care",
      "Prostate care",
      "Urinary obstruction treatment",
      "Urological surgery",
      "Endoscopic procedures",
      "Kidney and bladder disorders",
      "Urological emergency care",
    ],
  },

  {
    slug: "polytrauma",
    name: "Polytrauma",
    summary:
      "Coordinated emergency care for patients with multiple serious injuries requiring rapid assessment and treatment.",
    images: "/images/polytrauma.png",  
    services: [
      "Multiple injury management",
      "Road traffic accident care",
      "Emergency trauma care",
      "Fracture and orthopedic trauma",
      "Head and spinal injury care",
      "Critical care and stabilization",
      "Emergency surgical intervention",
      "Post-trauma rehabilitation",
    ],
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


export interface BlogPost {
  slug: string;
  title: string;
  imageName: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  summary: string;
  content: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "importance-of-regular-health-checkups",
    title: "Why Regular Health Checkups Are Important",
    imageName: "blog-health-checkup",
    category: "Health & Wellness",
    author: "K.P. Sinha Memorial Hospital",
    publishedAt: "2026-09-10",
    readTime: "5 min read",
    summary:
      "Regular health checkups can help identify potential health concerns early and support better long-term health.",
    content:
      "Regular health checkups help healthcare professionals monitor important aspects of your health and identify concerns that may require further evaluation.",
    tags: ["Health Checkup", "Preventive Care", "Wellness"],
  },

  {
    slug: "how-to-maintain-a-healthy-heart",
    title: "Simple Ways to Maintain a Healthy Heart",
    imageName: "blog-heart-health",
    category: "Cardiology",
    author: "K.P. Sinha Memorial Hospital",
    publishedAt: "2026-09-05",
    readTime: "6 min read",
    summary:
      "Learn about everyday habits that can support cardiovascular health and overall wellbeing.",
    content:
      "A healthy lifestyle, regular physical activity, balanced nutrition and appropriate medical checkups can all contribute to cardiovascular health.",
    tags: ["Heart Health", "Cardiology", "Healthy Lifestyle"],
  },

  {
    slug: "understanding-diabetes",
    title: "Understanding Diabetes and Its Prevention",
    imageName: "blog-diabetes",
    category: "Diabetes",
    author: "K.P. Sinha Memorial Hospital",
    publishedAt: "2026-08-28",
    readTime: "7 min read",
    summary:
      "Understand the basics of diabetes, common risk factors and the importance of regular monitoring.",
    content:
      "Diabetes is a condition that requires appropriate medical evaluation and ongoing management. Regular monitoring and healthy lifestyle choices can play an important role in care.",
    tags: ["Diabetes", "Health Tips", "Prevention"],
  },

  {
    slug: "when-to-visit-emergency-department",
    title: "When Should You Visit the Emergency Department?",
    imageName: "blog-emergency-care",
    category: "Emergency Care",
    author: "K.P. Sinha Memorial Hospital",
    publishedAt: "2026-08-20",
    readTime: "5 min read",
    summary:
      "Learn about situations where immediate medical attention may be necessary.",
    content:
      "Some symptoms and injuries require immediate medical assessment. Knowing when to seek emergency care can help you respond quickly when urgent medical attention is needed.",
    tags: ["Emergency", "Urgent Care", "Patient Safety"],
  },

  {
    slug: "benefits-of-preventive-healthcare",
    title: "The Benefits of Preventive Healthcare",
    imageName: "blog-preventive-care",
    category: "Preventive Care",
    author: "K.P. Sinha Memorial Hospital",
    publishedAt: "2026-08-15",
    readTime: "4 min read",
    summary:
      "Preventive healthcare focuses on maintaining health and identifying potential concerns before they become serious.",
    content:
      "Preventive healthcare includes routine checkups, recommended screenings, vaccinations and healthy lifestyle practices.",
    tags: ["Preventive Care", "Health Screening", "Wellness"],
  },

  {
    slug: "healthy-lifestyle-for-families",
    title: "Building a Healthier Lifestyle for Your Family",
    imageName: "blog-family-health",
    category: "Family Health",
    author: "K.P. Sinha Memorial Hospital",
    publishedAt: "2026-08-08",
    readTime: "6 min read",
    summary:
      "Small everyday changes can help families build healthier habits together.",
    content:
      "Healthy eating, regular physical activity, adequate sleep and routine healthcare can help families maintain healthier lifestyles.",
    tags: ["Family Health", "Healthy Living", "Wellness"],
  },
];