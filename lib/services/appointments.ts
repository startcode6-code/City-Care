import { randomUUID } from "node:crypto";
import type { AppointmentInput } from "@/lib/validations/appointment";

export type CreatedAppointment = { reference: string };

/**
 * Server-side appointment logic lives here, not in the UI.
 * TODO: save `input` to your database and/or notify the front desk by email.
 * Nothing is stored yet, so the reference below is only a confirmation number for the patient.
 */
export async function createAppointment(input: AppointmentInput): Promise<CreatedAppointment> {
  void input;
  const reference = `APT-${randomUUID().slice(0, 8).toUpperCase()}`;
  return { reference };
}
