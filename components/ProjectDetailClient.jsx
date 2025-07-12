"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Lenis from "@studio-freight/lenis";
import NavBar from "./NavBar";
import MarqueeText from "./MarqueeText";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Constants
const CURSOR_OFFSET_DEFAULT = 6;
const CURSOR_OFFSET_HOVER = 40;

// Animation variants
const metaVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1 + 0.4,
      duration: 0.6,
      ease: "backOut",
    },
  }),
};

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 1.05,
    transition: {
      duration: 0.5,
      ease: "easeIn"
    }
  }
};

const ProjectDetailClient = ({ project, nextProject }) => {
  const containerRef = useRef(null);
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const router = useRouter();

  // State management - minimized re-renders
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Memoized values
  const cursorOffset = useMemo(() => 
    isHoveringNav ? CURSOR_OFFSET_HOVER : CURSOR_OFFSET_DEFAULT, 
    [isHoveringNav]
  );

  // Generate image sizes once and memoize
  const imageSizes = useMemo(() => {
    if (typeof window === "undefined" || !project.gallery?.length) return [];
    
    const maxHeight = window.innerHeight - 50;
    return project.gallery.map(() => {
      const width = Math.floor(Math.random() * (1000 - 600 + 1)) + 600;
      const minHeight = 500;
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      return { width, height };
    });
  }, [project.gallery]);

  // Memoized project metadata
  const projectMetadata = useMemo(() => [
    project.title,
    project.type,
    project.progress,
    project.location
  ], [project.title, project.type, project.progress, project.location]);

  // Optimized event handlers with useCallback
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleResize = useCallback(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleHover = useCallback((e) => {
    const tag = e.target.tagName.toLowerCase();
    const isInteractiveElement = ["a", "button", "span"].includes(tag);
    setIsHoveringNav(isInteractiveElement);
  }, []);

  const handleNavigate = useCallback((path) => {
    setIsExiting(true);
    setTimeout(() => {
      router.push(path);
    }, 500);
  }, [router]);

  // Initialize screen size and entering animation
  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    const timeout = setTimeout(() => setIsEntering(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  // Mouse and resize event listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mouseover", handleHover, { passive: true });
    window.addEventListener("mouseout", handleHover, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseover", handleHover);
      window.removeEventListener("mouseout", handleHover);
    };
  }, [handleMouseMove, handleResize, handleHover]);

  // Smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      orientation: "horizontal",
      smooth: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Memoized coordinate displays to prevent unnecessary re-renders
  const CoordinateDisplay = useMemo(() => (
    <>
      {/* Left section */}
      <div className="fixed h-full left-0 top-0 z-[100] bg-transparent text-xs text-white">
        <div
          className="mt-8 text-black font-bold flex gap-4 md:px-1 py-1 -rotate-180"
          style={{ writingMode: "vertical-lr" }}
        >
          <p>
            <span className="border text-[8px] py-1 md:px-[0.15rem] rounded-full">
              Y
            </span>{" "}
            {mousePos.y}
          </p>
          <p>
            <span className="border text-[8px] py-1 md:px-[0.15rem] rounded-full">
              H
            </span>{" "}
            {screenSize.height}
          </p>
        </div>
      </div>

      {/* Center vertical line */}
      <div
        className="fixed left-0 top-1/2 z-[100] -translate-y-1/2 text-center font-bold text-xs text-black -rotate-180"
        style={{ writingMode: "vertical-lr" }}
      >
        {Math.floor(screenSize.height / 2)}
      </div>

      {/* Top section */}
      <div className="fixed w-full h-6 bg-transparent top-0 z-[100] text-black">
        <div
          className="fixed top-0 z-[101] font-bold text-xs text-black"
          style={{ left: `${mousePos.x - 12}px` }}
        >
          {mousePos.x - screenSize.height}
        </div>
      </div>

      {/* Right section */}
      <div className="fixed h-full w-6 bg-transparent top-0 right-0 z-[100] text-black">
        <div
          className="fixed font-bold text-xs right-0 text-black"
          style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
        >
          {screenSize.height - mousePos.y * 2}
        </div>
      </div>

      {/* Bottom section */}
      <div className="fixed bg-transparent w-full bottom-0 right-6 z-[100] font-bold text-xs text-white">
        <div className="text-black flex justify-end gap-4 md:px-2 md:py-1">
          <p>
            <span className="border text-[8px] px-1 md:py-1 md:px-[0.25rem] rounded-full">
              X
            </span>
            {mousePos.x}
          </p>
          <p>
            <span className="border text-[8px] px-1 md:py-1 md:px-[0.25rem] rounded-full">
              W
            </span>
            {screenSize.width}
          </p>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-[101] text-center text-black">
            {Math.floor(screenSize.width / 2)}
          </div>
        </div>
      </div>
    </>
  ), [mousePos, screenSize]);

  // Memoized crosshair and cursor
  const CrosshairCursor = useMemo(() => (
    <>
      {/* Crosshair lines */}
      <div
        className="pointer-events-none fixed z-[101] top-0 bottom-0 w-px bg-[#999692]/50"
        style={{ left: `${mousePos.x}px` }}
      />
      <div
        className="pointer-events-none fixed z-[101] left-0 right-0 h-px bg-[#999692]/50"
        style={{ top: `${mousePos.y}px` }}
      />

      {/* Custom cursor */}
      <div
        className={`pointer-events-none fixed z-[105] ${
          isHoveringNav ? `w-20 h-20` : `w-3 h-3`
        } transition-transform duration-75 ease-out`}
        style={{
          transform: `translate(${mousePos.x - cursorOffset}px, ${
            mousePos.y - cursorOffset
          }px) rotate(${isHoveringNav ? 45 : 0}deg)`,
        }}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-70" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-70" />
      </div>
    </>
  ), [mousePos, isHoveringNav, cursorOffset]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={containerRef}
        className="flex relative h-screen w-max"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key={project.slug}
      >
        {/* Page transition overlays */}
        <AnimatePresence>
          {isEntering && (
            <motion.div
              className="fixed inset-0 z-[999] bg-[#211d1d]"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
          {isExiting && (
            <motion.div
              className="fixed inset-0 z-[999] bg-[#211d1d]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
            />
          )}
        </AnimatePresence>

        {CoordinateDisplay}
        {CrosshairCursor}

        {/* Hero section with optimized background image */}
        <section className="h-screen w-screen bg-cover bg-center flex items-center justify-center text-white text-5xl font-bold shrink-0 relative overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
          />
        </section>

        {/* Project metadata overlay */}
        <motion.div
          className="font-bold fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-2 flex-wrap will-change-transform z-[200]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {projectMetadata.map((item, i) => (
            <motion.span
              key={i}
              className="px-3 py-1 text-center rounded-full bg-white/10 backdrop-blur-sm text-sm"
              variants={metaVariants}
              custom={i}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

        <NavBar />

        <div className="absolute bottom-0">
          <MarqueeText text={project.title} speed={80} />
        </div>

        {/* Content section */}
        <section
          className="h-screen z-[50] w-max text-black shrink-0 flex text-4xl font-bold"
          style={{ backgroundColor: `white` }}
        >
          <div className="flex">
            {/* Project details */}
            <div className="text-xs font-mono font-medium p-6 max-w-md">
              <div className="grid grid-cols-2 mb-6 gap-y-2">
                <div className="uppercase space-y-1">
                  <p>Location</p>
                  <p>Status</p>
                  <p>Cost</p>
                  <p>Year</p>
                  <p>Partners</p>
                </div>
                <div className="space-y-1">
                  <p>{project.location}</p>
                  <p>{project.progress}</p>
                  <p>{project.cost}</p>
                  <p>{project.year}</p>
                  <p>{project.partners}</p>
                </div>
              </div>
              <div className="space-y-4">
                {project.description?.map((descText, index) => (
                  <p key={index} className="leading-relaxed">
                    {descText}
                  </p>
                ))}
              </div>
            </div>

            {/* Gallery with optimized images */}
            {imageSizes.length === project.gallery?.length && (
              <div className="flex items-center gap-10 px-6">
                {project.gallery.map((image, index) => {
                  const { width, height } = imageSizes[index];
                  const isPriority = index < 3; // First 3 images are priority
                  
                  return (
                    <div
                      key={index}
                      className="relative flex-shrink-0 overflow-hidden rounded-lg"
                      style={{ width: `${width}px`, height: `${height}px` }}
                    >
                      <Image
                        src={image}
                        alt={`${project.title} gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={isPriority}
                        quality={isPriority ? 85 : 75}
                        loading={isPriority ? "eager" : "lazy"}
                        sizes={`${width}px`}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Next project */}
            <div className="ml-6 relative w-[20rem] h-full flex-shrink-0">
              <Image
                src={nextProject.image}
                alt={nextProject.title}
                fill
                className="object-cover"
                quality={75}
                sizes="320px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute top-1/2 text-gray-300 font-mono text-sm left-4">
                <button
                  className="flex p-2 flex-col cursor-pointer hover:text-white transition-colors duration-200"
                  onClick={() => handleNavigate(`/projects/${nextProject.slug}`)}
                >
                  <span>Next project:</span>
                  <span className="text-white font-semibold">{nextProject.title}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetailClient;