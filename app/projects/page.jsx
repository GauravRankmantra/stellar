"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";

const projects = [
  {
    title: "The Hook Spiegeltent",
    image:
      "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "New York, USA",
    type: "Cultural Venue",
    progress: "completed",
  },
  {
    title: "Craft Beer Container Park",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Portland, USA",
    type: "Retail & Hospitality",
    progress: "ongoing",
  },
  {
    title: "Urban Development Tower",
    image:
      "https://images.unsplash.com/photo-1460574283810-2aab119d8511?q=80&w=2063&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai, UAE",
    type: "High-Rise Residential",
    progress: "completed",
  },
  {
    title: "Eco-Friendly Community Housing",
    image:
      "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Copenhagen, Denmark",
    type: "Sustainable Residential",
    progress: "ongoing",
  },
  {
    title: "Modern Art Museum Expansion",
    image:
      "https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "London, UK",
    type: "Cultural & Institutional",
    progress: "completed",
  },
  {
    title: "Riverside Walkway & Park",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Seoul, South Korea",
    type: "Public Space",
    progress: "ongoing",
  },
  {
    title: "Tech Campus Office Building",
    image:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&q=80&w=800",
    location: "Silicon Valley, USA",
    type: "Commercial Office",
    progress: "completed",
  },
  {
    title: "Historic District Renovation",
    image:
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Rome, Italy",
    type: "Heritage Preservation",
    progress: "ongoing",
  },
  {
    title: "Coastal Research Facility",
    image:
      "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Sydney, Australia",
    type: "Scientific & Educational",
    progress: "completed",
  },
  {
    title: "Luxury Boutique Hotel",
    image:
      "https://images.unsplash.com/photo-1548248823-ce16a73b6d49?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Paris, France",
    type: "Hospitality",
    progress: "ongoing",
  },
];

export default function VerticalProjectScroll() {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState(1);
  const clones = [...projects, ...projects, ...projects];
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  const [activeHoverIndex, setActiveHoverIndex] = useState(null);
  const isCursorLarge = activeHoverIndex !== null;
  const cursorSize = isCursorLarge ? "w-16 h-16" : "w-3 h-3";

  // console.log(isHovered)

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
    const container = containerRef.current;
    const slideCount = projects.length;
    const cloneHeight = container.scrollHeight / 3;
    let ticking = false;

    // Set up Lenis instance for smooth scrolling
    const lenis = new Lenis({
      wrapper: container,
      content: container.firstChild,
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
      <div
        className={`absolute ${cursorSize} z-[101] transition-all ease-in-out pointer-events-none`}
        style={{
          top: mousePos.y - (isCursorLarge ? 32 : 6),
          left: mousePos.x - (isCursorLarge ? 32 : 6),
        }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-300 ${
            isCursorLarge ? "rotate-45 scale-150" : "rotate-0 scale-100"
          }`}
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white opacity-80" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white opacity-80" />
        </div>
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

      <div
        ref={containerRef}
        className={`relative w-full mx-auto  z-[100] ${
          viewMode === 2 ? `w-2/12` : `w-7/12`
        } h-full overflow-y-scroll transition-all duration-700 ease-out space-y-4 pb-10 scrollbar-hide`}
      >
        <div className="space-y-4">
          {clones.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: viewMode === 2 ? 1 : 1 }}
              transition={{ duration: 0.4 }}
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
                    (viewMode == 2) ? `w-full text-[10px]`:`w-auto text-xs`
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
    </div>
  );
}

// "use client";
// import { useEffect, useRef, useState } from "react";
// import {
//   motion,
//   useAnimation,
//   useInView,
//   AnimatePresence,
// } from "framer-motion";
// import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
// import Link from "next/link";
// const getClosedMenuWidth = () => {
//   // Using Tailwind's default 'md' breakpoint (768px) as an example
//   if (typeof window !== "undefined" && window.innerWidth < 768) {
//     return "90vw";
//   } else {
//     return "40vw";
//   }
// };

// const slides = [
//   {
//     title: "The Stefanie H. Weill Center for the Performing Arts",
//     type: "ACTIVE BUILD",
//     impact: "SOCIAL-IMPACT",
//     location: "Atlanta, GA",
//     image: "/images/bg1.jpg",
//     link: "/projects/city-of-refuge",
//   },
//   {
//     title: "HARMONY RESORT HOTEL",
//     type: "HOSPITALITY",
//     impact: "LUXURY",
//     location: "Malta",
//     image:
//       "https://images.prismic.io/rad-project/aDjAtSdWJ-7kStF3_render2.jpg?auto=format%2Ccompress&w=1920&h=1280&q=100",
//     link: "/projects/harmony-resort",
//   },
//   {
//     title: "SEABREEZE YACHT CLUB",
//     type: "MARINE INFRASTRUCTURE",
//     impact: "HIGH-END",
//     location: "Valletta, Malta",
//     image: "/images/bg2.jpg",
//     link: "/projects/seabreeze-yacht",
//   },
// ];

// function Slide({ slide }) {
//   const ref = useRef(null);
//   const inView = useInView(ref, { amount: 0.6 });
//   const controls = useAnimation();

//   useEffect(() => {
//     if (inView) {
//       controls.start("visible");
//     } else {
//       controls.start("hidden");
//     }
//   }, [inView]);

//   return (
//     <div ref={ref} className="inline-block w-full h-full snap-start box-border">
//       <div className="h-screen  relative bg-white overflow-hidden">
//         <motion.img
//           src={slide.image}
//           alt={slide.title}
//           className="object-cover h-screen w-full absolute top-0 left-0 z-0"
//           initial={{ scale: 1.1 }}
//           animate={controls}
//           variants={{
//             visible: {
//               scale: 1,
//               transition: { duration: 1.4, ease: "easeOut" },
//             },
//             hidden: { scale: 1.1 },
//           }}
//         />
//         <div className="absolute inset-0 bg-black/30"></div>

//         <motion.h2
//           className="text-4xl lg:text-[5.5rem] font-bold absolute top-2 md:top-4 tracking-tighter md:leading-[4.5rem] left-2 md:left-4 uppercase text-white w-11/12  whitespace-pre-wrap  z-10"
//           initial="hidden"
//           animate={controls}
//           variants={{
//             hidden: { opacity: 0, y: 60 },
//             visible: {
//               opacity: 1,
//               y: 0,
//               transition: { duration: 1, ease: "easeOut" },
//             },
//           }}
//         >
//           {slide.title}
//         </motion.h2>
//         <motion.div
//           className="absolute inset-0  flex items-center justify-center z-10 rounded-lg"
//           animate={controls}
//           variants={{
//             hidden: { opacity: 0, y: 40 },
//             visible: {
//               opacity: 1,
//               y: 0,
//               transition: { duration: 1, ease: "easeOut", delay: 0.2 },
//             },
//           }}
//         >
//           <div className="font-quicksand flex justify-center items-center text-center flex-col md:flex-row text-white text-xs space-x-2 p-2 rounded-lg">
//             <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl">
//               {slide.title}
//             </p>
//             <div className="flex  ">
//               <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl ">
//                 {slide.type}
//               </p>
//               <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl">
//                 {slide.impact}
//               </p>
//             </div>

//             <p className=" bg-gray-700/20 backdrop-blur-md px-2 py-1 rounded-2xl">
//               {slide.location}
//             </p>
//           </div>
//         </motion.div>
//         <div className="absolute hidden md:block  left-2 bg-gray-700/20 backdrop-blur-md px-2 py-1 font-normal rounded-2xl  text-white font-quicksand  text-xs top-1/2 -translate-y-1/2">
//           <p>{"[Feature Project]"}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   const scrollRef = useRef(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [isHoveringNav, setIsHoveringNav] = useState(false);
//   const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());
//   const cursorSize = isHoveringNav ? "w-16 h-16" : "w-3 h-3";
//   const [isOpen, setIsOpen] = useState(false);
//   useEffect(() => {
//     const updateMouse = (e) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener("mousemove", updateMouse);

//     return () => {
//       window.removeEventListener("mousemove", updateMouse);
//     };
//   }, []);

//   useEffect(() => {
//     const container = scrollRef.current;
//     let timeoutId = null;

//     const handleWheel = (e) => {
//       if (!container) return;
//       container.scrollLeft += e.deltaY * 3;
//       if (timeoutId) clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         detectSnap();
//       }, 300);
//     };

//     const detectSnap = () => {
//       if (!container) return;
//       const scrollLeft = container.scrollLeft;
//       const children = Array.from(container.children);

//       let currentIndex = 0;
//       let minDiff = Infinity;

//       children.forEach((child, index) => {
//         const diff = Math.abs(scrollLeft - child.offsetLeft);
//         if (diff < minDiff) {
//           minDiff = diff;
//           currentIndex = index;
//         }
//       });

//       const currentChild = children[currentIndex];
//       const childLeft = currentChild.offsetLeft;
//       const childWidth = currentChild.offsetWidth;
//       const distanceIntoCard = scrollLeft - childLeft;
//       const percentScrolled = distanceIntoCard / childWidth;

//       if (percentScrolled > 0.5 && currentIndex + 1 < children.length) {
//         container.scrollTo({
//           left: children[currentIndex + 1].offsetLeft,
//           behavior: "smooth",
//         });
//       } else if (percentScrolled < -0.5 && currentIndex > 0) {
//         container.scrollTo({
//           left: children[currentIndex - 1].offsetLeft,
//           behavior: "smooth",
//         });
//       } else {
//         container.scrollTo({
//           left: currentChild.offsetLeft,
//           behavior: "smooth",
//         });
//       }
//     };

//     if (container) {
//       container.addEventListener("wheel", handleWheel, { passive: false });
//     }

//     return () => {
//       if (container) container.removeEventListener("wheel", handleWheel);
//       if (timeoutId) clearTimeout(timeoutId);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };
//   const containerVariants = {
//     closed: {
//       width: closedMenuWidth || "40vw",
//       height: "80px",
//       bottom: "5rem",
//       left: "50%",
//       x: "-50%",
//       opacity: 1,
//       scale: 1,
//       borderRadius: "0.75rem",
//       pointerEvents: "auto",
//     },
//     open: {
//       width: "100%",
//       height: "100%",
//       bottom: "0",
//       left: "0",
//       x: "0",
//       opacity: 1,
//       scale: 1,
//       borderRadius: "0",
//       pointerEvents: "auto",
//       transition: {
//         type: "spring",
//         stiffness: 400, // Adjust for bounciness
//         damping: 30, // Adjust for dampening
//         duration: 0.7, // Overall duration of the transition
//       },
//     },
//   };

//   const contentVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: 0.3, // Delay content animation slightly after menu opens
//         duration: 0.9,
//       },
//     },
//   };

//   return (
//     <div>
//       <div
//         ref={scrollRef}
//         className="relative w-full h-full overflow-x-auto whitespace-nowrap bg-gray-100 scroll-smooth scroll-snap-x snap-mandatory"
//       >
//         {slides.map((slide, i) => (
//           <Slide key={i} slide={slide} />
//         ))}

//         <AnimatePresence>
//           <motion.div
//             className={`fixed z-[9999] bg-gray-950/95 text-white flex flex-col`}
//             initial={isOpen ? "closed" : "closed"}
//             animate={isOpen ? "open" : "closed"}
//             variants={containerVariants}
//           >
//             <div className="flex justify-between items-center px-4 py-3">
//               <div className="">
//                 <h1 className="text-xs md:text-sm font-quicksand font-light tracking-wide">
//                   STELLER
//                 </h1>
//                 <h1 className="text-xs md:text-sm font-quicksand font-light tracking-wide">
//                   ARCHITECTURE+
//                 </h1>
//                 <h1 className="text-xs md:text-sm font-quicksand font-light tracking-wide">
//                   LAB
//                 </h1>
//               </div>

//               <button
//                 onClick={toggleMenu}
//                 className="group relative w-16 h-16 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out rounded-full hover:bg-white/10"
//               >
//                 <div
//                   className="absolute w-14 h-px bg-white transition-all duration-300 ease-in-out
//                 group-hover:rotate-45 group-hover:w-14 group-hover:translate-y-0 -translate-y-2"
//                 ></div>
//                 <div
//                   className="absolute w-14 h-px bg-white transition-all duration-300 ease-in-out
//                 group-hover:-rotate-45 group-hover:w-14 group-hover:translate-y-0 translate-y-2"
//                 ></div>
//               </button>
//             </div>

//             {isOpen && (
//               <>
//                 <div
//                   className={`absolute ${cursorSize} transition-all ease-in-out pointer-events-none z-50`}
//                   style={{
//                     top: mousePos.y - (isHoveringNav ? 24 : 6),
//                     left: mousePos.x - (isHoveringNav ? 24 : 6),
//                   }}
//                 >
//                   <div
//                     className={`absolute ${
//                       isHoveringNav ? `rotate-45` : `rotate-0`
//                     } transition-transform duration-300 left-1/2 top-0 bottom-0 w-px bg-white opacity-70`}
//                   />
//                   <div
//                     className={`absolute ${
//                       isHoveringNav ? `rotate-45` : `rotate-0`
//                     } transition-transform duration-300 top-1/2 left-0 right-0 h-px bg-white opacity-70`}
//                   />
//                 </div>
//                 <AnimatePresence>
//                   <motion.div
//                     className="flex relative  flex-col items-center justify-center h-[calc(100%-80px)] p-4"
//                     variants={contentVariants}
//                     initial="hidden"
//                     animate="visible"
//                     exit="hidden"
//                   >
//                     <div className="absolute left-1/2 top-auto flex flex-col justify-between  h-screen">
//                       <div className="w-1 bg-gray-100/60 h-1"></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                     </div>

//                     <div className="absolute left-1 top-auto flex flex-col justify-between  h-screen">
//                       <div className="w-1 bg-gray-100/60 h-1"></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                     </div>

//                     <div className="absolute right-1 top-auto flex flex-col justify-between h-screen">
//                       <div className="w-1 bg-gray-100/60 h-1"></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                       <div className="w-1 bg-white/60 h-1 "></div>
//                     </div>

//                     <nav className="text-xl md:text-5xl gap-[5rem] font-montserrat grid grid-cols-2 items-center md:gap-[15rem] font-bold">
//                       <a
//                         href="#"
//                         className="block text-gray-400 hover:text-gray-100 transition-colors duration-200"
//                         onMouseEnter={() => setIsHoveringNav(true)}
//                         onMouseLeave={() => setIsHoveringNav(false)}
//                       >
//                         HOMEPAGE
//                       </a>
//                       <Link
//                         href="/projects"
//                         className="block text-gray-400 hover:text-gray-100 transition-colors duration-200"
//                         onMouseEnter={() => setIsHoveringNav(true)}
//                         onMouseLeave={() => setIsHoveringNav(false)}
//                       >
//                         PROJECTS
//                       </Link>
//                       <a
//                         href="#"
//                         className="block text-gray-400 hover:text-gray-100 transition-colors duration-200"
//                         onMouseEnter={() => setIsHoveringNav(true)}
//                         onMouseLeave={() => setIsHoveringNav(false)}
//                       >
//                         ABOUT US
//                       </a>
//                       <a
//                         href="#"
//                         className="block text-gray-400 hover:text-gray-100 transition-colors duration-200"
//                         onMouseEnter={() => setIsHoveringNav(true)}
//                         onMouseLeave={() => setIsHoveringNav(false)}
//                       >
//                         CONTACT
//                       </a>
//                     </nav>
//                     <div className="flex px-10 md:flex-row flex-col w-full justify-start md:justify-between items-start space-y-3 md:space-y-0 md:items-center absolute bottom-6 font-quicksand text-xs font-light md:px-3">
//                       <p className="flex flex-col">
//                         224 W MONTGOMERY ST
//                         <span>VILLA RICA, GEORGIA 30180</span>{" "}
//                       </p>
//                       <p className="flex flex-col">
//                         steller@gmail.com
//                         <span>+91 xxxxxxxxx</span>{" "}
//                       </p>
//                       <div className="flex justify-center items-center space-x-3 text-lg">
//                         <a
//                           href="https://www.facebook.com/yourprofile"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="hover:text-blue-500 transition-colors duration-200"
//                           aria-label="Facebook"
//                         >
//                           <FaFacebook />
//                         </a>
//                         <a
//                           href="https://www.instagram.com/yourprofile"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="hover:text-pink-500 transition-colors duration-200"
//                           aria-label="Instagram"
//                         >
//                           <FaInstagram />
//                         </a>
//                         <a
//                           href="https://wa.me/yourphonenumber"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="hover:text-green-500 transition-colors duration-200"
//                           aria-label="WhatsApp"
//                         >
//                           <FaWhatsapp />
//                         </a>
//                       </div>
//                     </div>
//                   </motion.div>
//                 </AnimatePresence>
//               </>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }
