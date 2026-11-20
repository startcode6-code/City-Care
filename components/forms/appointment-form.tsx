"use client";


import { useState, type FormEvent } from "react";
import type { Doctor } from "@/lib/api/doctor";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

import { createAppointment } from "@/lib/api/appointments";

import {
  appointmentSlots,
  departmentSlugFromName,
  departments,
} from "@/lib/data";

import {
  appointmentSchema,
  toFieldErrors,
  type AppointmentFieldErrors,
  type AppointmentInput,
} from "@/lib/validations/appointment";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; message: string }
  | {
    state: "success";
    reference: string;
    name: string;
    date: string;
    time: string;
  };

type AppointmentFormProps = {
  minDate: string;
  defaultDepartment?: string;
  defaultDoctor?: string;
  packageSlug?: string;
  packageName?: string;
  doctors: Doctor[];
};

// Shape of an axios error response coming from the backend
type ApiError = {
  response?: {
    status?: number;
    data?: {
      error?: string;
      message?: string;
      fieldErrors?: AppointmentFieldErrors;
    };
  };
};

export function AppointmentForm({
  minDate,
  defaultDepartment = "",
  defaultDoctor = "",
  packageSlug = "",
  packageName,
  doctors,
}: AppointmentFormProps) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<AppointmentFieldErrors>({});
  const [department, setDepartment] = useState(defaultDepartment);
  const [selectedDoctor, setSelectedDoctor] = useState(defaultDoctor);

  // Filter doctors according to selected department
  const visibleDoctors = department
    ? doctors.filter((d) => departmentSlugFromName(d.department) === department)
    : doctors;

  function fieldProps(name: keyof AppointmentInput) {
    return {
      id: name,
      name,
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    } as const;
  }

  // Department change handler
  function onDepartmentChange(value: string) {
    setDepartment(value);

    const selected = doctors.find((d) => d.slug === selectedDoctor);

    if (selected && departmentSlugFromName(selected.department) !== value) {
      setSelectedDoctor("");
    }
  }

  // Appointment form submit
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const values = Object.fromEntries(
      (
        [
          "name",
          "phone",
          "email",
          "department",
          "doctor",
          "package",
          "date",
          "time",
          "reason",
        ] as const
      ).map((k) => [k, String(form.get(k) ?? "")])
    );

    const parsed = appointmentSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setStatus({ state: "idle" });
      return;
    }

    // Check selected doctor against the API data
    if (
      parsed.data.doctor &&
      !doctors.some((d) => d.slug === parsed.data.doctor)
    ) {
      setErrors({ doctor: "Please Select A Valid Doctor." });
      setStatus({ state: "idle" });
      return;
    }

    setErrors({});
    setStatus({ state: "submitting" });

    try {
      const created = await createAppointment(parsed.data);

      setStatus({
        state: "success",
        reference: created.reference,
        name: parsed.data.name,
        date: parsed.data.date,
        time: parsed.data.time,
      });
    } catch (err: unknown) {
      const res = (err as ApiError).response;

      // No response means network or server is unreachable
      if (!res) {
        setStatus({
          state: "error",
          message:
            "We Could Not Reach The Server. Check Your Connection And Try Again.",
        });
        return;
      }

      if (res.status === 422 && res.data?.fieldErrors) {
        setErrors(res.data.fieldErrors);
      }

      setStatus({
        state: "error",
        message:
          res.data?.error ??
          res.data?.message ??
          "Something Went Wrong. Please Try Again.",
      });
    }
  }

  // Success screen
  if (status.state === "success") {
    return (
      <Card>
        <CardContent role="status" className="p-8 text-center">
          <CircleCheck className="mx-auto size-12 text-primary" aria-hidden />

          <h2 className="mt-4 text-xl font-bold">Request Received</h2>

          <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
            Thank You, {status.name}. We Have Noted {status.date} At{" "}
            {status.time} And Will Confirm By Phone Or Email.
          </p>

          <p className="mt-4 text-sm">
            Your Reference Number Is <strong>{status.reference}</strong>
          </p>

          <Button
            type="button"
            variant="link"
            className="mt-4"
            onClick={() => setStatus({ state: "idle" })}
          >
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    );
  }

  const submitting = status.state === "submitting";

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={onSubmit} noValidate aria-busy={submitting}>
          {packageName && (
            <p className="mb-5 rounded-md bg-accent px-4 py-3 text-sm text-accent-foreground">
              You Are Booking The <strong>{packageName}</strong> Package.
            </p>
          )}

          <input type="hidden" name="package" value={packageSlug} />

          {status.state === "error" && (
            <div
              role="alert"
              className="mb-5 flex gap-3 rounded-md border border-destructive p-4 text-sm text-destructive"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {status.message}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" name="name" error={errors.name}>
              <Input {...fieldProps("name")} autoComplete="name" required />
            </Field>

            <Field label="Phone Number" name="phone" error={errors.phone}>
              <Input
                {...fieldProps("phone")}
                type="tel"
                autoComplete="tel"
                required
              />
            </Field>

            <Field
              label="Email (Optional)"
              name="email"
              error={errors.email}
              className="sm:col-span-2"
            >
              <Input
                {...fieldProps("email")}
                type="email"
                autoComplete="email"
              />
            </Field>

            <Field
              label="Department"
              name="department"
              error={errors.department}
            >
              <NativeSelect
                {...fieldProps("department")}
                value={department}
                onChange={(e) => onDepartmentChange(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select A Department
                </option>

                {departments.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>

            <Field
              label="Doctor (Optional)"
              name="doctor"
              error={errors.doctor}
            >
              <NativeSelect
                {...fieldProps("doctor")}
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">Any Available Doctor</option>

                {visibleDoctors.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>

            <Field label="Preferred Date" name="date" error={errors.date}>
              <Input
                {...fieldProps("date")}
                type="date"
                min={minDate}
                required
              />
            </Field>

            <Field label="Preferred Time" name="time" error={errors.time}>
              <NativeSelect {...fieldProps("time")} defaultValue="" required>
                <option value="" disabled>
                  Select A Time
                </option>

                {appointmentSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </NativeSelect>
            </Field>

            <Field
              label="Reason For Visit (Optional)"
              name="reason"
              error={errors.reason}
              className="sm:col-span-2"
            >
              <Textarea {...fieldProps("reason")} rows={3} />
            </Field>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full sm:w-auto"
            disabled={submitting}
          >
            {submitting && (
              <Loader2
                className="animate-spin motion-reduce:animate-none"
                aria-hidden
              />
            )}

            {submitting ? "Sending Request" : "Request Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  name,
  error,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="mb-2 block">
        {label}
      </Label>

      {children}

      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}