import { Container } from "@/components/shared/container";

export default function Loading() {
  return (
    <Container className="py-16" aria-busy="true">
      <span className="sr-only" role="status">
        Loading the appointment form
      </span>
      <div className="h-8 w-64 rounded-md bg-muted motion-safe:animate-pulse" />
      <div className="mt-8 h-96 rounded-xl bg-muted motion-safe:animate-pulse" />
    </Container>
  );
}
