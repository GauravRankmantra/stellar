"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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

  useEffect(() => {
    const container = containerRef.current;
    const slideCount = projects.length;
    const cloneHeight = container.scrollHeight / 3;
    let ticking = false;

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
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      <div className="absolute   justify-between  w-[15%] top-1/2 -translate-y-1/2 right-16 z-20 flex gap-2 items-center text-sm font-mono">
        <p>/ {String(projects.length).padStart(3, "0")}</p>
        <div className="space-x-1">
          <button
            onClick={() => setViewMode(1)}
             className={`px-2 py-1  rounded-full space-x-1 transition-all duration-700 ${
                viewMode === 1 ?`font-bold`:`font-normal`}`}
          >
            <span>VIEW</span>
            <span
              className={` p-1 text-xs px-2 rounded-full transition-all duration-700 ${
                viewMode === 1 ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              1
            </span>
          </button>
          <button
            onClick={() => setViewMode(2)}
            className={`px-2 py-1  rounded-full space-x-1 transition-all duration-700 ${
                viewMode === 2 ?`font-bold`:`font-normal`}`}
          >
            <span>VIEW</span>
            <span
              className={` p-1 text-xs px-2 rounded-full transition-all duration-700 ${
                viewMode === 2 ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              2
            </span>
          </button>
        </div>
      </div>

      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-xs font-mono">
        {String(currentSlide).padStart(3, "0")}
      </div>

      <div
        ref={containerRef}
        className={`absolute left-1/2 top-0 -translate-x-1/2 ${
          viewMode === 2 ? `w-3/12` : `w-6/12`
        } h-full overflow-y-scroll transition-all duration-700 ease-out space-y-4 pb-10 scrollbar-hide`}
      >
        {clones.map((proj, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1 }}
            animate={{ scale: viewMode === 2 ? 1 : 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full z-[99999] overflow-hidden rounded-lg shadow-lg cursor-pointer"
          >
            <Image
              src={proj.image}
              alt={proj.title}
              width={500}
              height={300}
              className={`w-full object-cover ${viewMode==2?` h-[150px]`:` h-[500px]`}`}
            />
            <div className="absolute top-2 left-2 bg-black/40 rounded-xl text-white text-xs px-3 py-1 ">
              {proj.title}
            </div>
          </motion.div>
        ))}
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
