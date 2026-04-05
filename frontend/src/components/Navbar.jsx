import { LuBellRing } from "react-icons/lu";


// components/Navbar.jsx
const Navbar = ({ onLogout }) => {
  return (
    <div className="bg-white border-b border-[1.3px] border-gray-300 shadow-xl px-6 py-3 flex justify-between items-center">
      
      {/* Left */}
      <div className="flex items-center gap-2 font-semibold text-lg">
        <span className="bg-black text-white p-2 rounded-md"><LuBellRing/></span>
        PriceWatch
      </div>

      {/* Right */}
      <div className="hidden md:flex gap-6 text-gray-600 items-center">
        <span className="cursor-pointer hover:text-black">Home</span>
        <span className="cursor-pointer hover:text-black">About</span>
        <span className="cursor-pointer hover:text-black">Help</span>
        <span
          onClick={onLogout}
          className="text-red-500 cursor-pointer font-medium"
        >
          Logout
        </span>
      </div>
    </div>
  );
};

export default Navbar;