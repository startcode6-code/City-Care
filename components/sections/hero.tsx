import Link from "next/link";
import { Building2, Clock, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ImageSlot } from "@/components/shared/image-slot";
import { site } from "@/lib/site";
import Image from "next/image";
import { HeroImageSlider } from "../shared/hero_image_slider";



export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background pb-12 pt-12 sm:pt-20 lg:pb-16">
      {/* Full-bleed photo on the right */}

   

      <HeroImageSlider/>


      {/* <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background" /> */}

      <Container>
        <div className="max-w-xl lg:pb-24 lg:pt-6">
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-5xl">
            <span className="block">Quality Healthcare</span>
            <span className="block">You Can Trust</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
            Six specialist departments, 50+ experienced doctors and an emergency
            team on duty every hour of the day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">

            <Button 
              size="lg"
              nativeButton={false} 
             render={<Link href="/appointment">Book Appointment</Link>}>
        
            </Button>

            <Button
              size="lg"
              
              variant="outline"
              className="border-primary/40 bg-background/70 text-primary hover:bg-primary/5 hover:text-primary"
            >
              <a href={site.phoneHref}>Emergency Call</a>
            </Button>


          </div>
        </div>


      </Container>
    </section>
  );
}