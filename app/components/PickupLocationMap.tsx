"use client";

import { useState } from "react";

export default function PickupLocationMap() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMap = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-6">
      {/* Info Box with Accordion Button */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Local de Retirada
            </h3>
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Horto Santo Antônio</span>
              <br />
              Jundiaí - SP
            </p>
            <p className="text-xs text-blue-700 mt-2">
              📍 Agende pelo WhatsApp para combinar horário e endereço exato
            </p>

            {/* Toggle Map Button */}
            <button
              onClick={toggleMap}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              {isOpen ? "Ocultar mapa" : "Ver localização no mapa"}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Content - Map */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1833.7819303035983!2d-46.91936146090515!3d-23.18611299476484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf25cca1a633f3%3A0x41fe0309cac8ce56!2sHorto%20Santo%20Antonio%2C%20Jundia%C3%AD%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1769709218236!5m2!1spt-BR!2sbr"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de localização - Horto Santo Antônio, Jundiaí"
          />
        </div>
      </div>
    </div>
  );
}
