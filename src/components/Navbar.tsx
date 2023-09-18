import { TbMenu } from "react-icons/tb";
import { MdClose } from "react-icons/md";

import { useState } from "react";
import ConnectWallet from "./ConnectWallet";

function Navbar() {
  const [show, setShow] = useState(false);
  return (
    <div className="fixed w-full top-0 bg-white z-[21]">
      <nav
        className="w-full flex h-[60px] lg:justify-around justify-between lg:text-[16px] md:text-[15px] text-[13px]
      items-center lg:py-[35px] py-[15px]  lg:px-[1%] md:px-[1%] px-[15px]"
      >
        <p className={`integral text-[#3D00B7] lg:text-[24px] text-[18px]`}>
          NFTERS
        </p>
        <ul
          className={`dmsans lg:flex hidden justify-end lg:space-x-8 lg:w-[40%] w-fit space-x-2 lg:text-[16px] text-[13px] items-center`}
        >
          <li className="hover:text-sky-500 cursor-pointer">Marketplace</li>
          <li className="hover:text-sky-500 cursor-pointer">Resource</li>
          <li className="hover:text-sky-500 cursor-pointer">About</li>
        </ul>
        <ConnectWallet className="lg:block hidden" />
        <button
          className={`p-2 rounded-[50%] lg:hidden block border`}
          onClick={() => setShow((prevShow) => !prevShow)}
        >
          {show ? <MdClose size={18} /> : <TbMenu size={18} />}
        </button>
      </nav>
      <div className={`${show ? "block" : "hidden"} lg:hidden py-3`}>
        <hr />
        <ul className={`  text-[12px] text-center space-y-2`}>
          <li className="hover:text-sky-500 cursor-pointer">Marketplace</li>
          <li className="hover:text-sky-500 cursor-pointer">Resource</li>
          <li className="hover:text-sky-500 cursor-pointer">About</li>
        </ul>
        <ConnectWallet className="lg:hidden flex mx-auto mt-1" />
      </div>
    </div>
  );
}

export default Navbar;