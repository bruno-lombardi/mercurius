"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  // Prevent body scroll when zoom is open
  useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isZoomOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openZoom = (index: number) => {
    setZoomIndex(index);
    setIsZoomOpen(true);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
  };

  const goToPreviousZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div 
        className="relative rounded-lg overflow-hidden shadow-lg bg-gray-100 cursor-zoom-in" 
        style={{ aspectRatio: "1/1" }}
        onClick={() => openZoom(currentIndex)}
      >
        <Image
          src={images[currentIndex]}
          alt={`${productName} - Imagem ${currentIndex + 1}`}
          width={800}
          height={800}
          className="w-full h-full object-cover"
          priority={currentIndex === 0}
        />
        
        {/* Zoom Hint */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          Clique para ampliar
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 z-10"
              aria-label="Imagem anterior"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 z-10"
              aria-label="Próxima imagem"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter - moved to not conflict with zoom hint */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-gray-800 ring-2 ring-gray-800 ring-offset-2"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator (alternative to thumbnails for mobile) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-gray-800 w-6"
                  : "bg-gray-300 hover:bg-gray-500"
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeZoom}
        >
          {/* Close Button */}
          <button
            onClick={closeZoom}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Fechar zoom"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
            {zoomIndex + 1} / {images.length}
          </div>

          {/* Zoom Image */}
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <Image
              src={images[zoomIndex]}
              alt={`${productName} - Imagem ampliada ${zoomIndex + 1}`}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPreviousZoom}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Imagem anterior"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToNextZoom}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Próxima imagem"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Touch/Click Instruction */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm">
            {images.length > 1 ? "← → para navegar • " : ""}Toque fora para fechar
          </div>
        </div>
      )}
    </div>
  );
}
