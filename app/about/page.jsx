"use client";
import React, { useEffect, useState } from "react";
import TextPressure from "../../components/TextPressure";
import SplitText from "../../components/SplitText";
import { TextAnimate } from "@/components/magicui/text-animate";
import CircularText from "../../components/CircularText";
import Navbar from "@/components/NavBar";
import { cn } from "@/lib/utils";
import TeamSection from "../../components/TeamSection";

const page = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  const cursorOffset = isHoveringNav ? 40 : 6;

  const teamData = [
    {
      name: "Aditi Rao",
      position: "Principal Architect",
      description:
        "Aditi Rao leads Stellar Design Lab with a passion for socially engaged architecture. She brings over fifteen years of experience in sustainable design, working on community-driven schools, low-income housing, and urban infill projects that strengthen neighborhoods without displacing residents. Aditi believes that well-crafted space should be a tool for social equity. Her work has been recognized by local preservation societies and international sustainability awards. At SDL she oversees all major projects, mentors junior designers, and directs in-house research on new bio-based building materials. She sits on the board of the National Trust for Historic Preservation and regularly lectures on the role of architecture in community resilience. Beyond the studio, Aditi volunteers with Habitat for Humanity and enjoys teaching free weekend drawing classes to underserved youth. In her free time you’ll find her exploring vernacular architecture across the American South or curled up with a good book on phenomenology of space.",
      image: "/images/team2.jpg",
    },
    {
      name: "Karan Singh",
      position: "Design Lead",
      description:
        "As SDL’s Design Lead, Karan Singh merges rigorous conceptual thinking with playful material experiments. With a background in parametric design and digital fabrication, he has spearheaded award-winning installations, pop-ups, and corporate interiors that blend craft and computation. Karan is especially known for his inventive use of cross-laminated timber and recycled metal components to create warm, tactile environments. He leads SDL’s in-house “lab days,” where the team tests novel assemblies in 1:1 mockups. His projects have appeared in Architect Magazine’s “Top 50 Designs” and have been exhibited at the Cooper Hewitt Smithsonian Design Museum. Outside work, Karan pursues landscape painting and mentors emerging architects through AIA’s mentorship program. He’s a voracious reader of design theory and moonlights as a DJ under the moniker DJ Parametric.",
      image: "/images/team1.jpg",
    },
  ];

  useEffect(() => {
    const handleHover = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "a" || tag === "button" || tag === "span") {
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
  return (
    <>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:30px_30px]",
          "[background-image:linear-gradient(to_right,#c7c2bb_0px,transparent_0.7px),linear-gradient(to_bottom,#c7c2bb_0px,transparent_0px)]",
           "z-0"
        )}
      />
      <div className="fixed h-full left-0 top-0 z-[100] bg-[#b4aea7] text-xs text-white">
        <div
          className="mt-8 text-black  font-bold flex gap-4 md:px-1 py-1 -rotate-180"
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

      <div
        className="fixed left-0 top-1/2 z-[100] -translate-y-1/2 text-center font-bold text-xs text-black -rotate-180"
        style={{ writingMode: "vertical-lr" }}
      >
        {Math.floor(screenSize.height / 2)}
      </div>

      <div className="fixed w-full h-4 md:h-6 bg-[#b4aea7] top-0 z-[100] text-black">
        <div
          className="fixed top-0 z-[101] font-bold text-xs text-black"
          style={{ left: `${mousePos.x - 12}px` }}
        >
          {mousePos.x - screenSize.height}
        </div>

        <div className="fixed lg:hidden top-0 -translate-x-1/2 left-1/2 z-[101] font-bold text-xs text-black">
          [Feture Projects]
        </div>
      </div>

      <div className="fixed h-full w-4 lg:w-6 bg-[#b4aea7] top-0 right-0 z-[100] text-black">
        <div
          className="fixed font-bold text-xs right-0 text-black"
          style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
        >
          {screenSize.height - mousePos.y * 2}
        </div>
      </div>

      <div className="fixed bg-[#b4aea7] w-full bottom-0 right-0 z-[100] font-bold text-xs text-white">
        <div className="text-black flex justify-end gap-4 px-6 py-0 md:py-1">
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

      <div
        className="pointer-events-none fixed z-[101] top-0 bottom-0 w-px bg-[#999692]/50"
        style={{ left: `${mousePos.x}px` }}
      />
      <div
        className="pointer-events-none fixed z-[101] left-0 right-0 h-px bg-[#999692]/50"
        style={{ top: `${mousePos.y}px` }}
      />

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
      <Navbar />
      {/* main content  */}
      <div>
        {/* top section */}
        <div className="p-6 h-screen relative">
          <div className=" text-5xl font-gilroy font-bold tracking-[-2px] uppercase">
            <TextAnimate animation="fadeIn" by="line" as="p">
              {`Stellar Design Lab is a research-based \n\ndesign studio headquartered in India, \n\ndriven by the conviction that well-crafted space can \n\ncatalyze positive social and ecological change.`}
            </TextAnimate>
          </div>

          <div className="absolute text-xs flex w-full justify-between left-0 p-6 -translate-y-1/2 top-1/2 ">
            <p>[ About</p>
            <p> Steller ]</p>
          </div>

          <div className="absolute bottom-6 text-xs left-6">
            <ul className=" flex gap-6 list-disc">
              <li>TEAM</li>
              <li>APPROACH</li>
              <li>CAREERS</li>
              <li>AWARDS</li>
            </ul>
          </div>
          <div className="absolute top-1/2 left-6 -translate-x-1/2 -translate-y-1/2 text-xs ">
            <CircularText
              text="SCROLL*DOWN*SCROLL*DOWN*"
              onHover="speedUp"
              spinDuration={20}
              className="custom-class"
            />
          </div>
        </div>
        {/* team section */}
        <div className=" h-screen p-6 z-[9999]">
          <TeamSection team={teamData} />
        </div>
      </div>
    </>
  );
};

export default page;
