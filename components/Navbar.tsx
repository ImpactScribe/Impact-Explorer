import ConnectWallet from "@/hooks/ConnectWallet";
import localFont from "next/font/local";
const myFont = localFont({
  src: "./intcf/IntegralCF-Bold.otf",
  display: "swap",
});

import { DM_Sans } from "next/font/google";
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

function Navbar() {
  return (
    <nav
      className="w-full flex h-[60px] justify-around lg:text-[16px] md:text-[15px] text-[13px]
      items-center lg:py-[35px] py-[15px] sticky top-0 bg-white lg:px-[1%] md:px-[1%] px-1 z-[21]"
    >
      <p
        className={`${myFont.className} text-[#3D00B7] lg:text-[24px] text-[13px]`}
      >
        NFTERS
      </p>
      <ul
        className={`${dmSans.className} flex justify-end lg:space-x-8 lg:w-[40%] w-fit space-x-2 lg:text-[16px] text-[13px] items-center`}
      >
        <li className="hover:text-sky-500 cursor-pointer">Marketplace</li>
        <li className="hover:text-sky-500 cursor-pointer">Resource</li>
        <li className="hover:text-sky-500 cursor-pointer">About</li>
      </ul>
      <ConnectWallet />
    </nav>
  );
}

export default Navbar;
