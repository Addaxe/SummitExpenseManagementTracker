import { useEffect, useRef, useState, type FormEvent } from "react";
import TopographicBackground from "../components/TopographyBackground"
import MountainImage from "../assets/Mountains.avif"
import SummitCard from "../assets/summitcard.png"

import homeclip1 from "../assets/clips/homeclip1.mp4";
import homeclip2 from "../assets/clips/homeclip2.mp4";
import homeclip3 from "../assets/clips/homeclip3.mp4";

import companylogo1 from "../assets/fakecompanylogos/atlasoperationsgroup.webp";
import companylogo2 from "../assets/fakecompanylogos/brightlinecreative.webp";
import companylogo3 from "../assets/fakecompanylogos/cortexlabs.webp";
import companylogo4 from "../assets/fakecompanylogos/harborfinancial.webp";
import companylogo5 from "../assets/fakecompanylogos/launchgrid.webp";
import companylogo6 from "../assets/fakecompanylogos/meridianpayments.webp";
import companylogo7 from "../assets/fakecompanylogos/northpeakoutfitters.webp";
import companylogo8 from "../assets/fakecompanylogos/pulsestack.webp";
import companylogo9 from "../assets/fakecompanylogos/ridgesupplyco.webp";
import companylogo10 from "../assets/fakecompanylogos/vectorflowai.webp";

import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import GroupsIcon from "@mui/icons-material/Groups";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Home = () => {
  const companies = [companylogo1, companylogo2, companylogo3, companylogo4, companylogo5, companylogo6, companylogo7, companylogo8, companylogo9, companylogo10]

  const videos = [homeclip1, homeclip2, homeclip3];

  const [currentIndex, setCurrentIndex] = useState(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const switchVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];

    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.playbackRate = 1.2;

      currentVideo.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    }
  }, [currentIndex]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

    return (
    <>
      <TopographicBackground
        color1="rgba(116, 150, 127, 0.25)"
        color2="#f9f9f9"
      />
      <div className="bottom-0 fixed inset-x-0 overflow-auto top-18.25 w-screen">
        <section className="flex flex-col gap-10 h-fit items-center justify-center min-h-full pb-10 pt-20 w-full sm:pb-20 sm:pt-30">
            <div className="flex flex-col gap-10 h-full items-center justify-between px-10 w-full sm:px-20 lg:gap-20 lg:flex-row">
              <div className="animate-fadetop flex flex-col gap-7 items-center w-full lg:animate-fadeleft lg:items-start">
                <h1 className="font-bold text-2xl text-center sm:text-3xl lg:text-left lg:text-4xl xl:text-5xl ">Climb Higher with Financial Clarity.</h1>
                <h2 className="text-md text-center sm:text-lg lg:text-xl lg:text-left">Corporate cards, expense tracking, reimbursements, approvals, and reporting—all powered by Summit.</h2>

                <form 
                  className="bg-white border border-[#bbbbbb] flex rounded-md p-1 text-[#26382f] w-fit"
                  onSubmit={handleSubmit}>
                  <div className="w-fit">
                    <label htmlFor="user-email" className="input-label"></label>

                    <input
                      className="border-none outline-none px-2 py-3.75 text-xs w-50 sm:text-sm sm:px-5 sm:w-80 lg:w-60 xl:w-80"
                      type="email"
                      id="user-email"
                      placeholder="What is your business email?"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button 
                  type="submit" 
                  className="bg-[#ffbb00] bg-linear-to-br from-[#ffbb00] via-[#ffcc33] to-[#ffbb00] cursor-pointer font-medium m-0.75 px-5.5 py-2.5 relative rounded-md text-[#26382f] text-xs transition-all duration-300 ease-out sm:text-sm
                  hover:from-[#26382f] hover:via-[#2d4037] hover:to-[#26382f] hover:bg-[#26382f] hover:text-white">
                    Join Us
                  </button>
                </form>
              </div>

              <div className="w-full">
                <div className="bg-[#bbbbbb] [clip-path:polygon(0_0,calc(100%-25px)_0,100%_25px,100%_100%,25px_100%,0_calc(100%-25px))] h-full overflow-hidden p-[0.8px] relative rounded-sm">
                  <div className="bg-white [clip-path:polygon(0_0,calc(100%-25px)_0,100%_25px,100%_100%,25px_100%,0_calc(100%-25px))] h-full overflow-hidden p-2.5 relative rounded-sm">
                    <div className="absolute bg-white inset-0 origin-bottom z-99 animate-wipedown" />
                    <div className="[clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))] h-87.5 overflow-hidden relative rounded-sm w-full">
                      {videos.map((video, index) => (
                        <video
                          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                          index === currentIndex ? "opacity-100 z-1" : "opacity-0 z-0"}`}
                          key={index}
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          src={video}
                          muted
                          playsInline
                          onEnded={switchVideo}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-[rgba(231,231,231,0.6)] p-5 overflow-hidden w-full h-fit text-center font-semibold text-xl text-[#585858] ">
              <h1 className="mb-5">Trusted by 5,000+ top companies</h1>
              <div className="flex w-max gap-[1em] animate-[slide_60s_linear_infinite] h-full">
                {[...companies, ...companies, ...companies].map((company, index) => (
                  <div key={`${company}-${index}`} className="bg-white border border-[#ececec] drop-shadow-md h-32.5 p-1 rounded-md flex items-center justify-center">
                    <img src={company} alt={`company-${index}`} className="h-full w-full grayscale object-contain rounded"/>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-7.5 px-10 lg:flex-row w-full sm:px-20">
              <div className="flex flex-col gap-7.5 items-stretch md:flex-row">
                <div className="animate-fadebottom [animation-delay:0.3s] bg-[#26382f] border border-[#bbbbbb] flex flex-col flex-1 items-center justify-center opacity-0 p-7.5 relative rounded-md text-center text-white transition-[border-color,box-shadow] duration-300 ease-in-out
                  before:absolute before:bg-[repeating-radial-gradient(circle_at_120%_120%,transparent_0px,transparent_14px,rgba(34,197,94,0.08)_15px,rgba(34,197,94,0.08)_16px)] before:content-[''] before:inset-0 before:pointer-events-none
                  hover:border-[rgba(34,197,94,0.3)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_30px_rgba(34,197,94,0.08)]">
                  <AccessTimeFilledIcon fontSize="large" className="mb-4 text-[white]"/>
                  <h1 className="font-bold mb-4 text-lg">Real-time Expense Tracking</h1>
                  <p className="leading-relaxed text-[rgba(255,255,255,0.7)] text-sm">Automated sync with corporate cards & receipts</p>
                </div>

                <div className="animate-fadebottom [animation-delay:0.5s] bg-[#26382f] border border-[#bbbbbb] flex flex-col flex-1 items-center justify-center opacity-0 p-7.5 relative rounded-md text-center text-white transition-[border-color,box-shadow] duration-300 ease-in-out
                  before:absolute before:bg-[repeating-radial-gradient(circle_at_120%_120%,transparent_0px,transparent_14px,rgba(34,197,94,0.08)_15px,rgba(34,197,94,0.08)_16px)] before:content-[''] before:inset-0 before:pointer-events-none
                  hover:border-[rgba(34,197,94,0.3)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_30px_rgba(34,197,94,0.08)]">
                  <AnalyticsIcon fontSize="large" className="mb-4 text-white"/>
                  <h1 className="font-bold mb-4 text-lg">Budget Dashboards</h1>
                  <p className="leading-relaxed text-[rgba(255,255,255,0.7)] text-sm">Live visibility across departments and projects</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-7.5 items-stretch md:flex-row">
                <div className="animate-fadebottom [animation-delay:0.7s] bg-[#26382f] border border-[#bbbbbb] flex flex-col flex-1 items-center justify-center opacity-0 p-7.5 relative rounded-md text-center text-white transition-[border-color,box-shadow] duration-300 ease-in-out
                  before:absolute before:bg-[repeating-radial-gradient(circle_at_120%_120%,transparent_0px,transparent_14px,rgba(34,197,94,0.08)_15px,rgba(34,197,94,0.08)_16px)] before:content-[''] before:inset-0 before:pointer-events-none
                  hover:border-[rgba(34,197,94,0.3)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_30px_rgba(34,197,94,0.08)]">
                  <GroupsIcon fontSize="large" className="mb-4 text-white"/>
                  <h1 className="font-bold mb-4 text-lg">Team Approvals</h1>
                  <p className="leading-relaxed text-[rgba(255,255,255,0.7)] text-sm">Custom policy-based approval workflows</p>
                </div>

                <div className="animate-fadebottom [animation-delay:0.9s] bg-[#26382f] border border-[#bbbbbb] flex flex-col flex-1 items-center justify-center opacity-0 p-7.5 relative rounded-md text-center text-white transition-[border-color,box-shadow] duration-300 ease-in-out
                  before:absolute before:bg-[repeating-radial-gradient(circle_at_120%_120%,transparent_0px,transparent_14px,rgba(34,197,94,0.08)_15px,rgba(34,197,94,0.08)_16px)] before:content-[''] before:inset-0 before:pointer-events-none
                  hover:border-[rgba(34,197,94,0.3)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_30px_rgba(34,197,94,0.08)]">
                  <FileDownloadIcon fontSize="large" className="mb-4 text-white"/>
                  <h1 className="font-bold mb-4 text-lg">Export-ready Reports</h1>
                  <p className="leading-relaxed text-[rgba(255,255,255,0.7)] text-sm">Auditable reports in PDF, CSV, and ERP formats</p>
                </div>
              </div>
            </div>
        </section>

        <section className="flex flex-col gap-14 items-center justify-center pb-16 px-10 relative w-full sm:px-20">
          <div className="bg-[#f5f5f5] border border-[#d3d3d3] h-fit relative overflow-hidden rounded-md w-full">
            <div className="relative z-10 flex flex-col-reverse items-center justify-center gap-12 p-10 sm:p-20 sm:gap-24 lg:flex-row ">
              <div className="bg-red flex-1 flex h-full justify-center w-full">
                <img src={SummitCard} alt="Summit Card" className="w-full max-w-2xl xl:max-w-3xl h-auto rounded-2xl shadow-lg"/>
              </div>
              <div className="flex flex-col flex-1 gap-8 items-center justify-center xl:items-start xl:text-left max-w-2xl">
                <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#26382f]">Our Story</h1>
                <p className="text-md sm:text-lg lg:text-xl leading-relaxed text-[#1f2f27]">
                  Summit was built because managing business expenses shouldn't require spreadsheets,
                  manual approvals, and endless receipt chasing. We created a platform that gives
                  finance teams complete visibility while empowering employees to spend responsibly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
  </>
);
};

export default Home;