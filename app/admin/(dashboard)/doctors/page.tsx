
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { getDoctors, Doctor } from "@/lib/api/doctor";
import AddDoctorSidebar from "@/components/admin/doctor/add-doctor-sidebar";
import AddDoctorButton from "@/components/admin/doctor/add-doctor-button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDoctor } from "@/lib/api/doctor";
import {
  Stethoscope,
  Users,
  Building2,
  Languages,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CalendarDays,
  BriefcaseMedical,
  X,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";





type SidebarMode = "add" | "view" | "edit";

interface DoctorsApiResponse {
  success: boolean;
  message: string;
  data:
  | Doctor[]
  | {
    doctors: Doctor[];
    total: number;
    page?: number;
    limit?: number;
  };
}

const ITEMS_PER_PAGE = 5;


// Helper
function getInitials(name: string) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Main Page
export default function DoctorsPage() {

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [sort, setSort] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();


  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getDoctors();

      console.log("Doctors API Response:", response);
      console.log("Doctors API Data:", response.data);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch doctors."
        );
      }

      const doctorsList = Array.isArray(response.data)
        ? response.data
        : response.data.doctors;

      console.log("Final Doctors List:", doctorsList);

      setDoctors(doctorsList);

    } catch (error: unknown) {
      console.error("Fetch doctors error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch doctors."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Department list
  const departments = useMemo(() => Array.from(new Set(doctors.map((doctor) => doctor.department))).sort(), [doctors]);

  // Statistics
  const stats = useMemo(() => {
    const totalExperience = doctors.reduce((total, doctor) => total + doctor.years, 0);

    const totalLanguages = new Set(doctors.flatMap((doctor) => doctor.languages));
    return [
      {
        title: "Total Doctors",
        value: doctors.length.toString().padStart(2, "0"),
        description: "Registered doctors",
        icon: Users,
      },
      {
        title: "Departments",
        value: departments.length.toString().padStart(2, "0"),
        description: "Medical departments",
        icon: Building2,
      },
      {
        title: "Avg. Experience",
        value: doctors.length ? `${(totalExperience / doctors.length).toFixed(1)} yrs` : "0 yrs",
        description: "Across all doctors",
        icon: Stethoscope,
      },
      {
        title: "Languages",
        value: totalLanguages.size.toString().padStart(2, "0"),
        description: "Languages covered",
        icon: Languages,
      },
    ];
  }, [doctors, departments]);

  // Search, filter and sort
  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(query) ||
        doctor.role.toLowerCase().includes(query) ||
        doctor.department.toLowerCase().includes(query) ||
        doctor.languages.some((language) => language.toLowerCase().includes(query));

      const matchesDepartment = department === "all" || doctor.department === department;
      return matchesSearch && matchesDepartment;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "name-desc":
          return b.name.localeCompare(a.name);

        case "experience-desc":
          return b.years - a.years;

        case "experience-asc":
          return a.years - b.years;

        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [doctors, search, department, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);

  const paginatedDoctors = filteredDoctors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const startIndex = filteredDoctors.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredDoctors.length);

  // Existing addDoctorOpen ki jagah:
  const [sidebar, setSidebar] = useState<{ open: boolean; mode: SidebarMode; doctor: Doctor | null }>({
    open: false, mode: "add", doctor: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);

  const openSidebar = (mode: SidebarMode, doctor: Doctor | null = null) =>
    setSidebar({ open: true, mode, doctor });

  // Reset pagination
  function resetFilters() {
    setSearch("");
    setDepartment("all");
    setSort("name-asc");
    setCurrentPage(1);
  }


  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await deleteDoctor(deleteTarget.id);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to delete doctor."
        );
      }

      setDeleteTarget(null);
      void fetchDoctors();

    } catch (error) {
      console.error("Delete doctor error:", error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setDeleting(false);
    }
  }


  useEffect(() => {
    void fetchDoctors();
  }, [fetchDoctors]);

  // UI
  return (


    <div className="w-full space-y-7 p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card">
            <Stethoscope className="size-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Doctors
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor your hospital doctors.
            </p>
          </div>
        </div>


        {/* Add Doctor Button */}
        <AddDoctorButton
          onClick={() => openSidebar("add")}
        />

        {/* Add Doctor Sidebar */}

        <AddDoctorSidebar
          open={sidebar.open}
          mode={sidebar.mode}
          doctor={sidebar.doctor}
          onClose={() => setSidebar((s) => ({ ...s, open: false }))}
          onSuccess={() => void fetchDoctors()}
        />

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Doctors Table Section */}
      <section className="overflow-hidden rounded-xl border bg-card">

        {/* Section Header */}
        <div className="flex flex-col gap-2 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">
              All Doctors
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              View your hospital's registered doctors and their details.
            </p>
          </div>

          <span className="w-fit rounded-md border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {filteredDoctors.length} Records
          </span>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, role or department..."
              aria-label="Search doctors"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1 sm:min-w-48">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={department}
                onChange={(event) => {
                  setDepartment(event.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by department"
                className="h-10 w-full appearance-none rounded-lg border border-input bg-background pl-9 pr-8 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">
                  All Departments
                </option>

                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort doctors"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="name-asc">
                Name: A to Z
              </option>

              <option value="name-desc">
                Name: Z to A
              </option>

              <option value="experience-desc">
                Most Experienced
              </option>

              <option value="experience-asc">
                Least Experienced
              </option>
            </select>

            {(search || department !== "all" || sort !== "name-asc") && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div
              className="space-y-4 p-6"
              aria-label="Loading doctors"
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4"
                >
                  <div className="size-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 rounded bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                  </div>
                  <div className="h-4 w-28 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 p-12 text-center">
              <p className="font-medium">Unable to load doctors</p>

              <p className="text-sm text-muted-foreground">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void fetchDoctors()}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
              >
                Try Again
              </button>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <>
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-muted/40">
                  <tr className="border-b">
                    <td className="px-5 py-4 text-xs font-semibold text-muted-foreground">
                      DOCTOR
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-muted-foreground">
                      DEPARTMENT
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-muted-foreground">
                      EXPERIENCE
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-muted-foreground">
                      AVAILABLE DAYS
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-muted-foreground">
                      LANGUAGES
                    </td>
                    <td>
                      ACTION
                    </td>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {paginatedDoctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {getInitials(doctor.name)}
                          </div>

                          <div>
                            <p className="font-medium">
                              {doctor.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doctor.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {doctor.department}
                      </td>

                      <td className="px-5 py-4">
                        {doctor.years} Years
                      </td>

                      <td className="px-5 py-4">
                        {Array.isArray(doctor.days)
                          ? doctor.days.join(", ")
                          : doctor.days}
                      </td>

                      <td className="px-5 py-4">
                        {doctor.languages.join(", ")}
                      </td>

                      <td className="px-5 py-4">


                        {/* Action */}
                        <td className="px-5 py-4 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <button
                                type="button"
                                aria-label="Doctor actions"
                                className="flex size-9 items-center justify-center rounded-lg border bg-background transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
                              >
                                <MoreHorizontal className="size-4" />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">

                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/doctors/${doctor.id}`)}
                              >
                                <Eye className="mr-2 size-4" />
                                View Details
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => openSidebar("edit", doctor)}
                              >
                                <Pencil className="mr-2 size-4" />
                                Update
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteTarget(doctor)}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>

                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>


                      </td>



                    </tr>
                  ))}
                </tbody>
              </table>



              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {startIndex}-{endIndex}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {filteredDoctors.length}
                  </span>{" "}
                  doctors
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                    aria-label="Previous page"
                    className="flex size-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  <span className="min-w-24 text-center text-sm">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                    aria-label="Next page"
                    className="flex size-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Stethoscope className="size-8 text-muted-foreground" />

              <h3 className="mt-4 font-semibold">
                No doctors found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                No doctors match your search or department filter.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm font-medium text-primary underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>




      </section>



      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteTarget(null);
            setDeleteError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Doctor?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} Will Be Removed Permanently. This Action Cannot Be Undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

