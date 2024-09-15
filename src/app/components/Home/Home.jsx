"use client";

import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
const Home = () => {
  return (
    <>
      <section id="about">
        <div className="bg-[#1F1E1B] font-Inconsolata flex  flex-col-reverse lg:flex-col justify-center items-center py-40 gap-14">
          <div className="flex flex-col lg:flex-row justify-center items-center  gap-32">
            <div className="flex flex-col lg:items-start justify-center items-center gap-2 p-5">
              <h1 className="text-[#FF8303] text-6xl font-bold">
                Joshua Mani Vinod
              </h1>
              {/* <label className="text-[#F0E3CA] text-3xl">
                MERN Developer
              </label> */}
              <TypeAnimation
                className="text-[#F0E3CA] text-3xl"
                sequence={[
                  "NIT Calicut",
                  1000,
                  "Web Developer",
                  1000,
                  "AI/ML Enthusiast",
                  1000,
                  // "UI/UX Designer",
                  // 1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
              {/* <span className="text-[#F0E3CA] text-lg text-center lg:text-start">
                MERN developer looking for ideas and projects for himself and
                others
              </span> */}
            </div>
            <div className="relative w-96 h-96 bg-cover">
              <Image src="/homepic2.png" fill alt={"Np Image Found"} />

              <div className="w-40 h-40 absolute left-24 top-32">
                <Image src="/pp.png" fill alt={"No Image Found"} />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center text-lg items-center gap-3 text-[#F0E3CA] flex-wrap p-4">
            <div className="relative w-48 h-48">
              <Image src="/home1.png" alt="home icon not found" fill />
            </div>
            <div className="lg:w-1/2 text-center lg:text-start">
              <p>
                👋 Hi there! I'm Joshua Mani Vinod, a final year student at NIT Calicut majoring in Electronics and Communication Engineering. <br/>
                {/* 🤖 I'm deeply passionate about AI/ML and am keen in leveraging my knowledge about machine learning algorithms into creating impactful projects.<br/>
                🧑‍💻 I'm a skilled web developer having a good knowledge in MERN stack and other upcoming technologies.<br/>
                🔢 I have good knowledge on Data Structures and Algorithms in C++ and have solved a good number of problems on leetcode and other platforms.<br/>
                🏀 I've always loved playing sports and have had the opportunity to play professional basketball for my college team.<br/>
                🤝I'm excited to build new connections and explore new opportunities on the way.<br/> */}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
