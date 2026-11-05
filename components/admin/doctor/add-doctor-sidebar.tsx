"use client";
import { useState, useEffect } from "react";
import {
    X,
    Plus,
    Loader2,
    UserRound,
    Stethoscope,
    BriefcaseMedical,
    CalendarDays,
    Languages,
    FileText,
    Pencil,
    Trash2
} from "lucide-react";
import { createDoctor, updateDoctor, updateDoctorPhoto, uploadDoctorPhoto } from "@/lib/api/doctor";
import type { Doctor } from "@/lib/api/doctor";
import axios from "axios";

interface AddDoctorSidebarProps {
    open: boolean;
    mode: "add" | "view" | "edit";
    doctor: Doctor | null;
    onClose: () => void;
    onSuccess: () => void;
}

const TITLES = {
    add: "Add New Doctor",
    edit: "Update Doctor",
    view: "Doctor Details",
};



interface AddDoctorSidebarProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type DoctorFormData = Omit<Doctor, "id" | "userId">;

const LANGUAGES: Doctor["languages"] = [
    "ENGLISH",
    "HINDI",
    "MANDARIN",
    "SPANISH",
    "FRENCH",
    "GERMAN",
    "ARABIC",
    "BENGALI",
    "URDU",
    "TAMIL",
    "TELUGU",
    "MARATHI",
    "PUNJABI",
    "GUJARATI",
    "JAPANESE",
];

const DEPARTMENTS = [
    "General Medicine & ICU",
    "General Surgery",
    "Orthopedics",
    "Oral & Maxillofacial Surgery",
    "Neurosurgery",
    "Plastic Surgery",
    "Urology",
    "Polytrauma",
];

const initialForm: DoctorFormData = {
    slug: "",
    name: "",
    department: "",
    role: "",
    years: 0,
    days: "",
    languages: [],
    bio: "",
    photoUrl: "",
    photoPublicId: ""
};

function generateSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export default function AddDoctorSidebar({ open, mode, doctor, onClose, onSuccess }: AddDoctorSidebarProps) {

    const [form, setForm] = useState<DoctorFormData>(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const isView = mode === "view";
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [uploadedPhoto, setUploadedPhoto] = useState<{ photoUrl: string; photoPublicId: string; } | null>(null);


    useEffect(() => {
        if (!open) return;
        setError("");

        if (doctor) {
            setForm({
                slug: doctor.slug,
                name: doctor.name,
                department: doctor.department,
                role: doctor.role,
                years: doctor.years,
                days: Array.isArray(doctor.days) ? doctor.days.join(", ") : doctor.days,
                languages: doctor.languages,
                bio: doctor.bio,
                photoUrl: doctor.photoUrl,
                photoPublicId: doctor.photoPublicId,
            });
        } else {
            setForm(initialForm);
        }
    }, [open, doctor]);

    if (!open) return null;

    function updateField<K extends keyof DoctorFormData>(field: K, value: DoctorFormData[K]) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function toggleLanguage(language: Doctor["languages"][number]) {
        setForm((previous) => ({
            ...previous,
            languages: previous.languages.includes(language)
                ? previous.languages.filter((item) => item !== language)
                : [...previous.languages, language],
        }));
    }


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        // 1. Validate doctor information
        const doctorName = form.name.trim();

        if (!doctorName) {
            setError("Please enter the doctor's name.");
            return;
        }

        if (!form.department) {
            setError("Please select a department.");
            return;
        }

        if (!form.role.trim()) {
            setError("Please enter the doctor's designation.");
            return;
        }

        if (!form.days.trim()) {
            setError("Please enter available days.");
            return;
        }

        if (form.languages.length === 0) {
            setError("Please select at least one language.");
            return;
        }

        if (!form.bio.trim()) {
            setError("Please enter the doctor's bio.");
            return;
        }

        try {
            setLoading(true);

            // 2. Prepare doctor payload
            const payload: DoctorFormData = {
                ...form,
                name: doctorName,
                slug:
                    mode === "edit" && doctor
                        ? doctor.slug
                        : generateSlug(doctorName),
                department: form.department.trim(),
                role: form.role.trim(),
                days: form.days.trim(),
                bio: form.bio.trim(),
                years: Number(form.years),
            };

            // 3. Get existing photo information
            let photoUrl = form.photoUrl || null;
            let photoPublicId = form.photoPublicId || null;

            // 4. Upload new photo if selected

            if (mode === "edit") {

                if (photo) {
                    const uploadResponse = await updateDoctorPhoto(doctor?.id ?? "", photo);

                    if (!uploadResponse?.success) {
                        throw new Error(
                            uploadResponse?.message || "Photo upload failed."
                        );
                    }

                    // Update these paths if your actual API response differs.
                    photoUrl = uploadResponse.data.photoUrl;
                    photoPublicId = uploadResponse.data.photoPublicId;

                    if (!photoUrl || !photoPublicId) {
                        throw new Error("Photo uploaded, but image URL or public ID is missing.");
                    }

                    setUploadedPhoto({ photoUrl, photoPublicId });
                }

            } else {
                if (photo) {
                    const uploadResponse = await uploadDoctorPhoto(photo);

                    if (!uploadResponse?.success) {
                        throw new Error(
                            uploadResponse?.message || "Photo upload failed."
                        );
                    }

                    // Update these paths if your actual API response differs.
                    photoUrl = uploadResponse.data.photoUrl;
                    photoPublicId = uploadResponse.data.photoPublicId;

                    if (!photoUrl || !photoPublicId) {
                        throw new Error("Photo uploaded, but image URL or public ID is missing.");
                    }

                    setUploadedPhoto({ photoUrl, photoPublicId });
                }
            }



            // 5. Add photo information to doctor payload
            const doctorPayload: DoctorFormData = {
                ...payload,
                photoUrl,
                photoPublicId,
            };

            // 6. Create or update doctor
            const response =
                mode === "edit" && doctor
                    ? await updateDoctor(doctor.id, doctorPayload)
                    : await createDoctor(doctorPayload);

            if (!response?.success) {
                throw new Error(
                    response?.message || "Failed to save doctor."
                );
            }

            // 7. Reset form after success
            setForm(initialForm);
            setPhoto(null);
            setPhotoPreview(null);
            setUploadedPhoto(null);

            onClose();
            onSuccess();

        } catch (err: unknown) {
            console.error("Doctor submission error:", err);

            if (axios.isAxiosError(err)) {
                console.error("API Status:", err.response?.status);
                console.error("API Response:", err.response?.data);

                setError(
                    err.response?.data?.message ||
                    "Request failed. Please check the submitted information."
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            }
        } finally {
            setLoading(false);
        }


    }


    function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        setError("");
        setPhoto(file);

        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
    }

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <button
                type="button"
                aria-label="Close add doctor panel"
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            {/* Sidebar */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-doctor-title"
                className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-border bg-background shadow-2xl"
            >
                {/* Header */}

                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <UserRound className="size-5" />
                            </div>
                            <h2 id="add-doctor-title" className="text-lg font-semibold tracking-tight">
                                {TITLES[mode]}
                            </h2>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Enter the doctor's professional information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                        {error && (
                            <div
                                role="alert"
                                className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                            >
                                {error}
                            </div>
                        )}

                        {/* Basic Information */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <UserRound className="size-4 text-primary" />
                                <h3 className="text-sm font-semibold">
                                    Basic Information
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Doctor Profile Photo
                                </label>

                                <div className="flex items-center gap-4">
                                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                                        {photoPreview || form.photoUrl ? (
                                            <img
                                                src={photoPreview || form.photoUrl || undefined}
                                                alt="Doctor preview"
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <UserRound className="size-10 text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="doctor-photo"
                                            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted"
                                        >
                                            <Plus className="size-4" />
                                            Upload Photo
                                        </label>

                                        <input
                                            id="doctor-photo"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />

                                        {photo && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPhoto(null);
                                                    setPhotoPreview(null);
                                                }}
                                                className="flex items-center gap-1 text-xs text-destructive"
                                            >
                                                <Trash2 className="size-3" />
                                                Remove Photo
                                            </button>
                                        )}

                                        <p className="text-xs text-muted-foreground">
                                            JPG, PNG or WebP. Maximum 5 MB.
                                        </p>
                                    </div>
                                </div>
                            </div>


                            <div className="space-y-2">
                                <label
                                    htmlFor="doctor-name"
                                    className="text-sm font-medium"
                                >
                                    Doctor Name *
                                </label>
                                <input
                                    id="doctor-name"
                                    value={form.name}
                                    onChange={(event) =>
                                        updateField("name", event.target.value)
                                    }
                                    placeholder="Enter doctor's full name"
                                    required
                                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL slug will be generated automatically.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="doctor-department"
                                        className="text-sm font-medium"
                                    >
                                        Department *
                                    </label>
                                    <select
                                        id="doctor-department"
                                        value={form.department}
                                        onChange={(event) =>
                                            updateField(
                                                "department",
                                                event.target.value
                                            )
                                        }
                                        required
                                        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                    >
                                        <option value="">
                                            Select department
                                        </option>
                                        {DEPARTMENTS.map((department) => (
                                            <option
                                                key={department}
                                                value={department}
                                            >
                                                {department}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="doctor-role"
                                        className="text-sm font-medium"
                                    >
                                        Designation *
                                    </label>
                                    <input
                                        id="doctor-role"
                                        value={form.role}
                                        onChange={(event) =>
                                            updateField(
                                                "role",
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. Senior Consultant"
                                        required
                                        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-border" />

                        {/* Professional Information */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <BriefcaseMedical className="size-4 text-primary" />
                                <h3 className="text-sm font-semibold">
                                    Professional Information
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="doctor-years"
                                    className="text-sm font-medium"
                                >
                                    Years of Experience
                                </label>
                                <input
                                    id="doctor-years"
                                    type="number"
                                    min={0}
                                    max={70}
                                    value={form.years}
                                    onChange={(event) =>
                                        updateField(
                                            "years",
                                            Number(event.target.value)
                                        )
                                    }
                                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="doctor-days"
                                    className="flex items-center gap-2 text-sm font-medium"
                                >
                                    <CalendarDays className="size-4 text-muted-foreground" />
                                    Available Days *
                                </label>
                                <input
                                    id="doctor-days"
                                    value={form.days}
                                    onChange={(event) =>
                                        updateField("days", event.target.value)
                                    }
                                    placeholder="e.g. Monday - Saturday"
                                    required
                                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Languages className="size-4 text-muted-foreground" />
                                    <label className="text-sm font-medium">
                                        Languages *
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4 sm:grid-cols-3">
                                    {LANGUAGES.map((language) => (
                                        <label
                                            key={language}
                                            className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.languages.includes(
                                                    language
                                                )}
                                                onChange={() =>
                                                    toggleLanguage(language)
                                                }
                                                className="size-4 rounded border-input accent-primary"
                                            />
                                            {language.charAt(0) +
                                                language
                                                    .slice(1)
                                                    .toLowerCase()}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-border" />

                        {/* Bio */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 text-primary" />
                                <h3 className="text-sm font-semibold">
                                    About Doctor
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="doctor-bio"
                                    className="text-sm font-medium"
                                >
                                    Biography *
                                </label>
                                <textarea
                                    id="doctor-bio"
                                    rows={5}
                                    value={form.bio}
                                    onChange={(event) =>
                                        updateField("bio", event.target.value)
                                    }
                                    placeholder="Write a short professional biography..."
                                    required
                                    className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                                />
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-border bg-background px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="h-10 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Plus className="size-4" />
                            )}
                            {loading ? "Saving..." : "Save Doctor"}
                        </button>
                    </div>
                </form>
            </aside>
        </div>
    );
}