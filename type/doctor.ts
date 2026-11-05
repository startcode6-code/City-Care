
// export const DOCTOR_LANGUAGES = [
//     "ENGLISH",
//     "HINDI",
//     "MANDARIN",
//     "SPANISH",
//     "FRENCH",
//     "GERMAN",
//     "ARABIC",
//     "BENGALI",
//     "URDU",
//     "TAMIL",
//     "TELUGU",
//     "MARATHI",
//     "PUNJABI",
//     "GUJARATI",
//     "JAPANESE",
// ] as const;

// export type DoctorLanguage = (typeof DOCTOR_LANGUAGES)[number];

// export interface Doctor {
//     id: string;
//     slug: string;
//     name: string;
//     department: string;
//     role: string;
//     years: number;
//     days: string;
//     languages: DoctorLanguage[];
//     bio: string;
// }

// export interface CreateDoctorInput {
//     slug: string;
//     name: string;
//     department: string;
//     role: string;
//     years: number;
//     days: string;
//     languages: DoctorLanguage[];
//     bio: string;
// }

// export type UpdateDoctorInput = Partial<CreateDoctorInput>;

// export interface DoctorsResponse {
//     success: boolean;
//     message: string;
//     data: Doctor[] | {
//         doctors: Doctor[];
//         total: number;
//         page?: number;
//         limit?: number;
//     };
// }

// export interface DoctorResponse {
//     success: boolean;
//     message: string;
//     data: Doctor;
// }
