import React from "react";

const TimelineItem = ({ title, subtitle, description, date }) => (
  <div className="relative flex flex-col items-start md:items-center mb-12">
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

const MyEducation = () => {
  return (
    <section id="education">
      <div className="bg-[#1F1E1B] flex flex-col justify-center items-center font-Inconsolata gap-9 py-44">
        <h1 className="text-[#FF8303] text-3xl font-semibold">My Education</h1>
        <div className="w-full md:w-2/3">
          <TimelineItem
            title="National Institute of Technology, Calicut"
            subtitle="BTech in Electronics and Communication Engineering"
            description="CGPA: 8.40"
            date="2019 - 2023"
          />
          <TimelineItem
            title="Navy Children School, Kochi"
            subtitle="Physics, Chemistry, Math, and Economics"
            description="97.4% (A1 credit for all subjects)"
            date="2017 - 2019"
          />
        </div>
      </div>
    </section>
  );
};

export { MyEducation };
