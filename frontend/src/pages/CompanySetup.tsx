import { useState, type FormEvent } from "react";
import TopographicBackground from "../components/TopographyBackground";
import WarningIcon from '@mui/icons-material/Warning';

const CompanySetup = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [errorData, setErrorData] = useState<{
    field?: string;
    error?: string;
  }>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/company-setup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: companyName,
            website: companyWebsite,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      console.log("Company created successfully!");
    } catch (error) {
      console.error("Company setup error:", error);
    }
  };

  return (
    <>
      <TopographicBackground color1="rgba(34, 197, 94, 0.08)" color2="#26382f" />
      <div className="bottom-0 fixed inset-x-0 overflow-auto px-5 py-10 top-18.25 w-screen sm:p-10">
        <div className="flex items-center justify-center min-h-full w-full">
          <form className="bg-white grid p-9 relative rounded-md *:text-[#26382f] sm:p-12.5" onSubmit={handleSubmit}>
            <h1 className="font-bold text-xl mb-1.25 sm:text-2xl">Set up your company</h1>
            <p className="mb-6 text-sm sm:text-base">to manage expenses, cards, and budgets in one place</p>
            {errorData.field && (
              <div className="bg-[#fedada] mb-6 px-5 py-2 rounded-md text-red-800! text-sm sm:text-base">{errorData.error}</div>
            )}

            {/* Company Name */}
            <div className="relative mb-6">
              <label className={`absolute bg-white left-4 px-1 text-xs -top-2 sm:text-sm" htmlFor="companyName
              ${errorData.field === "companyName" ? "text-red-800" : "text-gray-600"}`}>
                Company Name
              </label>
              <input
                className={`border outline-none px-4 py-2 rounded-md text-sm w-full sm:px-5 sm:py-2.75 sm:text-base
                  ${errorData.field === "companyName" ? "border-red-500" : "border-gray-600"}`}
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => {setCompanyName(e.target.value);
                  if (errorData.field === "companyName") {setErrorData({});}
                }}
                required
              />
              {errorData.field === "companyName" && (
                <WarningIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />
              )}
            </div>

            {/* Company Website */}
            <div className="relative mb-6">
              <label className={`absolute bg-white left-4 px-1 text-xs -top-2 sm:text-sm" htmlFor="companyWebsite
              ${errorData.field === "companyWebsite" ? "text-red-800" : "text-gray-600"}`}>
                Company Website
              </label>
              <input
                className={`border outline-none px-4 py-2 rounded-md text-sm w-full sm:px-5 sm:py-2.75 sm:text-base
                  ${errorData.field === "companyWebsite" ? "border-red-500" : "border-gray-600"}`}
                id="companyWebsite"
                type="url"
                placeholder="https://www.summit.com"
                value={companyWebsite}
                onChange={(e) => {setCompanyWebsite(e.target.value);
                  if (errorData.field === "companyWebsite") {setErrorData({});}
                }}
                required
              />
              {errorData.field === "companyName" && (
                <WarningIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />
              )}
            </div>
            <button type="submit" className="bg-[#ffbb00] cursor-pointer font-semibold p-2.5 relative rounded-md text-[#26382f] text-xs transition-[background-color] duration-300 ease-out sm:text-sm sm:p-3.5 
            hover:bg-black hover:text-white">
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompanySetup;