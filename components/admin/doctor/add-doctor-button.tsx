"use client";
import { Plus } from "lucide-react";

interface AddDoctorButtonProps { onClick: () => void }

export default function AddDoctorButton({ onClick }: AddDoctorButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
            <Plus className="size-4" />
            Add Doctor
        </button>
    );
}