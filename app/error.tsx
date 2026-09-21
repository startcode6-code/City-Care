"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">This page could not be loaded. Please try again.</p>
      <Button type="button" className="mt-6" onClick={reset}>
        Try again
      </Button>
    </Container>
  );
}
