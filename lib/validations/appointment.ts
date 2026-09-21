import { z } from "zod";
import { appointmentSlots, departments, doctors, packages } from "@/lib/data";

const departmentSlugs = departments.map((d) => d.slug);
const doctorSlugs = doctors.map((d) => d.slug);
const packageSlugs = packages.map((p) => p.slug);

/** Today as YYYY-MM-DD in UTC, minus one day, so users in any timezone can still book "today". */
function earliestAllowedDate() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * One schema, used twice: in the browser for instant feedback,
 * and in the Route Handler as the source of truth (never trust client-side validation alone).
 */
export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number, for example +1 800 555 0199"),
  email: z.union([z.literal(""), z.email("Enter a valid email address")]),
  department: z.enum(departmentSlugs as [string, ...string[]], { error: "Select a department" }),
  doctor: z.union([z.literal(""), z.enum(doctorSlugs as [string, ...string[]])]),
  package: z.union([z.literal(""), z.enum(packageSlugs as [string, ...string[]])]),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Choose a valid date")
    .refine((v) => v >= earliestAllowedDate(), "Choose today or a later date"),
  time: z.enum(appointmentSlots, { error: "Select a time" }),
  reason: z.string().trim().max(500, "Keep this under 500 characters"),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type AppointmentFieldErrors = Partial<Record<keyof AppointmentInput, string>>;

/** Turns a failed parse into { field: "first message" } for showing next to each input. */
export function toFieldErrors(error: z.ZodError<AppointmentInput>): AppointmentFieldErrors {
  const { fieldErrors } = z.flattenError(error);
  const result: AppointmentFieldErrors = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    const first = (messages as string[] | undefined)?.[0];
    if (first) result[key as keyof AppointmentInput] = first;
  }
  return result;
}
