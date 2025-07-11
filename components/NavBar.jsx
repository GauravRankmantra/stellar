"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";


const getClosedMenuWidth = () => {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return "90vw";
  } else {
    return "45vw";
  }
};
export default function Navbar() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 }); // Not currently used, but good to keep if needed
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const cursorSize = isHoveringNav ? "w-16 h-16" : "w-3 h-3";
  const navRef = useRef(null);
  const footerRef = useRef(null);

  const [showNav, setShowNav] = useState(true);

  // useEffect(() => {
  //   const updateSize = () => {
  //     setScreenSize({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   };

  //   const updateMouse = (e) => {
  //     setMousePos({ x: e.clientX, y: e.clientY });
  //   };

  //   window.addEventListener("resize", updateSize);
  //   window.addEventListener("mousemove", updateMouse);
  //   updateSize();

  //   return () => {
  //     window.removeEventListener("resize", updateSize);
  //     window.removeEventListener("mousemove", updateMouse);
  //   };
  // }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const containerVariants = {
    closed: {
      width: closedMenuWidth || "40vw",
      height: "80px",
      bottom: "7rem",
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

  useEffect(() => {
    if (isOpen) {
      const handleMouseMove = (event) => {
        setMousePos({ x: event.clientX, y: event.clientY });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {showNav && (
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
          ref={(el) => {
            if (el) navRef.current = el;
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
              {/* Custom Cursor (only visible when menu is open) */}
              <div
                className={`absolute pointer-events-none z-50 transition-all ease-in-out duration-100 ${cursorSize}`}
                style={{
                  top: mousePos.y - (isHoveringNav ? 24 : 6), // Adjust for cursor size
                  left: mousePos.x - (isHoveringNav ? 24 : 6),
                }}
              >
                <div
                  className={`absolute transition-transform duration-300 left-1/2 top-0 bottom-0 w-px bg-white opacity-70 ${
                    isHoveringNav ? `rotate-45` : `rotate-0`
                  }`}
                />
                <div
                  className={`absolute transition-transform duration-300 top-1/2 left-0 right-0 h-px bg-white opacity-70 ${
                    isHoveringNav ? `rotate-45` : `rotate-0`
                  }`}
                />
              </div>

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
      )}
    </AnimatePresence>
  );
}
