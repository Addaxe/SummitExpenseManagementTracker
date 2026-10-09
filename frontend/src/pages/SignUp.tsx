import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopographicBackground from "../components/TopographyBackground";
import WarningIcon from '@mui/icons-material/Warning';

const SignUp = () => {
  const navigate = useNavigate()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [errorData, setErrorData] = useState<{
    field?: string;
    error?: string;
  }>({});

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsCheckingAuth(false);
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
          // Token exists but is expired/invalid
          localStorage.removeItem("accessToken");
        }

        if (response.ok) {
          const data = await response.json();

          navigate(
            data.companySetupComplete
              ? "/dashboard"
              : "/company-setup",
            { replace: true }
          );

          return;
        }

        setIsCheckingAuth(false);

      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmedPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorData(data)
        return;
      }

      console.log("Account created successfully!");
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/company-setup")
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <TopographicBackground color1="rgba(34, 197, 94, 0.08)" color2="#26382f" />
      <div className="bottom-0 fixed inset-x-0 overflow-auto px-5 py-10 top-18.25 w-screen sm:p-10">
        <div className="flex items-center justify-center min-h-full w-full">
          <form className="bg-white grid p-9 relative rounded-md *:text-[#26382f] sm:p-12.5" onSubmit={handleSubmit}>
            <h1 className="font-bold text-xl mb-1.25 sm:text-2xl">Create your Summit account</h1>
            <p className="mb-6 text-sm sm:text-base">
              to start tracking expenses and managing budgets
            </p>
            {errorData.field && (
              <div className="bg-[#fedada] mb-6 px-5 py-2 rounded-md text-red-800! text-sm sm:text-base">{errorData.error}</div>
            )}
            <div className="flex flex-col gap-6 mb-6 sm:flex-row sm:gap-4">
              {/* First Name */}
              <div className="flex-1 relative">
                <label className={`absolute bg-white left-4 px-1 text-xs -top-2 sm:text-sm" htmlFor="firstName
                ${errorData.field === "firstName" ? "text-red-800" : "text-gray-600"}`}>
                  First Name
                </label>
                <input
                  className={`border outline-none px-4 py-2 rounded-md text-sm w-full sm:px-5 sm:py-2.75 sm:text-base
                    ${errorData.field === "firstName" ? "border-red-500" : "border-gray-600"}`}
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => {setFirstName(e.target.value);
                    if (errorData.field === "firstName") {setErrorData({});}
                  }}
                  required
                />
                {errorData.field === "firstName" && (
                  <WarningIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />
                )}
              </div>

              {/* Last Name */}
              <div className="flex-1 relative ">
                <label className={`absolute bg-white left-4 px-1 text-xs -top-2 sm:text-sm" htmlFor="lastName"
                ${errorData.field === "lastName" ? "text-red-800" : "text-gray-600"}`}>
                  Last Name
                </label>
                <input
                  className={`border border-gray-600 outline-none px-4 py-2 rounded-md text-sm w-full sm:px-5 sm:py-2.75 sm:text-base
                    ${errorData.field === "lastName" ? "border-red-500" : "border-gray-600"}`}
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => {setLastName(e.target.value);
                    if (errorData.field === "lastName") {setErrorData({});}
                  }}
                  required
                />
                {errorData.field === "lastName" && (
                  <WarningIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />
                )}
              </div>
            </div>

            {/* Email */}
            <div className="relative mb-6">
              <label className={`absolute bg-white left-4 px-1 text-xs -top-2 sm:text-sm" htmlFor="email"
              ${errorData.field === "email" ? "text-red-800" : "text-gray-600"}`}>
                Work Email
              </label>
              <input
                className={`border border-gray-600 outline-none px-4 py-2 rounded-md text-sm w-full sm:px-5 sm:py-2.75 sm:text-base
                  ${errorData.field === "email" ? "border-red-500" : "border-gray-600"}`}
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {setEmail(e.target.value);
                    if (errorData.field === "email") {setErrorData({});}
                  }}
                required
              />
              {errorData.field === "email" && (
                <WarningIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />
              )}
            </div>

            {/* Create Password */}
            <div className="relative mb-6">
              <label className={`absolute bg-white left-4 px-1 text-xs -top-2 sm:text-sm" htmlFor="password"
              ${errorData.field === "password" || errorData.field === "confirmedPassword" ? "text-red-800" : "text-gray-600"}`}>
                Create Password
              </label>
              <input
                className={`border border-gray-600 outline-none px-4 py-2 rounded-md text-sm w-full sm:px-5 sm:py-2.75 sm:text-base
                  ${errorData.field === "password" || errorData.field === "confirmedPassword" ? "border-red-500" : "border-gray-600"}`}
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => {setPassword(e.target.value);
                    if (errorData.field === "password" || errorData.field === "confirmedPassword") {setErrorData({});}
                  }}
                required
              />
              {(errorData.field === "password" || errorData.field === "confirmedPassword") && (
                <WarningIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative mb-6">
              <label className={`absolute bg-white left-4 px-1 text-xs -top-2 sm:text-sm" htmlFor="confirmPassword">
              ${errorData.field === "confirmedPassword" ? "text-red-800" : "text-gray-600"}`}>
                Confirm Password
              </label>
              <input
                className={`border border-gray-600 outline-none px-4 py-2 rounded-md text-sm w-full sm:px-5 sm:py-2.75 sm:text-base
                  ${errorData.field === "confirmedPassword" ? "border-red-500" : "border-gray-600"}`}
                id="confirmedPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmedPassword}
                onChange={(e) => {setConfirmedPassword(e.target.value);
                    if (errorData.field === "confirmedPassword") {setErrorData({});}
                  }}
                required
              />
              {errorData.field === "password" || errorData.field === "confirmedPassword" && (
                <WarningIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />
              )}
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="bg-[#ffbb00] cursor-pointer font-semibold p-2.5 relative rounded-md text-[#26382f] text-xs transition-[background-color] duration-300 ease-out sm:text-sm sm:p-3.5 
            hover:bg-black hover:text-white">
              Sign Up
            </button>

            {/* Divider */}
            <div className="flex justify-center my-1.5 sm:my-2.5">
              <span>or</span>
            </div>

            <button type="button" className="bg-white border border-gray-600 cursor-pointer flex font-semibold gap-2.5 items-center justify-center px-3.75 py-2.5 rounded-md text-xs sm:text-sm
            hover:border-[#4285f4]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262"
              className="w-5 sm:w-6">
                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
              </svg>
              <span>Sign  with Google</span>
            </button>
            <div className="flex flex-row gap-1.25 items-center justify-center mt-2 text-xs sm:text-sm">
              <p className="border-b-2 border-transparent py-0.5">Already have an account?</p>
              <Link className="border-b-2 border-[#26382f] cursor-pointer no-underline py-0.5 text-[#26382f]" to="/login">
                Login
              </Link>  
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;