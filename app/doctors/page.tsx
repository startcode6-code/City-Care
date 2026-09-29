import { FeaturedDoctors } from "@/components/sections/featured-doctors"; 
import { doctors, type Doctor } from "@/lib/data";


export default function DoctorsPage() {
    return (
        <main>
            <FeaturedDoctors/>
        </main>
    );
}