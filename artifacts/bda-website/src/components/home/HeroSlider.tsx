import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  titleHindi: string | null;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  bgGradient: string;
  isActive: boolean;
  displayOrder: number;
}

const fallbackSlides = [
  {
    bg: "from-slate-900 to-teal-800",
    title: "रामायण वाटिका",
    titleEn: null,
    subtitle: "Ramayan Vatika — A Cultural Heritage Garden",
    description: "Bareilly Development Authority presents a unique cultural landmark",
    imageUrl: null,
  },
  {
    bg: "from-orange-600 to-red-800",
    title: "Smart City Initiative",
    titleEn: null,
    subtitle: "Building Tomorrow's Bareilly Today",
    description: "Modern infrastructure for sustainable urban development",
    imageUrl: null,
  },
  {
    bg: "from-green-700 to-teal-800",
    title: "Affordable Housing",
    titleEn: null,
    subtitle: "Ramganga Nagar Residential Scheme",
    description: "Quality homes for all sections of society",
    imageUrl: null,
  },
];

export function HeroSlider() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data: Banner[]) => {
        const active = data.filter((b) => b.isActive);
        if (active.length > 0) {
          setSlides(
            active.map((b) => ({
              bg: b.bgGradient || "from-slate-900 to-teal-800",
              title: b.titleHindi || b.title,
              titleEn: b.titleHindi ? b.title : null,
              subtitle: b.subtitle || "",
              description: b.description || "",
              imageUrl: b.imageUrl || null,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center bg-gradient-to-r ${slide.bg} ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={
            slide.imageUrl
              ? { backgroundImage: `url(${slide.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          {slide.imageUrl && (
            <div className="absolute inset-0 bg-black/20" />
          )}
          <div className="relative text-center text-white px-4 z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <h2
              className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)" }}
              lang={slide.title !== slide.titleEn ? "hi" : "en"}
            >
              {slide.title}
            </h2>
            {slide.subtitle && (
              <h3
                className="text-xl md:text-3xl font-bold mb-4 text-orange-300"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
              >
                {slide.subtitle}
              </h3>
            )}
            {slide.description && (
              <p
                className="text-lg md:text-xl max-w-2xl mx-auto font-medium"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
              >
                {slide.description}
              </p>
            )}
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            aria-label="Previous Slide"
            data-testid="btn-prev-slide"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            aria-label="Next Slide"
            data-testid="btn-next-slide"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === current ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`btn-slide-${index}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
