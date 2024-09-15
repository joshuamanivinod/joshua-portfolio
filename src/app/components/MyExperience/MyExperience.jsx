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

const MyExperience = () => {
  return (
    <section id="experience">
      <div className="bg-[#1F1E1B] flex flex-col justify-center items-center font-Inconsolata gap-9 py-44 px-5">
        <h1 className="text-[#FF8303] text-3xl font-semibold">My Experience</h1>
        <div className="w-full md:w-2/3">
          <TimelineItem
            title="Centre of Excellence in Artificial Intelligence"
            subtitle="Web Development Intern"
            description="Worked on R&D Project 'SAMUDRA' for a Smart Decision Support System focused on disaster management."
            date="Present"
          />
          <TimelineItem
            title="Stanley Black & Decker, Inc."
            subtitle="Summer Intern"
            description="Developed a machine learning model for tool classification and a Python-based GUI interface that reduced analysis time."
            date="May 2024 - July 2024"
          />
          <TimelineItem
            title="AutoMicroUAS Aerotech"
            subtitle="Artificial Intelligence Intern"
            description="Enhanced UAV functionalities and developed AI-driven UAV control systems using Dronekit and Python."
            date="June 2023 - July 2023"
          />
        </div>
      </div>
    </section>
  );
};

export { MyExperience };
