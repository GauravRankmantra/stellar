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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
} // Helper to get menu width based on screen size
const getClosedMenuWidth = () => {
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

const titleVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: 45,
    filter: "blur(8px)",
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 0.77, 0.47, 0.97],
      delay: 0.2,
    },
  },
};

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

function Slide({ slide }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false }); // Trigger when 50% of the slide is in view

  useEffect(() => {
    const ctx = gsap.context(() => {
      const image = ref.current.querySelector(".parallax-image");
      const title = ref.current.querySelector(".slide-title");
      const meta = ref.current.querySelector(".slide-meta");

      const mainHorizontalScroll = ScrollTrigger.getById("horizontalScroll");

      if (mainHorizontalScroll) {
        // Enhanced parallax effect with depth layers
        gsap.to(image, {
          yPercent: -10,
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            containerAnimation: mainHorizontalScroll,
            start: "left right",
            end: "right left",
            scrub: 1,
          },
        });

        // Title parallax with more subtle movement
        gsap.to(title, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            containerAnimation: mainHorizontalScroll,
            start: "left right",
            end: "right left",
            scrub: 1.2,
          },
        });

        // Meta tags with individual parallax effects
        gsap.to(meta.children, {
          yPercent: (i) => -5 * (i + 1),
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            containerAnimation: mainHorizontalScroll,
            start: "left right",
            end: "right left",
            scrub: 1.5,
          },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="lg:w-screen h-screen flex-shrink-0 relative overflow-hidden"
    >
      <Image
        src={slide.image}
        alt={slide.title}
        fill={true}
        style={{ objectFit: "cover" }}
        className="parallax-image will-change-transform"
        priority={true}
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80" />

      <div className="relative  z-10 h-full w-full px-6 py-8 lg:px-8 lg:py-8 text-white">
        <motion.h2
          className="slide-title w-11/12 lg:w-6/12 font-gilroy text-5xl lg:text-7xl font-bold uppercase tracking-[-0.3rem] will-change-transform"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {slide.title}
        </motion.h2>

        <motion.div
          className="slide-meta font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-2 flex-wrap will-change-transform"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {[slide.title, slide.type, slide.impact, slide.location].map(
            (item, i) => (
              <motion.span
                key={i}
                className="px-3 py-1 text-center rounded-full bg-white/10 backdrop-blur-sm text-sm"
                variants={metaVariants}
                custom={i}
              >
                {item}
              </motion.span>
            )
          )}
        </motion.div>

        <motion.div
          className="slide-meta hidden lg:flex font-bold absolute top-1/2 left-12 -translate-x-1/2 -translate-y-1/2  gap-2 will-change-transform"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.span
            className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm"
            variants={metaVariants}
          >
            [projects]
          </motion.span>
        </motion.div>
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
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 }); // Not currently used, but good to keep if needed
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const cursorSize = isHoveringNav ? "w-16 h-16" : "w-3 h-3";
  const navRef = useRef(null);
  const footerRef = useRef(null);

  const [showNav, setShowNav] = useState(true);

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

  // --- Lenis Scroll Initialization ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current;
      const slidesEls = Array.from(wrapper.children);
      const vw = window.innerWidth;

      slidesEls.forEach((el) => gsap.set(el, { width: vw }));
      gsap.set(wrapper, {
        display: "flex",
        width: vw * slidesEls.length,
      });

      gsap.to(wrapper, {
        x: () => -(vw * (slidesEls.length - 1)),
        ease: "none",

        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.5,
          id: "horizontalScroll",
          end: () => `+=${vw * (slidesEls.length - 1)}`,
          snap: {
            snapTo: 1 / (slidesEls.length - 1),
            duration: 0.5,
            ease: "power1.out",
          },
          invalidateOnRefresh: true,
          scroller: window,
          onUpdate: (self) => {
            const atOrPastEnd = self.progress >= 2;
    
       
            setShowNav(!atOrPastEnd);
            console.log(showNav)
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

useEffect(() => {
  if (!navRef.current || !footerRef.current) return;

  ScrollTrigger.matchMedia({
    // Desktop
    "(min-width: 768px)": () => {
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top bottom",
        end: "top+=20% bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(navRef.current, {
            y: p * 50,
            opacity: 1 - p,
          });
        },
        onLeave: () => setShowNav(false),
        onEnterBack: () => setShowNav(true),
      });
    },

    // Mobile
    "(max-width: 767px)": () => {
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top bottom",
        end: "top+=35% bottom", // longer fade for smaller screens
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(navRef.current, {
            y: p * 40, // smaller vertical movement
            opacity: 1 - p,
          });
        },
        onLeave: () => setShowNav(false),
        onEnterBack: () => setShowNav(true),
      });
    },
  });

  return () => {
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
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
    <>
      <div
        ref={containerRef}
        className="relative  z-10 overflow-hidden"
      >
        <div ref={wrapperRef} className="flex">
          {slides.map((s, i) => (
            <Slide key={i} slide={s} />
          ))}
        </div>
      </div>
      {/* this animate presence should blend to the footer and it should dissapair, and come back when scrolled backward */}
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
            ref={navRef}
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

      {/* footer section */}
      <div
        ref={footerRef}
        className="h-[22rem] relative bg-[#211d1d] z-[102] mt-6 px-6 text-white/80"
      >
        <div className="flex flex-col gap-6 lg:flex-row justify-between items-center text-sm font-mono font-medium">
          <div className="md:w-3/12">
            <div className="text-xs flex justify-center lg:justify-start items-center  font-mono gap-4 mt-4">
              <Link href="/">HOMEPAGE</Link>
              <Link href="/project">PROJECT</Link>
              <Link href="/">ABOUT</Link>
              <Link href="/">CONTACT</Link>
            </div>
            <p className="font-mono text-center lg:text-start text-sm mt-4">
              We’re a creative, collaborative, research based, social enterprise
              architecture firm continuously making an effort to impact the
              community.
            </p>
          </div>

          <div className="text-center">
            <p>224 W MONTGOMERY ST </p>
            <p>VILLA RICA, GEORGIA 30180</p>
          </div>
          <div>
            <p>+ 678 282 7974</p>
            <p>HELLO@RADGA.COM</p>
          </div>
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
        <div>
          <div className="absolute w-full bg-transparent  bottom-2 right-0 z-[100] font-bold text-xs text-white">
            <div className="text-white/50 flex justify-end gap-4 md:px-4 md:py-1">
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
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-[101] text-center ">
                {Math.floor(screenSize.width / 2)}
              </div>
              <div className="absolute bottom-0 left-14 transform -translate-x-1/2 z-[101] text-center ">
                <Link href="/privacy-policy">Privacy policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
