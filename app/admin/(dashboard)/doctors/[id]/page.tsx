
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    Languages,
    Stethoscope,
    UserRound,
    Award,
    Loader2,
} from "lucide-react";

import { getDoctors, type Doctor } from "@/lib/api/doctor";

export default function DoctorDetailsPage() {
    const params = useParams<{ id: string }>();
    const doctorId = params.id;

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchDoctor() {
            try {
                setLoading(true);
                setError("");

                const response = await getDoctors();

                if (response.success) {
                    const foundDoctor = response.data.find(
                        (item: Doctor) => item.id === doctorId
                    );

                    if (!foundDoctor) {
                        setError("Doctor not found.");
                        return;
                    }

                    setDoctor(foundDoctor);
                } else {
                    setError(response.message || "Unable to load doctor.");
                }
            } catch {
                setError("Something went wrong while loading doctor details.");
            } finally {
                setLoading(false);
            }
        }

        if (doctorId) {
            void fetchDoctor();
        }
    }, [doctorId]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading doctor details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <Stethoscope className="size-12 text-muted-foreground" />

                <h2 className="text-xl font-semibold">
                    {error || "Doctor not found"}
                </h2>

                <Link
                    href="/admin/doctors"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    Back to Doctors
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">

                <div>
                    <Link
                        href="/admin/doctors"
                        className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Doctors
                    </Link>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Doctor Profile
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        View complete professional information.
                    </p>
                </div>

                <span className="rounded-lg border bg-muted/40 px-3 py-2 text-xs font-medium">
                    Doctor ID: {doctor.id.slice(0, 8)}
                </span>

            </div>

            {/* Profile Hero */}
            <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">

                <div className="relative h-36 bg-gradient-to-r from-primary/20 via-primary/10 to-background sm:h-48">

                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />

                </div>

                <div className="relative px-5 pb-6 sm:px-8">

                    <div className="-mt-20 flex flex-col gap-5 sm:-mt-24 sm:flex-row sm:items-end">

                        {/* Doctor Image */}
                        <div className="group relative size-36 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:size-44">

                            {doctor.photoUrl ? (
                                <Image
                                    src={doctor.photoUrl}
                                    alt={doctor.name}
                                    fill
                                    priority
                                    unoptimized
                                    sizes="176px"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                                    {doctor.name
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((word) => word[0])
                                        .join("")}
                                </div>
                            )}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        </div>

                        {/* Doctor Name */}
                        <div className="min-w-0 flex-1 pb-1">

                            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                <Award className="size-3.5" />
                                Registered Doctor
                            </span>

                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                {doctor.name}
                            </h2>

                            <p className="mt-1 text-muted-foreground">
                                {doctor.role}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">

                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium">
                                    <Stethoscope className="size-3.5 text-primary" />
                                    {doctor.department}
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium">
                                    <BriefcaseBusiness className="size-3.5 text-primary" />
                                    {doctor.years} Years Experience
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Professional Information */}
            <section className="space-y-4">

                <div>
                    <h3 className="text-lg font-semibold">
                        Professional Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Doctor's professional and appointment information.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Department */}
                    <div className="group rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">

                        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                            <Stethoscope className="size-5" />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Department
                        </p>

                        <p className="mt-1 font-semibold">
                            {doctor.department}
                        </p>

                    </div>

                    {/* Role */}
                    <div className="group rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">

                        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-transform duration-300 group-hover:scale-110">
                            <UserRound className="size-5" />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Professional Role
                        </p>

                        <p className="mt-1 font-semibold">
                            {doctor.role}
                        </p>

                    </div>

                    {/* Experience */}
                    <div className="group rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">

                        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                            <Award className="size-5" />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Experience
                        </p>

                        <p className="mt-1 text-xl font-bold">
                            {doctor.years} Years
                        </p>

                    </div>

                    {/* Available Days */}
                    <div className="group rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">

                        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-green-500/10 text-green-600 transition-transform duration-300 group-hover:scale-110">
                            <CalendarDays className="size-5" />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Available Days
                        </p>

                        <p className="mt-2 text-sm font-semibold leading-6">
                            {Array.isArray(doctor.days)
                                ? doctor.days.join(", ")
                                : doctor.days}
                        </p>

                    </div>

                    {/* Languages */}
                    <div className="group rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:col-span-2">

                        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 transition-transform duration-300 group-hover:scale-110">
                            <Languages className="size-5" />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Languages Spoken
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {doctor.languages.map((language) => (
                                <span
                                    key={language}
                                    className="rounded-lg border bg-muted/50 px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                                >
                                    {language}
                                </span>
                            ))}
                        </div>

                    </div>

                </div>

            </section>

            {/* About Doctor */}
            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">

                <div className="mb-4 flex items-center gap-3">

                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UserRound className="size-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            About Doctor
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Professional Biography
                        </p>
                    </div>

                </div>

                <p className="text-sm leading-7 text-muted-foreground">
                    {doctor.bio || "No professional biography available."}
                </p>

            </section>

        </div>
    );
}
