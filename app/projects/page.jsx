"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { originalProjects } from "@/public/data/projects";
import { useRouter } from "next/navigation";

const projects = [
  ...originalProjects,
  ...originalProjects,
  ...originalProjects,
];

const getClosedMenuWidth = () => {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return "90vw";
  } else {
    return "40vw";
  }
};
const typeFilters = ["Commercial", "Residential", "Social Impact"];
const progressFilters = ["Completed", "Active Build", "Design/Planning"];

export default function VerticalProjectScroll() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState(1);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [activeHoverIndex, setActiveHoverIndex] = useState(null);
  const isCursorLarge = activeHoverIndex !== null;
  const cursorSize = isCursorLarge ? "w-16 h-16" : "w-3 h-3";

  const cursorOffset = isHoveringNav ? 40 : 6;

  const contentRef = useRef(null);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedProgressFilters, setSelectedProgressFilters] = useState([]);

  const getProgressValue = (filter) => {
    if (filter === "Completed") return "completed";
    if (filter === "Active Build" || filter === "Design/Planning")
      return "ongoing";
    return null;
  };

  const selectedProgressValues = [
    ...new Set(selectedProgressFilters.map(getProgressValue).filter(Boolean)),
  ];
  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const typeMatch =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) =>
          project.type.toLowerCase().includes(type.toLowerCase())
        );
      const progressMatch =
        selectedProgressValues.length === 0 ||
        selectedProgressValues.includes(project.progress);
      return typeMatch && progressMatch;
    });
  }, [projects, selectedTypes, selectedProgressFilters]);

  // Infinite scroll clones
  const clones = [
    ...filteredProjects,
    ...filteredProjects,
    ...filteredProjects,
  ];

  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const updateMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", updateSize);
    window.addEventListener("mousemove", updateMouse);
    updateSize();

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", updateMouse);
    };
  }, []);

  useEffect(() => {
    const handleHover = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "a" || tag === "button" || tag === "img") {
        setIsHoveringNav(true);
      } else {
        setIsHoveringNav(false);
      }
    };

    window.addEventListener("mouseover", handleHover);
    window.addEventListener("mouseout", handleHover);

    return () => {
      window.removeEventListener("mouseover", handleHover);
      window.removeEventListener("mouseout", handleHover);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const slideCount = projects.length;
    const cloneHeight = container.scrollHeight / 3;
    let ticking = false;

    // Set up Lenis instance for smooth scrolling
    const lenis = new Lenis({
      wrapper: container,
      content: contentRef.current,
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const setInitialScroll = () => {
      container.scrollTop = cloneHeight;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = container.scrollTop;

          if (scrollTop <= 0) {
            container.scrollTop = cloneHeight;
          } else if (scrollTop >= cloneHeight * 2) {
            container.scrollTop = cloneHeight;
          }

          const scrollOffset = container.scrollTop - cloneHeight;
          const slideHeight = container.scrollHeight / clones.length;
          const index = Math.floor(scrollOffset / slideHeight) % slideCount;

          setCurrentSlide(((index + slideCount) % slideCount) + 1);

          const progress = scrollOffset / cloneHeight;
          if (progressBarRef.current) {
            progressBarRef.current.style.height = `${Math.min(
              Math.max(progress * 100, 0),
              100
            )}%`;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    setInitialScroll();
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      lenis.destroy();
    };
  }, []);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const containerVariants = {
    closed: {
      width: closedMenuWidth || "40vw",
      height: "100px",
      bottom: "5rem",
      left: "50%",
      x: "-50%",
      opacity: 1,
      scale: 1,
      borderRadius: "0.75rem",
      pointerEvents: "auto",
    },
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
        stiffness: 300, // Slightly reduced stiffness for less bounciness
        damping: 25, // Slightly reduced damping for a bit more bounce
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

  return (
    <div className="relative w-full h-screen bg-white">
      {/* left section */}
      <div className="absolute h-full  left-0 top-0  bg-[#b4aea7] text-xs text-white">
        <div
          className=" mt-8  text-black font-bold flex gap-4 md:px-1 py-1 -rotate-180"
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

      <div
        className="absolute left-0 top-[50%] -translate-y-1/2 text-center font-bold text-xs text-black -rotate-180"
        style={{ writingMode: "vertical-lr" }}
      >
        {screenSize.height / 2}{" "}
      </div>

      {/* Top section  */}
      <div className="absolute  w-full h-6 bg-[#b4aea7] top-0  text-black ">
        <div
          className="absolute top-0 z-[101] font-bold text-xs  text-black "
          style={{ left: `${mousePos.x - 12}px` }}
        >
          {mousePos.x - screenSize.height}
        </div>
      </div>

      {/* right section */}

      <div className="absolute  h-full w-6 bg-[#b4aea7] top-0  right-0  text-black ">
        <div
          className="absolute font-bold text-xs right-0 text-black "
          style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
        >
          {screenSize.height - mousePos.y * 2}
        </div>
      </div>
      {/* bottom section  */}

      <div className="absolute bg-[#b4aea7] w-full  right-6 font-bold bottom-0  text-xs text-white">
        <div className="text-black flex justify-end gap-4 md:px-2 md:py-1 ">
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
          <div className="absolute bottom-0 left-[48.5%] z-[101] text-center  text-black ">
            {screenSize.width / 2}{" "}
          </div>
        </div>
      </div>

      {/* Vertical line */}
      <div
        className="pointer-events-none absolute z-[101] top-0 bottom-0 w-px bg-[#999692]/50"
        style={{ left: `${mousePos.x}px` }}
      />

      <div
        className="pointer-events-none absolute z-[101] left-0 right-0 h-px bg-[#999692]/50"
        style={{ top: `${mousePos.y}px` }}
      />

      {/* Custom Cursor */}
      {/* Custom Cursor */}
      <div
        id="custom-cursor"
        className={`pointer-events-none fixed z-[105] ${
          isHoveringNav ? `w-20 h-20` : `w-3 h-3`
        } transition-transform duration-75 ease-out`}
        style={{
          transform: `translate(${mousePos.x - cursorOffset}px, ${
            mousePos.y - cursorOffset
          }px) rotate(${isHoveringNav ? 45 : 0}deg)`,
        }}
      >
        {/* Top line */}
        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gray-100 opacity-70" />
        {/* Bottom line */}
        <div className="absolute bottom-0 left-1/2 w-px h-1/2 bg-gray-100 opacity-70" />
        {/* Left line */}
        <div className="absolute left-0 top-1/2 h-px w-1/2 bg-gray-100 opacity-70" />
        {/* Right line */}
        <div className="absolute right-0 top-1/2 h-px w-1/2 bg-gray-100 opacity-70" />
      </div>

      <div className="absolute justify-between w-[15%] top-1/2 -translate-y-1/2 right-16 z-20 flex gap-2 items-center text-sm font-mono">
        <p>/ {String(projects.length).padStart(3, "0")}</p>
        <div className="space-x-1">
          <button
            onClick={() => setViewMode(1)}
            className={`px-2 py-1 rounded-full space-x-1 transition-all duration-700 ${
              viewMode === 1 ? `font-bold` : `font-normal`
            }`}
          >
            <span>VIEW</span>
            <span
              className={`p-1 text-xs px-2 rounded-full transition-all duration-700 ${
                viewMode === 1 ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              1
            </span>
          </button>
          <button
            onClick={() => setViewMode(2)}
            className={`px-2 py-1 rounded-full space-x-1 transition-all duration-700 ${
              viewMode === 2 ? `font-bold` : `font-normal`
            }`}
          >
            <span>VIEW</span>
            <span
              className={`p-1 text-xs px-2 rounded-full transition-all duration-700 ${
                viewMode === 2 ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              2
            </span>
          </button>
        </div>
      </div>

      <div className="absolute top-1/2 left-6 -translate-y-1/2 text-xs font-bold font-mono">
        [projects]
      </div>

      <div className="absolute top-1/2 left-[15%] -translate-y-1/2 text-xs font-mono">
        {String(currentSlide).padStart(3, "0")}
      </div>

      {/* main center div  */}

      {isLeaving && (
        <motion.div
          className="fixed inset-0 z-[999] bg-[#211d1d]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}

      <div
        ref={containerRef}
        className={`relative  mx-auto  z-[100] ${
          viewMode === 2 ? `w-2/12` : `w-7/12`
        } h-full overflow-y-scroll transition-all duration-700 ease-out space-y-4 pb-10 scrollbar-hide`}
      >
        <div ref={contentRef} className="flex flex-col gap-6">
          {clones.map((proj, i) => (
            <motion.div
              key={proj.slug+i}
              initial={{ scale: 1 }}
              animate={{ scale: viewMode === 2 ? 1 : 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => {
                setIsLeaving(true);
                setTimeout(() => {
                  router.push(`/projects/${proj.slug}`);
                }, 500); // Delay must match animation duration
              }}
              onMouseEnter={() => setActiveHoverIndex(i)}
              onMouseLeave={() => setActiveHoverIndex(null)}
              className="relative w-full overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <Image
                src={proj.image}
                alt={proj.title}
                width={500}
                height={300}
                className={`w-full object-cover ${
                  viewMode == 2 ? `h-[150px]` : `h-[500px]`
                }`}
              />
              <div className="font-quicksand absolute w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center  items-center text-center flex-col md:flex-row text-white text-xs space-x-2 p-2 rounded-lg">
                <p
                  className={`${
                    viewMode == 2 ? `w-full text-[10px]` : `w-auto text-xs`
                  } bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl`}
                >
                  {proj.title}
                </p>
                <div className={`flex ${viewMode == 2 ? `hidden ` : `block`}`}>
                  <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl ">
                    {proj.type}
                  </p>
                  <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl">
                    {proj.impact}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute right-[20%] -translate-x-1/2 top-8 h-[8rem] w-[2px] bg-gray-300">
        <div
          ref={progressBarRef}
          className="w-full bg-black transition-all duration-200"
        ></div>
      </div>

      <AnimatePresence>
        <motion.div
          className={`fixed z-[9999] bg-[#211d1d] text-white flex flex-col`}
          initial={isOpen ? "closed" : "closed"} // Initial state is closed
          animate={isOpen ? "open" : "closed"} // Animate based on isOpen state
          variants={containerVariants}
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
              {[...typeFilters, ...progressFilters].map((filter) => (
                <button
                  key={filter}
                  onClick={() =>
                    typeFilters.includes(filter)
                      ? setSelectedTypes((prev) =>
                          prev.includes(filter)
                            ? prev.filter((t) => t !== filter)
                            : [...prev, filter]
                        )
                      : setSelectedProgressFilters((prev) =>
                          prev.includes(filter)
                            ? prev.filter((f) => f !== filter)
                            : [...prev, filter]
                        )
                  }
                  className={`px-3 py-1 rounded-full transition-colors duration-200 ${
                    (typeFilters.includes(filter) &&
                      selectedTypes.includes(filter)) ||
                    (progressFilters.includes(filter) &&
                      selectedProgressFilters.includes(filter))
                      ? "bg-white text-black"
                      : "bg-gray-700/20 text-gray-200 hover:text-white"
                  }`}
                  aria-pressed={
                    typeFilters.includes(filter)
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
            >
              <div
                className="absolute w-14 h-px bg-white transition-all duration-300 ease-in-out
                group-hover:rotate-45 group-hover:w-14 group-hover:translate-y-0 -translate-y-2"
              ></div>
              <div
                className="absolute w-14 h-px bg-white transition-all duration-300 ease-in-out
                group-hover:-rotate-45 group-hover:w-14 group-hover:translate-y-0 translate-y-2"
              ></div>
            </button>
          </div>

          {isOpen && (
            <>
              <AnimatePresence>
                <motion.div
                  className="flex relative flex-col items-center justify-center h-[calc(100%-80px)] p-4"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {/* Decorative grid lines */}
                  <div className="absolute left-1/2 top-0 bottom-0 flex flex-col justify-between h-full -translate-x-1/2 w-1">
                    {Array(7)
                      .fill(0)
                      .map((_, idx) => (
                        <div
                          key={`line-center-${idx}`}
                          className={`w-full h-1 ${
                            idx === 0 ? "bg-gray-100/60" : "bg-white/60"
                          }`}
                        ></div>
                      ))}
                  </div>
                  <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between h-full w-1">
                    {Array(7)
                      .fill(0)
                      .map((_, idx) => (
                        <div
                          key={`line-left-${idx}`}
                          className={`w-full h-1 ${
                            idx === 0 ? "bg-gray-100/60" : "bg-white/60"
                          }`}
                        ></div>
                      ))}
                  </div>
                  <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-between h-full w-1">
                    {Array(7)
                      .fill(0)
                      .map((_, idx) => (
                        <div
                          key={`line-right-${idx}`}
                          className={`w-full h-1 ${
                            idx === 0 ? "bg-gray-100/60" : "bg-white/60"
                          }`}
                        ></div>
                      ))}
                  </div>

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
                        window.location.href = "/projects"; // hard reload
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

                  {/* Footer contact info and social links */}
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
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
