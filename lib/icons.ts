import {
  Ambulance,
  BedDouble,
  Bone,
  Baby,
  Brain,
  HeartPulse,
  Microscope,
  Pill,
  ScanFace,
  ScanLine,
  Scissors,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";

// Icons are kept out of lib/data.ts so the data stays plain and can be sent to client components.
export const departmentIcons: Record<string, LucideIcon> = {
  cardiology: HeartPulse,
  orthopedics: Bone,
  pediatrics: Baby,
  neurology: Brain,
  "general-surgery": Scissors,
  dermatology: ScanFace,
};

export const facilityIcons: Record<string, LucideIcon> = {
  "operating-theater": Syringe,
  icu: BedDouble,
  "diagnostic-lab": Microscope,
  imaging: ScanLine,
  emergency: Ambulance,
  pharmacy: Pill,
};

export function getDepartmentIcon(slug: string): LucideIcon {
  return departmentIcons[slug] ?? Stethoscope;
}

export function getFacilityIcon(slug: string): LucideIcon {
  return facilityIcons[slug] ?? Stethoscope;
}
