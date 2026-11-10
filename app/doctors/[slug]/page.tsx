
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicDoctors } from "@/lib/api/doctor";

export default async function DoctorDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let doctor;

    try {
        const response = await getPublicDoctors();

        if (!response.success) {
            throw new Error("Failed to fetch doctors.");
        }

        doctor = response.data.find(
            (item) => item.slug === slug
        );
    } catch (error) {
        console.error("Doctor details fetch error:", error);
        throw error;
    }

    if (!doctor) {
        notFound();
    }

    const doctorImage = doctor.photoUrl || "/images/dr_images.png";

    const languages = Array.isArray(doctor.languages)
        ? doctor.languages.join(", ")
        : doctor.languages;

    return (
        <main className="min-h-screen bg-background">
            {/* Doctor Header */}
            <section className="border-b bg-muted/30">
                <div className="mx-auto max-w-6xl px-5 py-4 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary">
                        Home
                    </Link>
                    {" / "}
                    <Link href="/doctors" className="hover:text-primary">
                        Doctors
                    </Link>
                    {" / "}
                    <span className="text-foreground">
                        {doctor.name}
                    </span>
                </div>

                <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[300px_1fr]">
                    {/* Doctor Image */}
                    <div className="group relative h-[360px] w-full overflow-hidden rounded-3xl bg-muted">
                        <Image
                            src={doctorImage}
                            alt={doctor.name}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>

                    {/* Doctor Information */}
                    <div className="flex flex-col justify-center">
                        <span className="w-fit rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                            {doctor.department}
                        </span>

                        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
                            {doctor.name}
                        </h1>

                        <p className="mt-3 text-lg text-primary">
                            {doctor.role}
                        </p>

                        <p className="mt-5 leading-7 text-muted-foreground">
                            {doctor.bio}
                        </p>

                        {/* Doctor Stats */}
                        <div className="mt-7 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border bg-card p-4">
                                <p className="text-2xl font-bold">
                                    {doctor.years}+
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Years of experience
                                </p>
                            </div>

                            <div className="rounded-xl border bg-card p-4">
                                <p className="font-semibold">
                                    Consultation Days
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {doctor.days}
                                </p>
                            </div>

                            <div className="rounded-xl border bg-card p-4">
                                <p className="font-semibold">
                                    Languages
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {languages}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={`/appointment?doctor=${doctor.slug}`}
                                className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
                            >
                                Book Appointment →
                            </Link>

                            <Link
                                href="/doctors"
                                className="rounded-xl border px-6 py-3 font-medium hover:bg-muted"
                            >
                                All Doctors
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doctor Details */}
            <section className="mx-auto max-w-6xl px-5 py-12">
                <div className="rounded-2xl border bg-card p-6 sm:p-8">
                    <h2 className="text-2xl font-bold">
                        About {doctor.name}
                    </h2>

                    <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                        {doctor.bio}
                    </p>

                    <h3 className="mt-8 text-lg font-semibold">
                        Department
                    </h3>

                    <p className="mt-2 text-muted-foreground">
                        {doctor.department}
                    </p>

                    <h3 className="mt-6 text-lg font-semibold">
                        Languages Spoken
                    </h3>

                    <p className="mt-2 text-muted-foreground">
                        {languages}
                    </p>
                </div>
            </section>
        </main>
    );
}
