"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { appointmentSlots, departmentSlugFromName, departments, doctors } from "@/lib/data";
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
  | { state: "success"; reference: string; name: string; date: string; time: string };

export function AppointmentForm({
  minDate,
  defaultDepartment = "",
  defaultDoctor = "",
  packageSlug = "",
  packageName,
}: {
  minDate: string;
  defaultDepartment?: string;
  defaultDoctor?: string;
  packageSlug?: string;
  packageName?: string;
}) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<AppointmentFieldErrors>({});
  const [department, setDepartment] = useState(defaultDepartment);
  const [doctor, setDoctor] = useState(defaultDoctor);

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

  function onDepartmentChange(value: string) {
    setDepartment(value);
    // Clear the doctor if they do not belong to the newly chosen department.
    const selected = doctors.find((d) => d.slug === doctor);
    if (selected && departmentSlugFromName(selected.department) !== value) setDoctor("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      (["name", "phone", "email", "department", "doctor", "package", "date", "time", "reason"] as const).map((k) => [
        k,
        String(form.get(k) ?? ""),
      ]),
    );

    const parsed = appointmentSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setStatus({ state: "idle" });
      return;
    }

    setErrors({});
    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json().catch(() => ({}));

      if (response.status === 422 && body.fieldErrors) {
        setErrors(body.fieldErrors);
        setStatus({ state: "error", message: body.error ?? "Please correct the highlighted fields." });
        return;
      }
      if (!response.ok) {
        setStatus({ state: "error", message: body.error ?? "Something went wrong. Please try again." });
        return;
      }
      setStatus({
        state: "success",
        reference: body.reference,
        name: parsed.data.name,
        date: parsed.data.date,
        time: parsed.data.time,
      });
    } catch {
      setStatus({ state: "error", message: "We could not reach the server. Check your connection and try again." });
    }
  }

  if (status.state === "success") {
    return (
      <Card>
        <CardContent role="status" className="p-8 text-center">
          <CircleCheck className="mx-auto size-12 text-primary" aria-hidden />
          <h2 className="mt-4 text-xl font-bold">Request received</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
            Thank you, {status.name}. We have noted {status.date} at {status.time} and will confirm by phone or email.
          </p>
          <p className="mt-4 text-sm">
            Your reference number is <strong>{status.reference}</strong>
          </p>
          <Button type="button" variant="link" className="mt-4" onClick={() => setStatus({ state: "idle" })}>
            Book another appointment
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
              You are booking the <strong>{packageName}</strong> package.
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
            <Field label="Full name" name="name" error={errors.name}>
              <Input {...fieldProps("name")} autoComplete="name" required />
            </Field>
            <Field label="Phone number" name="phone" error={errors.phone}>
              <Input {...fieldProps("phone")} type="tel" autoComplete="tel" required />
            </Field>
            <Field label="Email (optional)" name="email" error={errors.email} className="sm:col-span-2">
              <Input {...fieldProps("email")} type="email" autoComplete="email" />
            </Field>
            <Field label="Department" name="department" error={errors.department}>
              <NativeSelect
                {...fieldProps("department")}
                value={department}
                onChange={(e) => onDepartmentChange(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a department
                </option>
                {departments.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Doctor (optional)" name="doctor" error={errors.doctor}>
              <NativeSelect {...fieldProps("doctor")} value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                <option value="">Any available doctor</option>
                {visibleDoctors.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Preferred date" name="date" error={errors.date}>
              <Input {...fieldProps("date")} type="date" min={minDate} required />
            </Field>
            <Field label="Preferred time" name="time" error={errors.time}>
              <NativeSelect {...fieldProps("time")} defaultValue="" required>
                <option value="" disabled>
                  Select a time
                </option>
                {appointmentSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Reason for visit (optional)" name="reason" error={errors.reason} className="sm:col-span-2">
              <Textarea {...fieldProps("reason")} rows={3} />
            </Field>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden />}
            {submitting ? "Sending request" : "Request appointment"}
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
