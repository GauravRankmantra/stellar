"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { title: "Welcome", subtitle: "Section 1", image: "/images/bg1.jpg" },
  { title: "Inspire", subtitle: "Section 2", image: "/images/bg2.jpg" },
  { title: "Create", subtitle: "Section 3", image: "/images/bg1.jpg" },
  { title: "Imagine", subtitle: "Section 4", image: "/images/bg2.jpg" },
  { title: "Build", subtitle: "Section 5", image: "/images/bg1.jpg" },
  { title: "Dream", subtitle: "Section 6", image: "/images/bg2.jpg" },
  { title: "Visualize", subtitle: "Section 7", image: "/images/bg1.jpg" },
  { title: "Shape", subtitle: "Section 8", image: "/images/bg2.jpg" },
  { title: "Launch", subtitle: "Section 9", image: "/images/bg1.jpg" },
  { title: "Evolve", subtitle: "Section 10", image: "/images/bg2.jpg" },
];

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      orientation: "horizontal", // Force horizontal scrolling
      gestureOrientation: "horizontal", // Only respond to horizontal gestures
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const sections = gsap.utils.toArray(".panel");

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + container!.offsetWidth,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-[calc(100vh-32px)] md:h-[calc(100vh-48px)] overflow-hidden"
    >
      <div className="flex w-[1000vw]">
        {sections.map((section, index) => (
          <section
            key={index}
            className="panel relative w-screen h-full flex items-center justify-center text-white"
          >
            <div className="absolute inset-0">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative z-20 text-center space-y-4 px-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold">
                {section.title}
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                {section.subtitle}
              </p>
            </motion.div>
          </section>
        ))}
      </div>
    </div>
  );
}