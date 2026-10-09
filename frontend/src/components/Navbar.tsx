import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import summitLogoGreen from "../assets/summitgreen.png";


const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateLoginStatus = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("accessToken")));
    };

    window.addEventListener("authChange", updateLoginStatus);

    // Check the current login status when Navbar mounts.
    updateLoginStatus();

    return () => {
      window.removeEventListener("authChange", updateLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/login");
  };

  //const isLoggedIn = true; // Changing this when I properly check user authentication
  
  const menuOptions = [
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Pricing", path: "/pricing" },
  ];

  const handleMenuState = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-white border-b border-[rgba(0,0,0,.05)] fixed left-0 px-10 py-2.5 top-0 w-full z-50 lg:px-16">
      <nav className="flex items-center justify-between">
        <NavLink to="/">
          <img alt="Summit" className="h-12.25 py-3 w-auto" src={summitLogoGreen}/>
        </NavLink>   
        <ul className="gap-19 hidden items-center min-[900px]:flex list-none mx-0 my-1">
          {menuOptions.map((option) => {
            return (
              <li key={option.path}>
              <NavLink className="
                font-medium inline-flex no-underline px-0 py-2 relative text-sm text-[#26382f] transition duration-200
                before:absolute before:bottom-0 before:border-b-2 before:border-[#26382f] before:content-[''] before:right-0 before:top-0 before:transition-[width] before:duration-200 before:ease-out before:w-0 before:-z-1
                hover:before:left-0 hover:before:right-auto hover:before:w-full
                " to={option.path}>{option.name}</NavLink>
            </li>
            )
          })}
            {isLoggedIn && (
            <li>
              <NavLink className="
              font-medium inline-flex no-underline px-0 py-2 relative text-sm text-[#26382f] z-1 transition duration-200
              before:absolute before:bottom-0 before:border-b-2 before:border-[#26382f] before:content-[''] before:right-0 before:top-0 before:transition-[width] before:duration-200 before:ease-out before:w-0 before:-z-1
              hover:before:left-0 hover:before:right-auto hover:before:w-full
              " to="/dashboard#insights">Dashboard</NavLink>
            </li>
            )}
            {!isLoggedIn ? (
              <div className="flex flex-row gap-3 items-center justify-center h-full">
                <li>
                  <NavLink className="bg-[#ffbb00] bg-linear-to-br from-[#ffbb00] via-[#ffcc33] to-[#ffbb00] font-medium inline-flex no-underline px-4 py-2 relative rounded-md text-sm text-[#26382f] transition-all duration-300 ease-out
                  hover:from-[#26382f] hover:via-[#2d4037] hover:to-[#26382f] hover:bg-[#26382f] hover:text-white"
                  to="/demo">
                    Book Demo
                  </NavLink>
                </li>
                <span className="bg-gray-300 h-9 w-[1.5px]"></span>
                <li>
                  <NavLink className="bg-[#26382f] bg-linear-to-br from-[#26382f] via-[#2d4037] to-[#26382f] font-medium inline-flex no-underline px-4 py-2 relative rounded-md text-sm text-white transition-all duration-300 ease-out
                  hover:bg-none hover:bg-black hover:text-white"
                  to="/login">
                    Login
                  </NavLink>
                </li>
              </div>
          ) : (
            <li>
              <NavLink className="bg-[#ffbb00] bg-linear-to-br from-[#ffbb00] via-[#ffcc33] to-[#ffbb00] font-medium inline-flex no-underline px-4 py-2 relative rounded-md text-sm text-[#26382f] transition-all duration-300 ease-out
              hover:from-[#26382f] hover:via-[#2d4037] hover:to-[#26382f] hover:bg-[#26382f] hover:text-white"
                to="/"
                onClick={() => handleLogout()}>
                  Sign Out
              </NavLink>
            </li>
            )}
          </ul>
          <div
            className="flex flex-col justify-center cursor-pointer min-[900px]:hidden"
            onClick={handleMenuState}
          >
            <div
              className={`transition-all duration-150 ${
                menuOpen ? "translate-y-2" : "delay-150"
              }`}
            >
              <span
                className={`block h-0.5 w-7 bg-[#26382f] rounded-sm transition-all duration-100 ${
                  menuOpen
                    ? "rotate-45 delay-150"
                    : "rotate-0 delay-0"
                }`}
              />
            </div>

            <span
              className={`block h-0.5 w-7 bg-[#26382f] my-1.5 rounded-sm transition-all duration-100 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />

            <div
              className={`transition-all duration-150 ${
                menuOpen ? "-translate-y-2" : "delay-150"
              }`}
            >
              <span
                className={`block h-0.5 w-7 bg-[#26382f] rounded-sm transition-all duration-100 ${
                  menuOpen
                    ? "-rotate-45 delay-150"
                    : "rotate-0 delay-0"
                }`}
              />
            </div>
          </div>
          {menuOpen &&
            <>
              <div className="fixed bg-black/30 backdrop-blur-md inset-0 top-18.25 z-30"/>
              <ul className="absolute flex flex-col h-screen items-center left-0 top-full w-full min-[900px]:hidden">
                {menuOptions.map((option, index) => (
                  <li
                    key={option.path}
                    className="bg-white border-b border-black/10 opacity-1 text-center w-full z-40 animate-slidedown"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <NavLink className="flex flex-1 items-center justify-center py-5" to={option.path} onClick={() => handleMenuState()}>{option.name}</NavLink>
                  </li>
                ))}
                {!isLoggedIn ? (
                  <>
                    <li
                      className="bg-[#ffbb00] border-b border-black/10 opacity-1 text-[#26382f] text-center w-full z-40 animate-slidedown"
                      style={{ animationDelay: `120ms` }}
                    >
                      <NavLink className="flex flex-1 items-center justify-center py-5" to="/demo" onClick={() => handleMenuState()}>Book Demo</NavLink>
                    </li>
                    <li
                      className="bg-[#26382f] border-b border-black/10 opacity-1 text-white text-center w-full z-40 animate-slidedown"
                      style={{ animationDelay: `150ms` }}
                    >
                      <NavLink className="flex flex-1 items-center justify-center py-5" to="/login" onClick={() => handleMenuState()}>Login</NavLink>
                    </li>
                    
                  </>
                ) : (
                  <>
                    <li
                      className="bg-white border-b border-black/10 opacity-1 text-center w-full z-40 animate-slidedown"
                      style={{ animationDelay: `120ms`}}
                    >
                      <NavLink className="flex flex-1 items-center justify-center py-5" to="/dashboard#insights" onClick={() => handleMenuState()}>Dashboard</NavLink>
                    </li>
                    <li
                      className="bg-[#ffbb00] border-b border-black/10 opacity-1 text-[#26382f] text-center w-full z-40 animate-slidedown"
                      style={{ animationDelay: `150ms` }}
                    >
                      <NavLink className="flex flex-1 items-center justify-center py-5" to="/demo" onClick={() => handleMenuState()}>Book Demo</NavLink>
                    </li>
                    <li
                      className="bg-[#26382f] border-b border-black/10 opacity-1 text-white text-center w-full z-40 animate-slidedown"
                      style={{ animationDelay: `180ms` }}
                    >
                      <NavLink className="flex flex-1 items-center justify-center py-5" to="/" onClick={() => handleLogout()}>Sign Out</NavLink>
                    </li>
                  </>
                )}
              </ul>
            </>
          }
      </nav>
    </div>
  );
};

export default Navbar;