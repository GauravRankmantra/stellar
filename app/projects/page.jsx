"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { originalProjects } from "@/public/data/projects";
import { useRouter } from "next/navigation";

// Constants
const MOBILE_BREAKPOINT = 768;
const CLONE_COUNT = 3;
const CURSOR_OFFSET_DEFAULT = 6;
const CURSOR_OFFSET_HOVER = 40;

const TYPE_FILTERS = ["Commercial", "Residential", "Social Impact"];
const PROGRESS_FILTERS = ["Completed", "Active Build", "Design/Planning"];

// Animation variants
const containerVariants = {
  closed: (closedMenuWidth) => ({
    width: closedMenuWidth,
    height: "100px",
    bottom: "5rem",
    left: "50%",
    x: "-50%",
    opacity: 1,
    scale: 1,
    borderRadius: "0.75rem",
    pointerEvents: "auto",
  }),
  open: {
    width: "100%",
    height: "100%",
    bottom: "0",
    left: "0",
    x: "0",
    opacity: 1,
    scale: 1,
    borderRadius: "0",
    pointerEvents: "auto",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.7,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.9,
    },
  },
};

// Utility functions
const getClosedMenuWidth = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth < MOBILE_BREAKPOINT ? "90vw" : "40vw";
  }
  return "40vw";
};

const getProgressValue = (filter) => {
  switch (filter) {
    case "Completed":
      return "completed";
    case "Active Build":
    case "Design/Planning":
      return "ongoing";
    default:
      return null;
  }
};

// Main component
export default function VerticalProjectScroll() {
  const router = useRouter();
  
  // Add performance monitoring
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Component rendering:', Date.now());
  }
  
  // State management
  const [isLeaving, setIsLeaving] = useState(false);
  const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHoverIndex, setActiveHoverIndex] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedProgressFilters, setSelectedProgressFilters] = useState([]);

  // Refs
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  // Memoized values
  const originalProjectsCount = useMemo(() => originalProjects.length, []);
  
  const projects = useMemo(() => {
    const clonedProjects = [];
    for (let i = 0; i < CLONE_COUNT; i++) {
      clonedProjects.push(...originalProjects);
    }
    return clonedProjects;
  }, []);

  const selectedProgressValues = useMemo(() => {
    return [...new Set(selectedProgressFilters.map(getProgressValue).filter(Boolean))];
  }, [selectedProgressFilters]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const typeMatch = selectedTypes.length === 0 || 
        selectedTypes.some((type) => 
          project.type.toLowerCase().includes(type.toLowerCase())
        );
      const progressMatch = selectedProgressValues.length === 0 || 
        selectedProgressValues.includes(project.progress);
      return typeMatch && progressMatch;
    });
  }, [projects, selectedTypes, selectedProgressValues]);

  const clones = useMemo(() => {
    const result = [];
    for (let i = 0; i < CLONE_COUNT; i++) {
      result.push(...filteredProjects);
    }
    return result;
  }, [filteredProjects]);

  // Event handlers
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleResize = useCallback(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setClosedMenuWidth(getClosedMenuWidth());
  }, []);

  const handleMouseOver = useCallback((e) => {
    const tag = e.target.tagName.toLowerCase();
    const isInteractiveElement = ["a", "button", "img"].includes(tag);
    setIsHoveringNav(isInteractiveElement);
  }, []);

  const handleProjectClick = useCallback((slug) => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push(`/projects/${slug}`);
    }, 500);
  }, [router]);

  const handleTypeFilterToggle = useCallback((filter) => {
    setSelectedTypes(prev => 
      prev.includes(filter) 
        ? prev.filter(t => t !== filter)
        : [...prev, filter]
    );
  }, []);

  const handleProgressFilterToggle = useCallback((filter) => {
    setSelectedProgressFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Effects
  useEffect(() => {
    handleResize();
    
    // Throttle mouse move events
    let mouseMoveTimeout;
    const throttledMouseMove = (e) => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = setTimeout(() => {
        handleMouseMove(e);
        mouseMoveTimeout = null;
      }, 16); // ~60fps
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", throttledMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOver);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", throttledMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOver);
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
    };
  }, [handleResize, handleMouseMove, handleMouseOver]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slideCount = originalProjectsCount;
    const cloneHeight = container.scrollHeight / CLONE_COUNT;
    let ticking = false;
    let lastScrollTime = 0;

    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      wrapper: container,
      content: contentRef.current,
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      wheelMultiplier: 0.8, // Reduced for better performance
      touchMultiplier: 1.2,
      smoothTouch: false, // Disable smooth touch for better mobile performance
      normalizeWheel: true,
    });

    lenisRef.current = lenis;

    // Optimized RAF loop
    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    // Set initial scroll position
    const setInitialScroll = () => {
      container.scrollTop = cloneHeight;
    };

    // Highly optimized scroll handler
    const handleScroll = () => {
      const now = performance.now();
      
      // Throttle scroll events to 60fps max
      if (now - lastScrollTime < 16) return;
      lastScrollTime = now;

      if (ticking) return;
      
      ticking = true;
      
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;

        // Infinite scroll logic (most critical part)
        if (scrollTop <= 0) {
          container.scrollTop = cloneHeight;
        } else if (scrollTop >= cloneHeight * 2) {
          container.scrollTop = cloneHeight;
        }

        // Batch DOM updates
        const scrollOffset = container.scrollTop - cloneHeight;
        const slideHeight = container.scrollHeight / clones.length;
        const index = Math.floor(scrollOffset / slideHeight) % slideCount;
        const newSlide = ((index + slideCount) % slideCount) + 1;
        
        // Only update if slide changed
        if (newSlide !== currentSlide) {
          setCurrentSlide(newSlide);
        }

        // Update progress bar efficiently
        const progress = Math.min(Math.max((scrollOffset / cloneHeight) * 100, 0), 100);
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleY(${progress / 100})`;
          progressBarRef.current.style.transformOrigin = 'top';
        }

        ticking = false;
      });
    };

    // Use passive event listener for better performance
    const passiveScrollOptions = { passive: true };
    
    setInitialScroll();
    container.addEventListener("scroll", handleScroll, passiveScrollOptions);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [clones.length, originalProjectsCount, currentSlide]);

  // Render methods
  const renderCoordinateDisplay = () => (
    <>
      {/* Left section */}
      <div className="absolute h-full left-0 top-0 bg-[#b4aea7] text-xs text-white">
        <div
          className="mt-8 text-black font-bold flex gap-4 md:px-1 py-1 -rotate-180"
          style={{ writingMode: "vertical-lr" }}
        >
          <p>
            <span className="border text-[8px] py-1 md:py-1 md:px-[0.15rem] rounded-full">
              H
            </span>{" "}
            {screenSize.height}
          </p>
          <p>
            <span className="border text-[8px] py-1 md:py-1 md:px-[0.15rem] rounded-full">
              Y
            </span>{" "}
            {mousePos.y}
          </p>
        </div>
      </div>

      {/* Vertical center line */}
      <div
        className="absolute left-0 top-[50%] -translate-y-1/2 text-center font-bold text-xs text-black -rotate-180"
        style={{ writingMode: "vertical-lr" }}
      >
        {Math.floor(screenSize.height / 2)}
      </div>

      {/* Top section */}
      <div className="absolute w-full h-6 bg-[#b4aea7] top-0 text-black">
        <div
          className="absolute top-0 z-[101] font-bold text-xs text-black"
          style={{ left: `${mousePos.x - 12}px` }}
        >
          {mousePos.x - screenSize.height}
        </div>
      </div>

      {/* Right section */}
      <div className="absolute h-full w-6 bg-[#b4aea7] top-0 right-0 text-black">
        <div
          className="absolute font-bold text-xs right-0 text-black"
          style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
        >
          {screenSize.height - mousePos.y * 2}
        </div>
      </div>

      {/* Bottom section */}
      <div className="absolute bg-[#b4aea7] w-full right-6 font-bold bottom-0 text-xs text-white">
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
          <div className="absolute bottom-0 left-[48.5%] z-[101] text-center text-black">
            {Math.floor(screenSize.width / 2)}
          </div>
        </div>
      </div>
    </>
  );

  const renderCursor = () => {
    const cursorSize = isHoveringNav ? 20 : 3;
    const cursorOffset = isHoveringNav ? CURSOR_OFFSET_HOVER : CURSOR_OFFSET_DEFAULT;

    return (
      <div
        id="custom-cursor"
        className="pointer-events-none fixed z-[105] transition-transform duration-75 ease-out"
        style={{
          width: `${cursorSize * 4}px`,
          height: `${cursorSize * 4}px`,
          transform: `translate(${mousePos.x - cursorOffset}px, ${
            mousePos.y - cursorOffset
          }px) rotate(${isHoveringNav ? 45 : 0}deg)`,
        }}
      >
        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gray-100 opacity-70" />
        <div className="absolute bottom-0 left-1/2 w-px h-1/2 bg-gray-100 opacity-70" />
        <div className="absolute left-0 top-1/2 h-px w-1/2 bg-gray-100 opacity-70" />
        <div className="absolute right-0 top-1/2 h-px w-1/2 bg-gray-100 opacity-70" />
      </div>
    );
  };

  const renderViewControls = () => (
    <div className="absolute justify-between w-[15%] top-1/2 -translate-y-1/2 right-16 z-20 flex gap-2 items-center text-sm font-mono">
      <p>/ {String(originalProjectsCount).padStart(3, "0")}</p>
      <div className="space-x-1">
        {[1, 2].map((mode) => (
          <button
            key={mode}
            onClick={() => handleViewModeChange(mode)}
            className={`px-2 py-1 rounded-full space-x-1 transition-all duration-700 ${
              viewMode === mode ? "font-bold" : "font-normal"
            }`}
          >
            <span>VIEW</span>
            <span
              className={`p-1 text-xs px-2 rounded-full transition-all duration-700 ${
                viewMode === mode ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {mode}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProjectGrid = () => (
    <div
      ref={containerRef}
      className={`relative mx-auto z-[100] ${
        viewMode === 2 ? "w-2/12" : "w-7/12"
      } h-full overflow-y-scroll transition-all duration-700 ease-out space-y-4 pb-10 scrollbar-hide`}
    >
      <div ref={contentRef} className="flex flex-col gap-6">
        {clones.map((proj, i) => {
          // Calculate if image should be prioritized (first 3 images)
          const isPriority = i < 3;
          // Calculate if image is likely in viewport (rough estimation)
          const isLikelyVisible = i < 10;
          
          return (
            <motion.div
              key={`${proj.slug}-${i}`}
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleProjectClick(proj.slug)}
              onMouseEnter={() => setActiveHoverIndex(i)}
              onMouseLeave={() => setActiveHoverIndex(null)}
              className="relative w-full overflow-hidden rounded-lg shadow-lg cursor-pointer will-change-transform"
            >
              <Image
                src={proj.image}
                alt={proj.title}
                width={viewMode === 2 ? 250 : 500}
                height={viewMode === 2 ? 150 : 500}
                className={`w-full object-cover ${
                  viewMode === 2 ? "h-[150px]" : "h-[500px]"
                }`}
                priority={isPriority}
                quality={viewMode === 2 ? 60 : 75} // Lower quality for smaller images
                loading={isPriority ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
                sizes={viewMode === 2 ? "200px" : "500px"}
                style={{
                  transform: 'translateZ(0)', // Force GPU acceleration
                }}
              />
              <div className="font-quicksand absolute w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-center flex-col md:flex-row text-white text-xs space-x-2 p-2 rounded-lg">
                <p
                  className={`${
                    viewMode === 2 ? "w-full text-[10px]" : "w-auto text-xs"
                  } bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl`}
                >
                  {proj.title}
                </p>
                <div className={`flex ${viewMode === 2 ? "hidden" : "block"}`}>
                  <p className="bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl">
                    {proj.type}
                  </p>
                  <p className="bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl">
                    {proj.impact}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderMenu = () => (
    <AnimatePresence>
      <motion.div
        className="fixed z-[9999] bg-[#211d1d] text-white flex flex-col"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        custom={closedMenuWidth}
        exit={{
          opacity: 0,
          y: 50,
          width: 1000,
          transition: { duration: 0.5 },
        }}
      >
        <div className="flex justify-between items-center px-4 py-3">
          <div>
            <h1 className="text-xs md:text-sm font-quicksand font-light tracking-wide">
              STELLER
            </h1>
            <h1 className="text-xs md:text-sm font-quicksand font-light tracking-wide">
              ARCHITECTURE+
            </h1>
            <h1 className="text-xs md:text-sm font-quicksand font-light tracking-wide">
              LAB
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2 p-2 text-xs font-quicksand font-light">
            {[...TYPE_FILTERS, ...PROGRESS_FILTERS].map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  TYPE_FILTERS.includes(filter)
                    ? handleTypeFilterToggle(filter)
                    : handleProgressFilterToggle(filter)
                }
                className={`px-3 py-1 rounded-full transition-colors duration-200 ${
                  (TYPE_FILTERS.includes(filter) && selectedTypes.includes(filter)) ||
                  (PROGRESS_FILTERS.includes(filter) && selectedProgressFilters.includes(filter))
                    ? "bg-white text-black"
                    : "bg-gray-700/20 text-gray-200 hover:text-white"
                }`}
                aria-pressed={
                  TYPE_FILTERS.includes(filter)
                    ? selectedTypes.includes(filter)
                    : selectedProgressFilters.includes(filter)
                }
                aria-label={`Toggle ${filter} filter`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={toggleMenu}
            className="group relative w-16 h-16 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out rounded-full hover:bg-white/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className="absolute w-14 h-px bg-white transition-all duration-300 ease-in-out group-hover:rotate-45 group-hover:w-14 group-hover:translate-y-0 -translate-y-2" />
            <div className="absolute w-14 h-px bg-white transition-all duration-300 ease-in-out group-hover:-rotate-45 group-hover:w-14 group-hover:translate-y-0 translate-y-2" />
          </button>
        </div>

        {isOpen && (
          <AnimatePresence>
            <motion.div
              className="flex relative flex-col items-center justify-center h-[calc(100%-80px)] p-4"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Decorative grid lines */}
              {[
                { position: "left-1/2 -translate-x-1/2", key: "center" },
                { position: "left-1", key: "left" },
                { position: "right-1", key: "right" },
              ].map(({ position, key }) => (
                <div
                  key={key}
                  className={`absolute ${position} top-0 bottom-0 flex flex-col justify-between h-full w-1`}
                >
                  {Array(7)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={`line-${key}-${idx}`}
                        className={`w-full h-1 ${
                          idx === 0 ? "bg-gray-100/60" : "bg-white/60"
                        }`}
                      />
                    ))}
                </div>
              ))}

              {/* Navigation Links */}
              <nav className="text-xl md:text-5xl gap-[5rem] font-montserrat grid grid-cols-2 items-center md:gap-[15rem] font-bold z-10">
                <a
                  href="#"
                  className="block text-gray-400 hover:text-gray-100 transition-colors duration-200"
                  onMouseEnter={() => setIsHoveringNav(true)}
                  onMouseLeave={() => setIsHoveringNav(false)}
                >
                  HOMEPAGE
                </a>
                <Link
                  href="/projects"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/projects";
                  }}
                  className="block text-gray-400 hover:text-gray-100 transition-colors duration-200"
                  onMouseEnter={() => setIsHoveringNav(true)}
                  onMouseLeave={() => setIsHoveringNav(false)}
                >
                  PROJECTS
                </Link>
                <a
                  href="#"
                  className="block text-gray-400 hover:text-gray-100 transition-colors duration-200"
                  onMouseEnter={() => setIsHoveringNav(true)}
                  onMouseLeave={() => setIsHoveringNav(false)}
                >
                  ABOUT US
                </a>
                <a
                  href="#"
                  className="block text-gray-400 hover:text-gray-100 transition-colors duration-200"
                  onMouseEnter={() => setIsHoveringNav(true)}
                  onMouseLeave={() => setIsHoveringNav(false)}
                >
                  CONTACT
                </a>
              </nav>

              {/* Footer */}
              <div className="flex px-10 md:flex-row flex-col w-full justify-start md:justify-between items-start space-y-3 md:space-y-0 md:items-center absolute bottom-6 font-quicksand text-xs font-light md:px-3 z-10">
                <p className="flex flex-col">
                  224 W MONTGOMERY ST
                  <span>VILLA RICA, GEORGIA 30180</span>
                </p>
                <p className="flex flex-col">
                  steller@gmail.com
                  <span>+91 xxxxxxxxx</span>
                </p>
                <div className="flex justify-center items-center space-x-3 text-lg">
                  <a
                    href="https://www.facebook.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors duration-200"
                    aria-label="Facebook"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://www.instagram.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors duration-200"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="relative w-full h-screen bg-white">
      {renderCoordinateDisplay()}

      {/* Crosshair lines */}
      <div
        className="pointer-events-none absolute z-[101] top-0 bottom-0 w-px bg-[#999692]/50"
        style={{ left: `${mousePos.x}px` }}
      />
      <div
        className="pointer-events-none absolute z-[101] left-0 right-0 h-px bg-[#999692]/50"
        style={{ top: `${mousePos.y}px` }}
      />

      {renderCursor()}
      {renderViewControls()}

      <div className="absolute top-1/2 left-6 -translate-y-1/2 text-xs font-bold font-mono">
        [projects]
      </div>

      <div className="absolute top-1/2 left-[15%] -translate-y-1/2 text-xs font-mono">
        {String(currentSlide).padStart(3, "0")}
      </div>

      {/* Loading overlay */}
      {isLeaving && (
        <motion.div
          className="fixed inset-0 z-[999] bg-[#211d1d]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}

      {renderProjectGrid()}

      {/* Progress bar */}
      <div className="absolute right-[20%] -translate-x-1/2 top-8 h-[8rem] w-[2px] bg-gray-300">
        <div
          ref={progressBarRef}
          className="w-full bg-black origin-top transition-transform duration-100 ease-out"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>

      {renderMenu()}
    </div>
  );
}