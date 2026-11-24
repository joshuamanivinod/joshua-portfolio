'use client'

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { certifications } from "../Constant/certifications";

const TimelineItem = ({ title, subtitle, description, date }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-start md:items-center mb-12 transition-transform duration-1000 ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-56 md:-translate-x-96 opacity-0"
      }`}
    >
      <div className="absolute -left-4 w-2 h-2 rounded-full bg-[#FF8303]"></div>
      <div className="flex items-center w-full">
        <div className="flex-1 bg-[#FF8303] h-0.5"></div>
        <div className="flex-1"></div>
      </div>
      <div className="mt-6 w-full md:max-w-4xl">
        <h3 className="text-white text-2xl font-semibold">{title}</h3>
        <span className="italic text-white">{subtitle}</span>
        <p className="mt-2 text-white">{description}</p>
        <span className="text-[#FF8303] font-semibold">{date}</span>
      </div>
    </div>
  );
};

const MyEducation = () => {
  return (
    <section id="education">
      <div className="bg-[#1F1E1B] flex flex-col justify-center items-center font-Inconsolata gap-9 py-44 px-5">
        <h1 className="text-[#FF8303] text-3xl font-semibold">My Education</h1>
        <div className="w-full md:w-2/3">
          <TimelineItem
            title="National Institute of Technology, Calicut"
            subtitle="BTech in Electronics and Communication Engineering"
            description="CGPA: 8.38"
            date="2021 - 2025"
          />
          <TimelineItem
            title="Navy Children School, Kochi"
            subtitle="Physics, Chemistry, Math, and Economics"
            description="97.4% (A1 credit for all subjects)"
            date="2019 - 2021"
          />
        </div>
        <div id="certifications" className="w-full md:w-2/3">
          <h2 className="text-[#FF8303] text-3xl font-semibold mb-6">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certifications.map((cert) => (
              <a
                key={cert.title}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${cert.title} credential`}
                className="group flex items-start gap-4 rounded-lg border border-[#32312E] bg-[#21201D] p-5 transition-colors duration-300 hover:border-[#FF8303]"
              >
                <Image src={cert.logo} alt="" width={36} height={36} unoptimized className="h-9 w-9 shrink-0" />
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-white text-base font-semibold leading-snug">{cert.title}</h3>
                  <p className="mt-1 text-sm italic text-[#F0E3CA]">{cert.issuer}</p>
                  <span className="mt-3 text-sm text-[#FF8303] group-hover:underline">View credential</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { MyEducation };
