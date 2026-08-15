import { useState } from "react";
import { NavLink } from "react-router-dom";
import ProfilePlaceholder from "../assets/dashboarddesigns/profileplaceholder.avif"
import summitLogoGreen from "../assets/summitgreen.png";


const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const authTokenValid = true;

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
  
  const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Careers", path: "/careers" },
  ];

  const handleMenuState = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-white border-b border-[rgba(0,0,0,.05)] fixed left-0 px-10 py-2.5 top-0 w-full z-50 lg:px-16">
      <nav className="flex items-center justify-between">
        <NavLink to="/">
          <img alt="Summit" className="h-auto py-3 w-25" src={summitLogoGreen}/>
        </NavLink>   
        <ul className="hidden items-center min-[900px]:flex gap-19 list-none mx-0 my-1">
            <li>
              <NavLink className="
              font-medium inline-flex no-underline px-0 py-3 relative text-sm text-[#26382f] tracking-[1.2px] z-1 transition duration-200
              before:absolute before:bottom-0 before:border-b-2 before:border-[#26382f] before:content-[''] before:right-0 before:top-0 before:transition-[width] before:duration-200 before:ease-out before:w-0 before:-z-1
              hover:before:left-0 hover:before:right-auto hover:before:w-full
              " to="/">Home</NavLink>
            </li>
            <li>
              <NavLink className="
              font-medium inline-flex no-underline px-0 py-3 relative text-sm text-[#26382f] tracking-[1.2px] z-1 transition duration-200
              before:absolute before:bottom-0 before:border-b-2 before:border-[#26382f] before:content-[''] before:right-0 before:top-0 before:transition-[width] before:duration-200 before:ease-out before:w-0 before:-z-1
              hover:before:left-0 hover:before:right-auto hover:before:w-full
              " to="/about">About</NavLink>
            </li>
            <li>
              <NavLink className="
              font-medium inline-flex no-underline px-0 py-3 relative text-sm text-[#26382f] tracking-[1.2px] z-1 transition duration-200
              before:absolute before:bottom-0 before:border-b-2 before:border-[#26382f] before:content-[''] before:right-0 before:top-0 before:transition-[width] before:duration-200 before:ease-out before:w-0 before:-z-1
              hover:before:left-0 hover:before:right-auto hover:before:w-full
              " to="/services">Services</NavLink>
            </li>
            <li>
              <NavLink className="
              font-medium inline-flex no-underline px-0 py-3 relative text-sm text-[#26382f] tracking-[1.2px] z-1 transition duration-200
              before:absolute before:bottom-0 before:border-b-2 before:border-[#26382f] before:content-[''] before:right-0 before:top-0 before:transition-[width] before:duration-200 before:ease-out before:w-0 before:-z-1
              hover:before:left-0 hover:before:right-auto hover:before:w-full
              " to="/careers">Careers</NavLink>
            </li>
            <li>
              {!authTokenValid ? (
              <li>
              <NavLink className="bg-[#ffbb00] font-medium inline-flex no-underline px-5 py-2.5 relative rounded-sm text-sm text-[#26382f] tracking-[1.2px] transition-[background-color] duration-300 ease-out hover:bg-black hover:text-white"
              to="/login">
                  Login
              </NavLink>
            </li>
            ) : (
            <li className="bg-white p-1 text-[#26382f]">
              <NavLink
                to="/profile"
                className="flex flex-row gap-3 items-center"
              >
              <img src={ProfilePlaceholder} alt="Profile Picture" className="w-9 h-9 rounded-full"/>
              <div className="flex flex-col items-start justify-center pr-3">
                <span className="font-semibold text-nowrap text-sm">
                  {`${cardInfo.firstName.slice(0, 15)} ${cardInfo.lastName.charAt(0)}.`}
                </span>
                <span className="font-medium text-[10px]">
                  {cardInfo.position}
                </span>
              </div>
              </NavLink>
            </li>
            )}
            </li>
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
            <ul className="absolute flex flex-col h-screen items-center left-0 top-full w-full min-[900px]:hidden">
              {links.map((link, index) => (
                <li
                  key={link.path}
                  className="bg-white border-b border-[#bbbbbb] opacity-1 text-center w-full z-40 animate-slidedown"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <NavLink className="flex flex-1 items-center justify-center py-5" to={link.path} onClick={() => handleMenuState()}>{link.name}</NavLink>
                </li>
              ))}
              <li
                  className="bg-black border-b border-black opacity-1 text-white text-center w-full z-40 animate-slidedown"
                  style={{ animationDelay: `120ms` }}
                >
                  <NavLink className="flex flex-1 items-center justify-center py-5" to="/login" onClick={() => handleMenuState()}>Login</NavLink>
              </li>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-30"/>
            </ul>
          }
      </nav>
    </div>
  );
};

export default Navbar;