import { Hero } from "@/components/sections/hero";
import { HighlightStrip } from "@/components/sections/highlight-strip";
import { AboutPreview } from "@/components/sections/about-preview";
import { DepartmentGrid } from "@/components/sections/department-grid";
import { FeaturedDoctors } from "@/components/sections/featured-doctors";
import { FacilitiesPreview } from "@/components/sections/facilities-preview";
import { PackagesPreview } from "@/components/sections/packages-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { AppointmentCta } from "@/components/sections/appointment-cta";
import { LocationMap } from "@/components/sections/location-map";
import {Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <HighlightStrip />
      <AboutPreview />
      <DepartmentGrid />
      <FeaturedDoctors />
      <FacilitiesPreview />
      <PackagesPreview />
      <Testimonials />
      <AppointmentCta />
      <LocationMap />
      <Footer/>
    </>
  );
}
