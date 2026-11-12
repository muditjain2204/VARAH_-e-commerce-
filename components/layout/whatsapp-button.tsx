"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const whatsappUrl =
    "https://wa.me/919461500924?text=Hello%20Maa%20Laxmi%20Sarees%2C%20I%20have%20an%20inquiry%20regarding%20your%20handcrafted%20sarees.";

  return (
    <aside aria-label="Customer Support" className="fixed bottom-6 right-6 z-40 flex items-center group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp (+91 94615 00924)"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 border-2 border-white/20"
      >
        <MessageCircle className="h-6 w-6 fill-current" />
        <span className="hidden sm:inline-block text-xs font-bold tracking-wide">
          Chat with Us
        </span>
      </a>
    </aside>
  );
}

