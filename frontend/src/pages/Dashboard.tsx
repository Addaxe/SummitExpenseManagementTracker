import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InsightsSection from "../components/dashboard/InsightsSection";

import ProfilePlaceholder from "../assets/dashboarddesigns/profileplaceholder.avif"
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Dashboard = () => {
  const navigate = useNavigate();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeSection, setActiveSection] = useState("Insights");

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

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          console.error("Dashboard authentication failed");
          return;
        }

        setIsCheckingAuth(false);

      } catch (error) {
        console.error("Dashboard authentication error:", error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  // Sidebar Constants
  const [sideBarHidden, hideSideBar] = useState(false) 
  const [sideBarButtonHovered, setIsSideBarButtonHovered] = useState(false)

  const sidebarOptions = [
  {name: "Insights", icon: AutoGraphIcon,},
  {name: "Transactions", icon: CurrencyExchangeIcon,},
  {name: "Card Services", icon: CreditCardOutlinedIcon,},
  ];

  if (isCheckingAuth) {
    return null;
  }
  
  return (
    <>
      {/* <TopographicBackground  color1="rgba(116, 150, 127, 0.25)" color2="#f0f0f0"/> */}
      <div className="bg-[#F7F8F7] bottom-0 fixed top-18.25 w-screen">
        <div className="flex flex-row h-full min-h-0 p-7">
          <div className={`animate-fadeleft bg-white border border-black/10 flex flex-col h-full items-center justify-between mr-8 overflow-visible py-4 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#26382f] z-50 ${sideBarHidden ? "min-w-20 px-3.5 w-20" : "min-w-56.25 px-4 w-56.25"} transition-[min-width, width] duration-500 ease-in-out`}>
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
                  onClick={() => setActiveSection(option.name)}
                  className={`bg-white border border-black/0 cursor-pointer flex group items-center p-3 relative rounded-lg text-center text-white transition-all duration-300 ease-out w-full hover:bg-[#26382f] hover:text-white
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
                <div className="flex gap-3">
                   <div className="flex flex-col items-start justify-center">
                    <span className="text-nowrap text-sm">{`${cardInfo.firstName.slice(0, 12)} ${cardInfo.lastName.charAt(0)}.`}</span>
                    <span className="font-normal text-xs">{`${cardInfo.role}`}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowForwardIosIcon sx={{ fontSize: 16}} />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
            <InsightsSection/>     
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Dashboard;