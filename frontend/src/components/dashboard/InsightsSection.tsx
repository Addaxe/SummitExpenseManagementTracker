import { useState } from "react";
import { NavLink } from "react-router-dom";

import TopographicCardDesign from "../../assets/dashboarddesigns/topographicdesign.png"
import CardChipIcon from "../../assets/dashboarddesigns/cardchipicon.png"
import CompanyLogoPlaceholder from "../../assets/companylogomissing.png"
import SummitWhiteLogo from "../../assets/summitwhite.png"
// import TopographicBackground from "../components/TopographyBackground"
import DonutChartSpendings from "./DonutChartSpendings"
import BarChartySpendings from "./BarChartSpendings"
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LoopIcon from '@mui/icons-material/Loop';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WbIncandescentOutlinedIcon from '@mui/icons-material/WbIncandescentOutlined';

const InsightsSection = () => {

  // Weekly / Monthly Comparison Button

  const [spendingOption, setSpendingOption] = useState("Weekly")

  const cardInfo = {
    "firstName": "Applecidervinegar",
    "lastName": "WithLemonJuiceOnTop",
    // "company": "Third Hour Studio",
    // "position": "Graphic Designer",
    // "department": "Marketing",
    "digits": "4242424242424242",
    "expirationDate": "2030-08-31",
    "currentBalance": 2700.00, //1483.86
    "lastMonthBalance": 2021.52,
    "limit": 3000.00,
    "cardResetDate": "2026-10-01",
    "role": "Employee",
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

  const [year, month, day] = cardInfo.cardResetDate.split("-").map(Number);

  const formattedResetDate = new Date(year, month - 1, day).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

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
    <div className="flex flex-col gap-5">
      <div key="top" className="animate-fadetop flex gap-5 items-start">
        <div key="left" className="relative bg-white border border-black/10 flex-none flex items-stretch overflow-hidden rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
        {/* before:absolute before:inset-0 before:content-[''] before:pointer-events-none before:bg-[repeating-radial-gradient(circle_at_50%_100%,transparent_0px,transparent_14px,rgba(0,0,0,0.05)_15px,rgba(0,0,0,0.05)_16px)]"> */}
          <div key="carddisplayandoptions" className="relative flex flex-col justify-between gap-7 items-center p-8
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
            <div key="cardoptions" className="flex gap-7 w-full">
              <button className="relative bg-[#ffbb00] bg-linear-to-br from-[#ffbb00] via-[#ffcc33] to-[#ffbb00] flex flex-1 font-medium gap-1.5 items-center justify-center cursor-pointer px-4 py-3 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#26382f] transition-all duration-500 ease-out
                hover:from-[#26382f] hover:via-[#2d4037] hover:to-[#26382f] hover:bg-[#26382f] hover:text-white">
                <AcUnitIcon fontSize="small"/>
                <span className="text-md">Freeze Card</span>
              </button>
              <button className="relative bg-[#ffbb00] bg-linear-to-br from-[#ffbb00] via-[#ffcc33] to-[#ffbb00] flex flex-1 font-medium gap-1.5 items-center justify-center cursor-pointer px-4 py-3 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#26382f] transition-all duration-500 ease-out
                hover:from-[#26382f] hover:via-[#2d4037] hover:to-[#26382f] hover:bg-[#26382f] hover:text-white">
                <LoopIcon fontSize="small"/>
                <span className="md">Replace Card</span>
              </button>
            </div>
          </div>
          <div className="relative border-l border-l-black/10 bg-white flex flex-col self-stretch items-stretch justify-center px-8 text-[#26382f]">
            <div className="flex flex-col gap-3 h-full justify-center py-8">
              <span className="font-medium text-lg">Available to Spend</span>
              <span className="font-bold text-4xl">${(cardInfo.limit-cardInfo.currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="text-sm">of ${cardInfo.limit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})} monthly limit</span>
              <div className="bg-gray-200 h-2.5 overflow-hidden rounded-full w-full">
                <div
                  className="bg-[#26382f] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((cardInfo.currentBalance / cardInfo.limit) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 items-center justify-center">
                  <CalendarMonthIcon fontSize="small"/>
                  <span className="text-sm">Resets {formattedResetDate}</span>
                </div>
                <span className="text-sm">{Math.min((cardInfo.currentBalance / cardInfo.limit) * 100, 100)}% used</span>
              </div>
            </div>
            <div className="bg-black/10 h-px w-full"/>
            <div className="flex justify-between h-full">
              <div className="flex flex-col items-center justify-center px-5">
                <span className="text-sm">Current Balance</span>
                <span className="font-bold text-lg">${(cardInfo.currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex flex-col items-center justify-center px-5">
                <span className="text-sm">Monthly Limit</span>
                <span className="font-bold text-lg">${(cardInfo.limit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div key="right" className="relative bg-white border border-black/10 flex-1 min-w-0 flex flex-col justify-between overflow-hidden p-8 rounded-lg self-stretch shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#26382f]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold mb-2 text-lg">Recent Transactions</h1>
            <div className="flex items-center justify-center">
              <NavLink className="
                font-semibold inline-flex mr-1 no-underline px-0 py-1 relative text-sm text-[#148455] z-1 transition duration-200
                before:absolute before:bottom-0 before:border-b-2 before:border-[#148455] before:content-[''] before:right-0 before:top-0 before:transition-[width] before:duration-200 before:ease-out before:w-0 before:-z-1
                hover:before:left-0 hover:before:right-auto hover:before:w-full
              " to="/dashboard#transactions">View All</NavLink>
              <ArrowForwardIosIcon sx={{ fontSize: 12}} />
            </div>
          </div>
          <div 
            className="bg-white flex flex-col rounded-sm"
          >
            {cardInfo.transactions.slice(0,4).map((transaction) => {
              return (
                <span key={transaction.id} className="border-b border-black/10 last:border-b-0 flex justify-between py-2.5">
                  <div className="relative flex items-center gap-4">
                    <div className="bg-gray-100 flex h-10 items-center justify-center overflow-hidden rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] shrink-0 w-10">
                      <img
                        src={CompanyLogoPlaceholder}
                        alt="Company Logo Placeholder"
                        className="h-full object-contain p-2 w-full "
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="font-medium text-sm">{transaction.merchant}</h1>
                      <span className="flex flex-wrap gap-1.5 text-xs">
                        <span>{formatTransactionDate(transaction.date)}</span>
                          &#8226;
                        <span>{transaction.category}</span>
                      </span>
                    </div>
                  </div>
                  <span className="flex flex-col gap-1 items-end">
                    <span className={`font-bold text-md ${transaction.amount > 0 ? "text-green-800" : transaction.status === "Declined" ? "line-through text-gray-400" : "text-red-700"}`}>
                    {transaction.amount < 0 ? "-" : "+"}$
                    {Math.abs(transaction.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    }</span>
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${transaction.status === "Completed" ? "bg-[#e2f1ea] text-[#2f6047]" : transaction.status === "Declined" ? "bg-[#f8e6e8] text-[#b74247]": "bg-[#feedba] text-[#7d7352]"}`}>{transaction.status}</span>
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div key="bottom" className="animate-fadebottom flex flex-wrap gap-5">
        <div key="left" className="relative bg-white border border-black/10 flex-none flex overflow-hidden p-8 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] w-[822.78px]">
          <div className="flex flex-col">
            <h1 className="font-bold mb-4 text-[#26382F] text-lg">Spending Overview</h1>
            <div className="bg-[#FAFAFA] border-[0.5px] border-black/10 flex flex-col flex-1 gap-6 pt-6 px-6 rounded-md w-55">
              <div key="top-row" className="flex flex-col flex-1 gap-2">
                <div className="text-sm">
                  <span className="font-medium text-[#26382F]">This Week &#8226; </span>
                  <span className="text-gray-600">Sep 21 - 27</span>
                </div>
                <span className="font-bold text-[#26382F] text-2xl">$000.00</span>
                <div className="text-sm">
                  <span className="font-semibold text-green-700">12.4% </span>
                  <span className="text-gray-600">vs. last week</span>
                </div>
              </div>
              <div className="bg-black/10 h-px w-full"/>
              <div key="bottom-row" className="flex flex-col flex-1 gap-2 justify-center">
                <div className="text-sm">
                  <span className="font-medium text-[#26382F]">Last Week &#8226; </span>
                  <span className="text-gray-600">Sep 14 - 20</span>
                </div>
                <span className="font-bold text-[#26382F] text-2xl">$000.00</span>
              </div>
              <div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center"><DonutChartSpendings spent={2700} total={3000}/></div>
          <div className="flex flex-col flex-1 justify-between w-65">
            <div className="flex gap-2 px-3">
              <button onClick={() => setSpendingOption("Weekly")}
              className={`border border-[#26382F] cursor-pointer flex flex-1 justify-center px-4 py-1 rounded-sm text-sm
              ${spendingOption === "Weekly" ? "bg-[#26382F] font-medium text-white" : "bg-white font-normal text-[#26382F]"}`}>Weekly</button>
              <button onClick={() => setSpendingOption("Monthly")}
              className={`border border-[#26382F] cursor-pointer flex flex-1 justify-center px-4 py-1 rounded-sm text-sm
              ${spendingOption === "Monthly" ? "bg-[#26382F] font-medium text-white" : "bg-white font-normal text-[#26382F]"}`}>Monthly</button>
            </div>
            <div className="flex flex-col gap-2 p-3 text-[#26382F]">
              <div className="flex jusify-center gap-2 items-center">
                <CurrencyExchangeIcon sx={{ fontSize: 20}}/>
                <span className="text-[#26382F] text-sm">Spending Change</span>
              </div>
              <span className="font-bold text-2xl">+$678.48</span>
              <span className="text-sm">33.5% more than last month</span>
            </div>
            <div className="bg-[#e2f1ea] flex gap-3 items-center px-3 py-4 rounded-md text-[#26382F]">
              <WbIncandescentOutlinedIcon sx={{ fontSize: 24, transform: 'rotate(180deg)'}}/>
              <span className="text-sm">Software is your largest spending category this month.</span>
            </div>
          </div>
        </div>
        <BarChartySpendings/>
        {/* <div key="right" className="bg-white border border-black/10 flex flex-1 overflow-hidden p-8 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] w-[822.78px]">
            <h1 className="font-semibold text-lg mb-4">Spend by Category</h1>
            <div>
              <BarChartySpendings/>
            </div>
        </div> */}
      </div> 
    </div>        
  );
};

export default InsightsSection;