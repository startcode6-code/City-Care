import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
  const phoneNumber = "9320482163";

  return (
    <Link
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
    >
      <FaWhatsapp className="size-8" />
    </Link>
  );
}