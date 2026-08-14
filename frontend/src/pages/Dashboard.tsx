import { useState } from "react";
import TopographicCardDesign from "../assets/dashboarddesigns/topographicdesign.png"
import CardChipIcon from "../assets/dashboarddesigns/cardchipicon.png"
import ProfilePlaceholder from "../assets/dashboarddesigns/profileplaceholder.avif"
import SummitWhiteLogo from "../assets/summitwhite.png"
import TopographicBackground from "../components/TopographyBackground"

import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

const Dashboard = () => {
  const cardInfo = {
    "firstName": "Applecidervinegar",
    "lastName": "WithLemonJuiceOnTop",
    "position": "Employee",
    "digits": "4242424242424242",
    "expirationMonth": "8",
    "expirationYear": "30",
    "balance": "1,483.86",
    "limit": "3000.00",
  }

  const maskedDigits =
  "*".repeat(cardInfo.digits.length - 4) +
  cardInfo.digits.slice(-4);

  const [sideBarHidden, hideSideBar] = useState(false) 
  const [sideBarButtonHovered, setIsSideBarButtonHovered] = useState(false)

  const sidebarOptions = [
  {name: "Insights", icon: AutoGraphIcon,},
  {name: "Transactions", icon: CurrencyExchangeIcon,},
  {name: "Card Services", icon: CreditCardOutlinedIcon,},
];

  const previousMonthDate = new Date();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonth = previousMonthDate.toLocaleString("en-US", {
    month: "short",
  });
  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }) // Abbreviated
  const currentYear = new Date().getFullYear()

  return (
    <>
      <TopographicBackground  color1="rgba(116, 150, 127, 0.25)" color2="#f0f0f0"/>
      <div className="bottom-0 fixed h-[calc(100vh-18.25)] overflow-auto top-18.25 w-screen">
        <div className="flex flex-1 min-h-0 flex-row h-full p-7">
          <div className={`animate-fadeleft bg-white border border-black/10 flex flex-col h-full items-center justify-between mr-8 py-4 rounded-lg shadow-md text-[#26382f] z-50 ${sideBarHidden ? "min-w-20 px-3.5 w-20" : "min-w-56.25 px-6 w-56.25"} transition-[min-width, width] duration-500 ease-in-out`}>
            <div className={`flex h-fit items-center justify-between py-2 w-full ${sideBarHidden ? "flex-col-reverse px-0" : "flex-row px-4"}`}>
              <h1 className="text-sm">Menu</h1>
              <button onClick={() => hideSideBar(!sideBarHidden)} className={`cursor-pointer flex items-center justify-center rounded-lg ${sideBarHidden ? "bg-[#ffbb00] mb-5 p-2 rounded-md": ""}`}>
                <ViewSidebarOutlinedIcon fontSize={`${sideBarHidden ? "medium" : "small"}`}/>
              </button>
            </div>
            <div className="flex flex-col flex-1 gap-3 w-full">
              {sidebarOptions.map((option) => {
              const Icon = option.icon;

              return (
                <button key={option.name}
                  onMouseEnter={() => setIsSideBarButtonHovered(true)} 
                  onMouseLeave={() => setIsSideBarButtonHovered(false)}
                  className={`bg-white border border-black/0 cursor-pointer flex group items-center p-3 relative rounded-lg text-center transition-all duration-300 ease-out w-full hover:bg-gray-200 hover:border-black/10 
                    ${sideBarHidden ? "justify-center" : ""}`}
                >
                  <Icon fontSize="medium"/>
                  {!sideBarHidden && (
                    <span className="font-medium ml-2 overflow-hidden text-nowrap">{option.name}</span>
                    
                  )}

                  {sideBarHidden && sideBarButtonHovered && (
                    <span className="absolute bg-[#26382f] border border-gray-500 font-medium group-hover:opacity-100 left-full ml-4 px-3 py-2 text-white text-xs opacity-0 pointer-events-none rounded shadow-md transition-opacity duration-200 whitespace-nowrap z-50">
                      {option.name}
                    </span>
                  )}
                </button>
              );
            })}
            </div>
            <div key="user-profile" className="absolute bg-[#26382f] bottom-0 cursor-pointer flex flex-row font-semibold items-center justify-center overflow-hidden p-4 text-center text-white transition-[background-color] duration-300 ease-out w-full
            hover:bg-white hover:text-[#26382f]">
              <img src={ProfilePlaceholder} alt="Profile Picture Placeholder" className={`rounded-full w-10 ${sideBarHidden ? "mr-0" : "mr-3"}`}/>
              {!sideBarHidden && (
                <div className="flex flex-col items-start justify-center">
                  <span className="text-nowrap text-sm">{`${cardInfo.firstName.slice(0, 15)} ${cardInfo.lastName.charAt(0)}.`}</span>
                  <span className="font-normal text-xs">{`${cardInfo.position}`}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-1 text-right px-6">
            <div key="top" className="animate-fadetop flex flex-row gap-7 h-79.5">
              <div className="bg-white border border-black/10 flex justify-center gap-10 h-full items-center p-10 rounded-lg w-fit">
                <div key="card" className="bg-[#0E0E0E] h-61.25 relative rounded-2xl shadow-md w-100">
                  <img src={TopographicCardDesign} alt="Topographic Card Design" className="absolute inset-0 h-full w-full object-cover"/>
                  <div className="flex flex-col h-full justify-between px-7 py-4 relative z-10">
                    <div className="flex items-center justify-end">
                      <img src={SummitWhiteLogo} alt="White Summit Logo" className="h-auto w-30"/>
                    </div>
                    <div className="flex flex-row flex-1 items-center justify-between text-white">
                      <img src={CardChipIcon} alt="Card Chip Logo" className="h-auto w-12"/>
                      <p className="text-xl tracking-wider">{maskedDigits.replace(/(.{4})/g, "$1 ")}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between text-white">
                      <div className="flex flex-col flex-1 items-start justify-center">
                        <h1 className="text-sm">Card Holder</h1>
                        <p className="font-semibold text-lg">{`${cardInfo.firstName.slice(0, 10)} ${cardInfo.lastName.slice(0, 11)}`}</p>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <h1 className="text-sm">Valid Thru</h1>
                        <p className="font-semibold text-lg">{cardInfo.expirationMonth.padStart(2, "0")}/{cardInfo.expirationYear}</p>
                      </div>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-full justify-between text-[#26382f]">
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-center text-sm">Welcome back!</h1>
                    <p className="font-bold text-nowrap text-lg">{`${cardInfo.firstName.slice(0, 10)} ${cardInfo.lastName.slice(0, 11)}`}</p>
                  </div>
                  <div className="bg-[#f1f8ed] border border-black/40 flex flex-col gap-2 px-10 py-5 rounded-lg">
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-center text-sm">Current Balance</h1>
                      <p className="font-bold text-lg">${cardInfo.balance}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-center text-sm">Monthly Limit</h1>
                      <p className="font-bold text-lg">${cardInfo.limit}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-black/10 flex flex-1 p-10 rounded-lg">
                <div key="statistics" className="flex flex-col flex-1 items-center justify-between">
                  <div className="flex flex-col flex-1 gap-1 items-start justify-center w-full">
                    <h1 className="text-sm">Spent this month - {currentMonth} {currentYear}</h1>
                    <p className="font-bold text-lg">$---</p>
                  </div>
                  <div className="flex flex-col flex-1 gap-1 items-start justify-center w-full">
                    <h1 className="text-sm">Spent last month - {previousMonth} {currentYear}</h1>
                    <p className="font-bold text-lg">$---</p>
                  </div>
                  <div className="flex flex-col flex-1 gap-1 items-start justify-center w-full">
                    <h1 className="text-sm">Amount saved</h1>
                    <p className="font-bold text-lg">$---</p>
                  </div>
                </div>
                <div key="chart">

                </div>
              </div>
            </div>
            <div key="bottom" className="">

            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Dashboard;