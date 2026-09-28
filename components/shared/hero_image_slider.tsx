"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const heroImages = [
  {
    src: "/images/ChatGPTPM.png",
    alt: "Doctor consulting a patient at City Care Hospital",
  },
  {
    src: "/images/hospital_with_dr.png",
    alt: "Doctor providing healthcare at City Care Hospital",
  },
  {
    src: "/images/hospital_image.png",
    alt: "City Care Hospital building",
  },
];

export function HeroImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 -z-20">
      {heroImages.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            // className="object-cover object-top dark:brightness-50 dark:contrast-110"
          />
        </div>
      ))}
    </div>
  );
}