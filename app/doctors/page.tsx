import { DoctorDirectory } from "@/components/sections/doctor-directory"; 
import { doctors, type Doctor } from "@/lib/data";


export default function DoctorsPage() {
    return (
        <main>
            <DoctorDirectory doctors={doctors} departments={[]} />
        </main>
    );
}