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


export const departmentIcons: Record<string, LucideIcon> = {
  cardiology: HeartPulse,
  orthopedics: Bone,
  pediatrics: Baby,
  neurology: Brain,
  "general-surgery": Scissors,
  dermatology: ScanFace,
};

export const facilityIcons: Record<string, string> = {
  "operating-theater": "/images/interior-view-operating-room_1170-2255.jpg",
  icu: "/images/istockphoto-2180521115-1024x1024.jpg",
  "diagnostic-lab": "/images/close-up-clinical-microscope-used-sample-examination-empty-hospital-diagnostic-lab-optical-device-gear-medical-450601772.webp",
  imaging: "/images/close-up-clinical-microscope-used-sample-examination-empty-hospital-diagnostic-lab-optical-device-gear-medical-450601772.webp",
  emergency: "/images/close-up-clinical-microscope-used-sample-examination-empty-hospital-diagnostic-lab-optical-device-gear-medical-450601772.webp",
  pharmacy: "/images/close-up-clinical-microscope-used-sample-examination-empty-hospital-diagnostic-lab-optical-device-gear-medical-450601772.webp",
};

export function getDepartmentIcon(slug: string): LucideIcon {
  return departmentIcons[slug] ?? Stethoscope;
}

export function getFacilityIcon(slug: string): string {
  return facilityIcons[slug] ?? "";
}
