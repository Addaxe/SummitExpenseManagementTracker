import { useState } from "react";
import TopographicCardDesign from "../assets/dashboarddesigns/topographicdesign.png"
import CardChipIcon from "../assets/dashboarddesigns/cardchipicon.png"
import ProfilePlaceholder from "../assets/dashboarddesigns/profileplaceholder.avif"
import SummitWhiteLogo from "../assets/summitwhite.png"
import TopographicBackground from "../components/TopographyBackground"
import DonutChartMonthlySavings from "../components/DonutChartMonthlySavings"

import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LoopIcon from '@mui/icons-material/Loop';
import { CurrencyBitcoin } from "@mui/icons-material";


const Dashboard = () => {
  // Sidebar Constants
  const [sideBarHidden, hideSideBar] = useState(false) 
  const [sideBarButtonHovered, setIsSideBarButtonHovered] = useState(false)

  const sidebarOptions = [
  {name: "Insights", icon: AutoGraphIcon,},
  {name: "Transactions", icon: CurrencyExchangeIcon,},
  {name: "Card Services", icon: CreditCardOutlinedIcon,},
  ];

  // Recent Transactions Scroll

  const [scrolledBottomTransactions, setScrolledBottomTransactions] = useState(false)
  const handleTransactionsScroll = (e: any) => {
    const element = e.currentTarget;

    setScrolledBottomTransactions(
      element.scrollTop + element.clientHeight >= element.scrollHeight - 1
    );
  };

  // Weekly / Monthly Comparison Button

  const [comparisonOption, setComparisonOption] = useState("Weekly")
  const handleComparisonOption = () => {
    
    if (comparisonOption === "Weekly") {
      setComparisonOption("Monthly")
    } else {
      setComparisonOption("Weekly")
    }
  }

  const cardInfo = {
    "firstName": "Applecidervinegar",
    "lastName": "WithLemonJuiceOnTop",
    // "company": "Third Hour Studio",
    "role": "Employee",
    // "position": "Graphic Designer",
    // "department": "Marketing",
    "digits": "4242424242424242",
    "expirationDate": "2030-08-31",
    "currentBalance": 2700.00, //1483.86
    "limit": 3000.00,
    "lastMonthBalance": 2021.52,
    "transactions": [
      {
      "id": 1,
      "merchant": "Adobe",
      "category": "Software",
      "amount": 54.99,
      "date": "2026-09-21T10:32:00",
      "status": "Pending",
      "transactionType": "card",
      "description": "Adobe Creative Cloud"
    },
    {
      "id": 2,
      "merchant": "Figma",
      "category": "Software",
      "amount": -15.00,
      "date": "2026-09-20T14:18:00",
      "status": "Pending",
      "transactionType": "card",
      "description": "Figma Professional"
    },
    {
      "id": 3,
      "merchant": "Amazon",
      "category": "Office Supplies",
      "amount": -86.47,
      "date": "2026-09-19T11:45:00",
      "status": "Completed",
      "transactionType": "card",
      "description": "Office equipment and supplies"
    },
    {
      "id": 4,
      "merchant": "Uber",
      "category": "Travel",
      "amount": -32.84,
      "date": "2026-09-18T08:21:00",
      "status": "Declined",
      "transactionType": "card",
      "description": "Uber Business Trip"
    },
    {
      "id": 5,
      "merchant": "Notion",
      "category": "Software",
      "amount": -12.00,
      "date": "2026-09-17T16:04:00",
      "status": "Completed",
      "transactionType": "card",
      "description": "Notion Plus"
    },
    {
      "id": 6,
      "merchant": "Whole Foods Market",
      "category": "Meals",
      "amount": -74.26,
      "date": "2026-09-16T13:27:00",
      "status": "Declined",
      "transactionType": "card",
      "description": "Team lunch"
    },
    {
      "id": 7,
      "merchant": "Lyft",
      "category": "Travel",
      "amount": -24.63,
      "date": "2026-09-15T19:42:00",
      "status": "Completed",
      "transactionType": "card",
      "description": "Business transportation"
    },
    {
      "id": 8,
      "merchant": "Slack",
      "category": "Software",
      "amount": -38.00,
      "date": "2026-09-14T09:12:00",
      "status": "Declined",
      "transactionType": "card",
      "description": "Slack Pro subscription"
    },
    {
      "id": 9,
      "merchant": "Staples",
      "category": "Office Supplies",
      "amount": -128.35,
      "date": "2026-09-13T15:36:00",
      "status": "Completed",
      "transactionType": "card",
      "description": "Printer supplies"
    },
    {
      "id": 10,
      "merchant": "Google Cloud",
      "category": "Software",
      "amount": -92.18,
      "date": "2026-09-12T12:51:00",
      "status": "Completed",
      "transactionType": "card",
      "description": "Cloud hosting services"
    },
    ],
  }

  const formattedExpiration = new Date(cardInfo.expirationDate)
  .toLocaleDateString("en-US", {
    month: "2-digit",
    year: "2-digit",
  });

  const maskedDigits =
  "•".repeat(cardInfo.digits.length - 4) +
  cardInfo.digits.slice(-4);

  const previousMonthDate = new Date();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonth = previousMonthDate.toLocaleString("en-US", {
    month: "short",
  });
  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }) // Change to short for abbreviation
  const currentYear = new Date().getFullYear()

  const formatTransactionDate = (dateString: string) => {
    const transactionDate = new Date(dateString);
    const today = new Date();

    // Remove the time portion
    const transactionDay = new Date(
      transactionDate.getFullYear(),
      transactionDate.getMonth(),
      transactionDate.getDate()
    );

    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const yesterdayDay = new Date(todayDay);
    yesterdayDay.setDate(yesterdayDay.getDate() - 1);

    if (transactionDay.getTime() === todayDay.getTime()) {
      return "Today";
    }

    if (transactionDay.getTime() === yesterdayDay.getTime()) {
      return "Yesterday";
    }

    return transactionDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* <TopographicBackground  color1="rgba(116, 150, 127, 0.25)" color2="#f0f0f0"/> */}
      <div className="bg-[#F7F8F7] bottom-0 fixed top-18.25 w-screen">
        <div className="flex flex-row h-full min-h-0 p-7">
          <div className={`animate-fadeleft bg-white border border-black/10 flex flex-col h-full items-center justify-between mr-8 overflow-visible py-4 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#26382f] z-50 ${sideBarHidden ? "min-w-20 px-3.5 w-20" : "min-w-56.25 px-6 w-56.25"} transition-[min-width, width] duration-500 ease-in-out`}>
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
            <div key="user-profile" className="absolute bg-[#26382f] bottom-0 cursor-pointer flex flex-row font-semibold items-center justify-center overflow-hidden p-4 rounded-b-lg text-center text-white transition-[background-color] duration-300 ease-out w-full
            hover:bg-gray-100 hover:text-[#26382f]">
              <img src={ProfilePlaceholder} alt="Profile Picture Placeholder" className={`rounded-full w-10 ${sideBarHidden ? "mr-0" : "mr-3"}`}/>
              {!sideBarHidden && (
                <div className="flex flex-col items-start justify-center">
                  <span className="text-nowrap text-sm">{`${cardInfo.firstName.slice(0, 15)} ${cardInfo.lastName.charAt(0)}.`}</span>
                  <span className="font-normal text-xs">{`${cardInfo.role}`}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto px-6">
            <div className="flex flex-col gap-10">
              <div key="top" className="animate-fadetop flex gap-10 items-start">
                <div key="left" className="relative bg-white border border-black/10 flex-none flex overflow-hidden rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
                {/* before:absolute before:inset-0 before:content-[''] before:pointer-events-none before:bg-[repeating-radial-gradient(circle_at_50%_100%,transparent_0px,transparent_14px,rgba(0,0,0,0.05)_15px,rgba(0,0,0,0.05)_16px)]"> */}
                  <div key="carddisplayandoptions" className="relative flex flex-col justify-between gap-8 items-center p-10
                  before:absolute before:inset-0 before:content-[''] before:pointer-events-none before:bg-[repeating-radial-gradient(circle_at_50%_50%,transparent_0px,transparent_14px,rgba(0,0,0,0.05)_15px,rgba(0,0,0,0.05)_16px)]">                    
                    <div key="card" className="bg-black bg-linear-to-br from-[#050505] via-[#151515] to-[#303030] h-61.25 relative rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] w-100">
                      <img src={TopographicCardDesign} alt="Topographic Card Design" className="absolute inset-0 w-full object-cover"/>
                      <div className="flex flex-col h-full justify-between px-7 py-4 relative z-10">
                        <div className="flex items-center justify-end">
                          <img src={SummitWhiteLogo} alt="White Summit Logo" className="h-auto w-30"/>
                        </div>
                        <div className="flex flex-row flex-1 items-center justify-between text-white">
                          <img src={CardChipIcon} alt="Card Chip Logo" className="h-auto w-12"/>
                          <p className="font-semibold text-[22px] tracking-widest">{maskedDigits.replace(/(.{4})/g, "$1 ")}</p>
                        </div>
                        <div className="flex flex-row items-center justify-between text-white">
                          <div className="flex flex-col flex-1 items-start justify-center">
                            <h1 className="text-sm">Card Holder</h1>
                            <p className="font-semibold text-lg">{`${cardInfo.firstName.slice(0, 10)} ${cardInfo.lastName.slice(0, 11)}`}</p>
                          </div>
                          <div className="flex flex-col items-end justify-center">
                            <h1 className="text-sm">Valid Thru</h1>
                            <p className="font-semibold text-lg">{formattedExpiration}</p>
                          </div>
                          <div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div key="cardoptions" className="flex gap-8 w-full">
                      <button className="relative bg-[#ffbb00] bg-linear-to-br from-[#ffbb00] via-[#ffcc33] to-[#ffbb00] flex flex-1 font-medium gap-1.5 items-center justify-center cursor-pointer p-4 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#26382f] transition-all duration-500 ease-out
                       hover:from-[#26382f] hover:via-[#2d4037] hover:to-[#26382f] hover:bg-[#26382f] hover:text-white">
                        <AcUnitIcon fontSize="small"/>
                        <span className="text-md">Freeze Card</span>
                      </button>
                      <button className="relative bg-[#ffbb00] bg-linear-to-br from-[#ffbb00] via-[#ffcc33] to-[#ffbb00] flex flex-1 font-medium gap-1.5 items-center justify-center cursor-pointer p-4 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#26382f] transition-all duration-500 ease-out
                       hover:from-[#26382f] hover:via-[#2d4037] hover:to-[#26382f] hover:bg-[#26382f] hover:text-white">
                        <LoopIcon fontSize="small"/>
                        <span className="md">Replace Card</span>
                      </button>
                    </div>
                  </div>
                  <div className="relative bg-white flex h-full items-stretch justify-center p-5 text-[#26382f]">
                    <div className="relative bg-white border border-black/20 flex flex-col items-center justify-center rounded-lg">
                      <div className="flex flex-col flex-1 gap-2 items-center justify-center p-8">
                        <h1 className="text-center text-sm">Current Balance</h1>
                        <p className="font-bold text-xl">${cardInfo.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      </div>
                      <span className="bg-black/10 h-px w-full"/> 
                      <div className="flex flex-col flex-1 gap-2 items-center justify-center p-8">
                        <h1 className="text-center text-sm">Monthly Limit</h1>
                        <p className="font-bold text-xl">${cardInfo.limit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      </div>
                      <span className="bg-black/10 h-px w-full"/>
                      <div className="flex flex-col flex-1 gap-2 items-center justify-center p-8">
                        <h1 className="text-center text-sm">Amount Available</h1>
                        <p className="font-bold text-xl">${(cardInfo.limit-cardInfo.currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div key="right" className="relative bg-white border border-black/10 flex-1 min-w-0 flex flex-col h-103.75 justify-center overflow-hidden p-10 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#26382f]">
                  <h1 className="font-semibold mb-2 text-lg">Recent Transactions</h1>
                  <span className="flex mb-1 text-xs text-gray-500 z-10">Showing 10 Results</span>
                  <div 
                    onScroll={handleTransactionsScroll}
                    className="bg-white border border-black/20 flex flex-col h-71 overflow-y-auto rounded-sm"
                  >
                    {cardInfo.transactions.slice(0,10).map((transaction) => {
                      return (
                        <span key={transaction.id} className="border-b border-black/20 last:border-b-0 flex justify-between px-5 py-3">
                          <span className="flex flex-col gap-1">
                            <h1 className="font-medium text-md">{transaction.merchant}</h1>
                            <span className="flex flex-wrap gap-1.5 text-xs">
                              <span>{formatTransactionDate(transaction.date)}</span>
                              <span>&#8226;</span>
                              <span>{transaction.category}</span>
                            </span>
                          </span>
                          <span className="flex flex-col items-end">
                            <span className={`font-bold text-md ${transaction.amount > 0 ? "text-green-800" : transaction.status === "Declined" ? "line-through text-gray-400" : "text-red-700"}`}>
                            {transaction.amount < 0 ? "-" : "+"}$
                            {Math.abs(transaction.amount).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                            }</span>
                            <span className={`border border-black/20 px-2 py-0.5 rounded-sm text-xs ${transaction.status === "Completed" ? "bg-green-200" : transaction.status === "Declined" ? "bg-red-200": "bg-amber-200"}`}>{transaction.status}</span>
                          </span>
                        </span>
                      );
                    })}
                    {!scrolledBottomTransactions && (
                      <div className="absolute bg-linear-to-t from-white via-white to-transparent -bottom-px left-0 right-0 h-30 pointer-events-none z-10"/>
                    )}
                  </div>
                </div>
              </div>
              <div key="bottom" className="animate-fadebottom flex flex-wrap gap-7 min-h-79.5">
                <div key="left" className="relative bg-white border border-black/10 flex-none flex overflow-hidden rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
                  <div key="savings" className="bg-white flex flex-1 pl-10 py-10 rounded-lg text-[#26382f]">
                    <div key="statistics" className="border border-black/20 flex flex-col rounded-md">
                      <div className="flex flex-col flex-1 gap-1 items-start justify-center px-8 py-4 w-full">
                        <h1 className="text-sm">Spent this month - {currentMonth} {currentYear}</h1>
                        <p className="font-bold text-lg">${cardInfo.currentBalance}</p>
                      </div>
                      <span className="bg-black/20 h-px w-full"/>
                      <div className="flex flex-col flex-1 gap-1 items-start justify-center px-8 py-4 w-full">
                        <h1 className="text-sm">Spent last month - {previousMonth} {currentYear}</h1>
                        <p className="font-bold text-lg">${cardInfo.lastMonthBalance}</p>
                      </div>
                      <span className="bg-black/20 h-px w-full"/>
                      <div className="flex flex-col flex-1 gap-1 items-start justify-center px-8 py-4 w-full">
                        <h1 className="text-sm">Amount saved</h1>
                        <p className="font-bold text-lg">{
                            (cardInfo.lastMonthBalance-cardInfo.currentBalance) < 0 ? "-" : ""}
                            ${Math.abs(cardInfo.lastMonthBalance-cardInfo.currentBalance).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                            }</p>
                      </div>
                    </div>
                    <div key="chart" className="flex flex-col items-center justify-center">
                      <div key="options" className="border border-black/20 flex rounded-sm">
                        <button onClick={handleComparisonOption} className={`cursor-pointer px-5 py-2 text-md  ${comparisonOption === "Weekly" ? "bg-[#26382f] text-white" : "bg-white text-[#26382f]"}`}>Weekly</button>
                        <div className="bg-black/20 h-full w-px"/>
                        <button onClick={handleComparisonOption} className={`cursor-pointer px-5 py-2 text-md  ${comparisonOption === "Monthly" ? "bg-[#26382f] text-white" : "bg-white text-[#26382f]"}`}>Monthly</button>
                      </div>
                      <DonutChartMonthlySavings saved={+(cardInfo.lastMonthBalance - cardInfo.currentBalance).toFixed(2)} total={cardInfo.currentBalance + cardInfo.lastMonthBalance} currentDate={currentMonth + " " + currentYear}/>
                    </div>
                  </div>
                </div>
              </div> 
            </div>        
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Dashboard;