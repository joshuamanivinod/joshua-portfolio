import React from "react";
import Image from "next/image";
import { skills } from "../Constant/skills";

// One scrolling row of skill chips. The list is rendered three times so the
// CSS loop (translate by one third of the track) always covers the viewport.
// Copies 2 and 3 are hidden from assistive tech.
const SkillMarquee = ({ items, reverse = false }) => (
  <div className="marquee">
    <div className={`marquee-track${reverse ? " marquee-track--reverse" : ""}`}>
      {[0, 1, 2].map((copy) => (
        <ul key={copy} className="marquee-set" aria-hidden={copy > 0}>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#32312E] bg-[#21201D] px-4 py-2 transition-colors duration-300 hover:border-[#FF8303]"
            >
              <Image src={item.img} alt="" width={20} height={20} unoptimized />
              <span className="whitespace-nowrap font-Lato text-sm lg:text-base text-[#F0E3CA]">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);

const MySkills = () => {
  const half = Math.ceil(skills.length / 2);

  return (
    <section id="skills">
      <div className="bg-[#1F1E1B] flex flex-col justify-center items-center font-Inconsolata gap-10 py-24">
        <h1 className="text-[#FF8303] text-3xl font-semibold">My Skills</h1>
        <div className="flex w-full flex-col gap-5">
          <SkillMarquee items={skills.slice(0, half)} />
          <SkillMarquee items={skills.slice(half)} reverse />
        </div>
      </div>
    </section>
  );
};

export default MySkills;
