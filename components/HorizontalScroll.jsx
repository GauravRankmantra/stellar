"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper to get menu width based on screen size
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
      duration: 0.8,
      ease: [0.16, 0.77, 0.47, 0.97],
      delay: 0.1,
    },
  },
};

const metaVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08 + 0.3,
      duration: 0.5,
      ease: "backOut",
    },
  }),
};

function Slide({ slide, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const gsapCtx = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Store the context for proper cleanup
    gsapCtx.current = gsap.context(() => {
      const image = element.querySelector(".parallax-image");
      const title = element.querySelector(".slide-title");
      const meta = element.querySelector(".slide-meta");

      if (!image || !title || !meta) return;

      const mainHorizontalScroll = ScrollTrigger.getById("horizontalScroll");

      if (mainHorizontalScroll) {
        // Create animations with proper cleanup
        gsap.to(image, {
          yPercent: -8,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            containerAnimation: mainHorizontalScroll,
            start: "left right",
            end: "right left",
            scrub: 0.8,
            id: `slide-image-${index}`, // Add unique ID for tracking
          },
        });

        gsap.to(title, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            containerAnimation: mainHorizontalScroll,
            start: "left right",
            end: "right left",
            scrub: 1,
            id: `slide-title-${index}`, // Add unique ID for tracking
          },
        });

        gsap.to(meta.children, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            containerAnimation: mainHorizontalScroll,
            start: "left right",
            end: "right left",
            scrub: 1.2,
            id: `slide-meta-${index}`, // Add unique ID for tracking
          },
        });
      }
    }, element);

    return () => {
      // Proper cleanup
      if (gsapCtx.current) {
        gsapCtx.current.revert();
      }
    };
  }, [index]);

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
        priority={index === 0}
        sizes="100vw"
        quality={85}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80" />

      <div className="relative z-10 h-full w-full px-6 py-8 lg:px-8 lg:py-8 text-white">
        <motion.h2
          className="slide-title w-11/12 lg:w-6/12 font-gilroy text-4xl lg:text-7xl font-bold uppercase tracking-[-0.2rem] lg:tracking-[-0.3rem] will-change-transform"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {slide.title}
        </motion.h2>

        <motion.div
          className="slide-meta font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-2 flex-wrap will-change-transform"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
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
          className="slide-meta hidden lg:flex font-bold absolute top-1/2 left-20 -translate-x-1/2 -translate-y-1/2 gap-2 will-change-transform"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
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
  const navRef = useRef(null);
  const footerRef = useRef(null);
  const lenisRef = useRef(null);
  const mainGsapCtx = useRef(null);
  const router = useRouter();
  
  const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const cursorSize = isHoveringNav ? "w-16 h-16" : "w-3 h-3";

  // Memoized calculations
  const isTouch = useMemo(() => {
    return typeof window !== "undefined" && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Cleanup function for all animations
  const cleanupAnimations = useCallback(() => {
    // Kill all ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Revert main GSAP context
    if (mainGsapCtx.current) {
      mainGsapCtx.current.revert();
    }
    
    // Destroy Lenis
    if (lenisRef.current) {
      lenisRef.current.destroy();
    }
    
    // Clear all GSAP tweens
    gsap.killTweensOf("*");
  }, []);

  // Handle navigation with proper cleanup
  const handleNavigation = useCallback((href) => {
    setIsNavigating(true);
    
    // First cleanup all animations
    cleanupAnimations();
    
    // Small delay to ensure cleanup is complete
    setTimeout(() => {
      router.push(href);
    }, 100);
  }, [cleanupAnimations, router]);

  // Optimized resize handler
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setScreenSize({ width, height });
    setClosedMenuWidth(getClosedMenuWidth());
    setIsMobile(width < 768);
  }, []);

  // Optimized mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (!isNavigating) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isNavigating]);

  // Setup event listeners
  useEffect(() => {
    handleResize();
    
    window.addEventListener("resize", handleResize);
    
    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (!isTouch) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [handleResize, handleMouseMove, isTouch]);

  // Improved Lenis Scroll Initialization
  useEffect(() => {
    if (isNavigating) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
      syncTouch: true,
      gestureOrientationM: true,
    });

    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      if (!isNavigating) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    };
    rafId = requestAnimationFrame(raf);

    lenis.on("scroll", (e) => {
      if (!isNavigating) {
        ScrollTrigger.update();
      }
    });

    const preventDefault = (e) => {
      if (e.touches && e.touches.length > 1) return;
      e.preventDefault();
    };

    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [isNavigating]);

  // Horizontal scroll setup with integrated navigation visibility
  useEffect(() => {
    if (isNavigating) return;

    mainGsapCtx.current = gsap.context(() => {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      const nav = navRef.current;
      const footer = footerRef.current;
      
      if (!wrapper || !container || !nav || !footer) return;

      const slidesEls = Array.from(wrapper.children);
      const vw = window.innerWidth;

      // Set up slides
      slidesEls.forEach((el) => {
        gsap.set(el, { width: vw });
      });
      
      gsap.set(wrapper, {
        display: "flex",
        width: vw * slidesEls.length,
      });

      // Main horizontal scroll animation
      const scrollTween = gsap.to(wrapper, {
        x: () => -(vw * (slidesEls.length - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: isMobile ? 0.8 : 0.5,
          id: "horizontalScroll",
          end: () => `+=${vw * (slidesEls.length - 1)}`,
          snap: {
            snapTo: 1 / (slidesEls.length - 1),
            duration: isMobile ? 0.8 : 0.5,
            ease: "power2.out",
          },
          invalidateOnRefresh: true,
        },
      });

      // Navigation visibility trigger
      const navTrigger = ScrollTrigger.create({
        trigger: footer,
        start: "top bottom-=50px",
        end: "top+=15% bottom",
        scrub: 1,
        id: "navTrigger",
        onUpdate: (self) => {
          if (isNavigating) return;
          
          const progress = self.progress;
          
          gsap.set(nav, {
            y: progress * (isMobile ? 25 : 40),
            opacity: Math.max(0, 1 - progress * 1.2),
            scale: Math.max(0.95, 1 - progress * 0.05),
          });
        },
        onEnter: () => setShowNav(true),
        onLeave: () => setShowNav(false),
        onEnterBack: () => setShowNav(true),
        onLeaveBack: () => setShowNav(true),
      });

    }, containerRef);

    return () => {
      if (mainGsapCtx.current) {
        mainGsapCtx.current.revert();
      }
    };
  }, [isMobile, isNavigating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAnimations();
    };
  }, [cleanupAnimations]);

  const toggleMenu = useCallback(() => {
    if (!isNavigating) {
      setIsOpen(prev => !prev);
    }
  }, [isNavigating]);

  // Optimized container variants
  const containerVariants = useMemo(() => ({
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
        stiffness: 280,
        damping: 22,
        duration: 0.6,
      },
    },
  }), [closedMenuWidth]);

  const contentVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.8,
      },
    },
  }), []);

  return (
    <>
      <div ref={containerRef} className="relative z-10 overflow-hidden">
        <div ref={wrapperRef} className="flex">
          {slides.map((slide, index) => (
            <Slide key={`${slide.title}-${slide.location}-${index}`} slide={slide} index={index} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showNav && !isNavigating && (
          <motion.div
            className="fixed z-[9999] bg-[#211d1d] text-white flex flex-col"
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={containerVariants}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.98,
              transition: { 
                duration: 0.4,
                ease: "easeInOut"
              },
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
                aria-label={isOpen ? "Close menu" : "Open menu"}
                disabled={isNavigating}
              >
                <div
                  className={`absolute w-14 h-px bg-white transition-all duration-300 ease-in-out ${
                    isOpen 
                      ? 'rotate-45 translate-y-0' 
                      : 'group-hover:rotate-45 group-hover:translate-y-0 -translate-y-2'
                  }`}
                />
                <div
                  className={`absolute w-14 h-px bg-white transition-all duration-300 ease-in-out ${
                    isOpen 
                      ? '-rotate-45 translate-y-0' 
                      : 'group-hover:-rotate-45 group-hover:translate-y-0 translate-y-2'
                  }`}
                />
              </button>
            </div>

            {isOpen && (
              <>
                {/* Custom Cursor (only on desktop) */}
                {!isMobile && !isNavigating && (
                  <div
                    className={`absolute pointer-events-none z-50 transition-all ease-in-out duration-100 ${cursorSize}`}
                    style={{
                      top: mousePos.y - (isHoveringNav ? 24 : 6),
                      left: mousePos.x - (isHoveringNav ? 24 : 6),
                    }}
                  >
                    <div
                      className={`absolute transition-transform duration-300 left-1/2 top-0 bottom-0 w-px bg-white opacity-70 ${
                        isHoveringNav ? 'rotate-45' : 'rotate-0'
                      }`}
                    />
                    <div
                      className={`absolute transition-transform duration-300 top-1/2 left-0 right-0 h-px bg-white opacity-70 ${
                        isHoveringNav ? 'rotate-45' : 'rotate-0'
                      }`}
                    />
                  </div>
                )}

                <motion.div
                  className="flex relative flex-col items-center justify-center h-[calc(100%-80px)] p-4"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {/* Simplified decorative grid lines */}
                  <div className="absolute left-1/2 top-0 bottom-0 flex flex-col justify-between h-full -translate-x-1/2 w-1 opacity-60">
                    {Array(5).fill(0).map((_, idx) => (
                      <div
                        key={`line-center-${idx}`}
                        className="w-full h-1 bg-white/40"
                      />
                    ))}
                  </div>

                  {/* Navigation Links */}
                  <nav className="text-xl md:text-5xl gap-8 md:gap-[15rem] font-montserrat grid grid-cols-2 items-center font-bold z-10">
                    <button
                      onClick={() => handleNavigation("/")}
                      className="block text-gray-400 hover:text-gray-100 transition-colors duration-200 text-left"
                      onMouseEnter={() => !isMobile && setIsHoveringNav(true)}
                      onMouseLeave={() => !isMobile && setIsHoveringNav(false)}
                      disabled={isNavigating}
                    >
                      HOMEPAGE
                    </button>
                    <button
                      onClick={() => handleNavigation("/projects")}
                      className="block text-gray-400 hover:text-gray-100 transition-colors duration-200 text-left"
                      onMouseEnter={() => !isMobile && setIsHoveringNav(true)}
                      onMouseLeave={() => !isMobile && setIsHoveringNav(false)}
                      disabled={isNavigating}
                    >
                      PROJECTS
                    </button>
                    <button
                      onClick={() => handleNavigation("/about")}
                      className="block text-gray-400 hover:text-gray-100 transition-colors duration-200 text-left"
                      onMouseEnter={() => !isMobile && setIsHoveringNav(true)}
                      onMouseLeave={() => !isMobile && setIsHoveringNav(false)}
                      disabled={isNavigating}
                    >
                      ABOUT US
                    </button>
                    <button
                      onClick={() => handleNavigation("/contact")}
                      className="block text-gray-400 hover:text-gray-100 transition-colors duration-200 text-left"
                      onMouseEnter={() => !isMobile && setIsHoveringNav(true)}
                      onMouseLeave={() => !isMobile && setIsHoveringNav(false)}
                      disabled={isNavigating}
                    >
                      CONTACT
                    </button>
                  </nav>

                  {/* Footer contact info */}
                  <div className="flex px-4 md:px-10 flex-col md:flex-row w-full justify-start md:justify-between items-start space-y-3 md:space-y-0 md:items-center absolute bottom-6 font-quicksand text-xs font-light z-10">
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer section */}
      <div
        ref={footerRef}
        className="h-[22rem] relative bg-[#211d1d] z-[102] mt-6 px-6 text-white/80"
      >
        <div className="flex flex-col gap-6 lg:flex-row justify-between items-center text-sm font-mono font-medium">
          <div className="md:w-3/12">
            <div className="text-xs flex justify-center lg:justify-start items-center font-mono gap-4 mt-4">
              <button onClick={() => handleNavigation("/")}>HOMEPAGE</button>
              <button onClick={() => handleNavigation("/projects")}>PROJECT</button>
              <button onClick={() => handleNavigation("/about")}>ABOUT</button>
              <button onClick={() => handleNavigation("/contact")}>CONTACT</button>
            </div>
            <p className="font-mono text-center lg:text-start text-sm mt-4">
              We're a creative, collaborative, research based, social enterprise
              architecture firm continuously making an effort to impact the
              community.
            </p>
          </div>

          <div className="text-center">
            <p>224 W MONTGOMERY ST</p>
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
          <div className="absolute w-full bg-transparent bottom-2 right-0 z-[100] font-bold text-xs text-white">
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
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-[101] text-center">
                {Math.floor(screenSize.width / 2)}
              </div>
              <div className="absolute bottom-0 left-14 transform -translate-x-1/2 z-[101] text-center">
                <button onClick={() => handleNavigation("/privacy-policy")}>Privacy policy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}