"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
const getClosedMenuWidth = () => {
  // Using Tailwind's default 'md' breakpoint (768px) as an example
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return "90vw";
  } else {
    return "40vw";
  }
};

const slides = [
  {
    title: "The Stefanie H. Weill Center",
    type: "ACTIVE BUILD",
    impact: "SOCIAL-IMPACT",
    location: "Atlanta, GA",
    image: "/images/bg1.jpg",
  },
  {
    title: "Harmony Resort Hotel",
    type: "HOSPITALITY",
    impact: "LUXURY",
    location: "Malta",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "Seabreeze Yacht Club",
    type: "MARINE INFRASTRUCTURE",
    impact: "HIGH-END",
    location: "Valletta, Malta",
    image: "/images/bg2.jpg",
  },
  {
    title: "The Stefanie H. Weill Center",
    type: "ACTIVE BUILD",
    impact: "SOCIAL-IMPACT",
    location: "Atlanta, GA",
    image: "/images/bg1.jpg",
  },
];

function Slide({ slide }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <div ref={ref} className="w-screen h-screen flex-shrink-0 relative">
      <img
        src={slide.image}
        alt={slide.title}
        className="object-cover w-full absolute top-0 left-0"
        initial={{ scale: 1.15 }}
        animate={controls}
        variants={{
          visible: {
            scale: 1,
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
          },
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 h-full w-full flex flex-col justify-between  text-white">
        <h2
          className="text-4xl lg:text-[5.5rem] font-bold absolute top-2 md:top-10 tracking-tighter md:leading-[4.5rem] left-2 md:left-4 uppercase text-white w-11/12  whitespace-pre-wrap  z-10"
          initial={{ opacity: 0, y: 60 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              },
            },
          }}
        >
          {slide.title}
        </h2>
        <div className="font-quicksand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center  items-center text-center flex-col md:flex-row text-white text-xs space-x-2 p-2 rounded-lg">
          <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl">
            {slide.title}
          </p>
          <div className="flex  ">
            <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl ">
              {slide.type}
            </p>
            <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl">
              {slide.location}
            </p>
          </div>
        </div>
        <div className="absolute hidden md:block  left-2 bg-gray-700/20 backdrop-blur-md px-2 py-1 font-normal rounded-2xl  text-white font-quicksand  text-xs top-1/2 -translate-y-1/2">
          <p>{"[Feature Project]"}</p>
        </div>
      </div>
    </div>
  );
}

export default function HorizontalScroll() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const cursorSize = isHoveringNav ? "w-16 h-16" : "w-3 h-3";


  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => 1 - Math.pow(1 - t, 2),
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 10000));
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current;

      const slidesEls = Array.from(wrapper.children);
      const vw = window.innerWidth;
      console.log("vw", vw);

      slidesEls.forEach((el) => gsap.set(el, { width: vw }));
      gsap.set(wrapper, {
        display: "flex",
        width: vw * slidesEls.length + 500,
      });

      gsap.to(wrapper, {
        x: () => -(vw * (slidesEls.length - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.5,
          
          end: () => `+=${vw * (slidesEls.length - 1)}`,
          snap: {
            snapTo: 1 / (slidesEls.length - 1),
            duration: 0.5,
            ease: "power1.out",
          },
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const containerVariants = {
    closed: {
      width: closedMenuWidth || "40vw",
      height: "80px",
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
        stiffness: 400, // Adjust for bounciness
        damping: 30, // Adjust for dampening
        duration: 0.7, // Overall duration of the transition
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3, // Delay content animation slightly after menu opens
        duration: 0.9,
      },
    },
  };

  return (
    <>
      <div ref={containerRef} className="relative m-6 my-auto z-10 overflow-hidden ">
        <div ref={wrapperRef} className=" flex">
          {slides.map((s, i) => (
            <Slide key={i} slide={s} />
          ))}
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          className={`fixed z-[9999] bg-gray-950/95 text-white flex flex-col`}
          initial={isOpen ? "closed" : "closed"}
          animate={isOpen ? "open" : "closed"}
          variants={containerVariants}
        >
          <div className="flex justify-between items-center px-4 py-3">
            <div className="">
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
              <div
                className={`absolute ${cursorSize} transition-all ease-in-out pointer-events-none z-50`}
                style={{
                  top: mousePos.y - (isHoveringNav ? 24 : 6),
                  left: mousePos.x - (isHoveringNav ? 24 : 6),
                }}
              >
                <div
                  className={`absolute ${
                    isHoveringNav ? `rotate-45` : `rotate-0`
                  } transition-transform duration-300 left-1/2 top-0 bottom-0 w-px bg-white opacity-70`}
                />
                <div
                  className={`absolute ${
                    isHoveringNav ? `rotate-45` : `rotate-0`
                  } transition-transform duration-300 top-1/2 left-0 right-0 h-px bg-white opacity-70`}
                />
              </div>
              <AnimatePresence>
                <motion.div
                  className="flex relative  flex-col items-center justify-center h-[calc(100%-80px)] p-4"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="absolute left-1/2 top-auto flex flex-col justify-between  h-screen">
                    <div className="w-1 bg-gray-100/60 h-1"></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                  </div>

                  <div className="absolute left-1 top-auto flex flex-col justify-between  h-screen">
                    <div className="w-1 bg-gray-100/60 h-1"></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                  </div>

                  <div className="absolute right-1 top-auto flex flex-col justify-between h-screen">
                    <div className="w-1 bg-gray-100/60 h-1"></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                    <div className="w-1 bg-white/60 h-1 "></div>
                  </div>

                  <nav className="text-xl md:text-5xl gap-[5rem] font-montserrat grid grid-cols-2 items-center md:gap-[15rem] font-bold">
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
                  <div className="flex px-10 md:flex-row flex-col w-full justify-start md:justify-between items-start space-y-3 md:space-y-0 md:items-center absolute bottom-6 font-quicksand text-xs font-light md:px-3">
                    <p className="flex flex-col">
                      224 W MONTGOMERY ST
                      <span>VILLA RICA, GEORGIA 30180</span>{" "}
                    </p>
                    <p className="flex flex-col">
                      steller@gmail.com
                      <span>+91 xxxxxxxxx</span>{" "}
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
      <div className="h-screen bg-gray-950/95 flex items-center justify-center text-white">
        <h2 className="text-4xl">Footer section </h2>
      </div>
    </>
  );
}
