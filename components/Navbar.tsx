"use client";

import { IBM_Plex_Sans } from "next/font/google";
import ConnectWallet from "./ConnectWallet";
import { TbMenu } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Mint from "./Mint";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const myFont = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "700"],
});

function Navbar() {
  const [show, setShow] = useState(false);
  const isConnected = useSelector(
    (state: RootState) => state.isConnected.value
  );
  const account = useSelector((state: RootState) => state.userAccount.value);

  const path = usePathname();
  useEffect(() => {
    setShow(false);
  }, [path]);

  const start = account.slice(0, 6);
  const finish = account.slice(-5);

  return (
    <div className="fixed w-full top-0 bg-white z-[21]">
      <nav
        className="w-full flex h-[60px] lg:justify-around justify-between lg:text-[16px] md:text-[15px] text-[13px]
      items-center lg:py-[35px] py-[15px]  lg:px-[1%] md:px-[1%] px-[15px]"
      >
        <Link href={"/"} className={`flex items-center space-x-1`}>
          <Image
            src={`/logo2.png`}
            alt="logo"
            width={28}
            height={28}
            className={`lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]`}
          />
          <p
            suppressHydrationWarning
            className={`${myFont.className} text-[#3D00B7] font-[700] lg:text-[25px] text-[18px]`}
          >
            ImpactScribe
          </p>
        </Link>
        <ul
          className={`lg:flex md:flex hidden justify-end lg:space-x-8 lg:w-[40%] w-fit space-x-2 lg:text-[16px] text-[13px] items-center`}
        >
          <li className="hover:text-sky-500 cursor-pointer">
            <Link href={`/explore`}>Explore</Link>
          </li>
          <li className="hover:text-sky-500 cursor-pointer">Resource</li>
          <li className="hover:text-sky-500 cursor-pointer">About</li>
        </ul>
        <div className={`flex items-center space-x-3`}>
          {isConnected && (
            <div
              className={`flex justify-center items-center w-[140px] h-[35px] rounded-[15px] text-[#727272]`}
            >
              <p className={`truncate`}>{`${start}...${finish}`}</p>
            </div>
          )}
          {isConnected && (
            <Mint>
              <button
                className={`hover:text-white text-[#3D00B7] border lg:block hidden rounded-[25px] hover:bg-[#3D00B7] active:opacity-70 h-[35px] text-center px-2 text-[15px]`}
              >
                Create ImpactCert
              </button>
            </Mint>
          )}
          {!isConnected && <ConnectWallet className="lg:flex md:flex hidden" />}
        </div>
        <button
          className={`p-2 rounded-[50%] lg:hidden md:hidden block border`}
          onClick={() => setShow((prevShow) => !prevShow)}
        >
          {show ? <MdClose size={18} /> : <TbMenu size={18} />}
        </button>
      </nav>
      <div className={`${show ? "block" : "hidden"} lg:hidden md:hidden py-3`}>
        <hr />
        <ul className={`  text-[13px] text-center space-y-2`}>
          <li className="hover:text-sky-500 cursor-pointer">
            <Link href={`/explore`}>Explore</Link>
          </li>
          <li className="hover:text-sky-500 cursor-pointer">Resource</li>
          <li className="hover:text-sky-500 cursor-pointer">About</li>
        </ul>
        {!isConnected && (
          <ConnectWallet className="lg:hidden md:hidden flex mx-auto mt-1" />
        )}
        {isConnected && (
          <Link href={`/explore/new`} className={`block mx-auto`}>
            <button
              className={`text-white block mx-auto rounded-lg bg-[#3D00B7] hover:opacity-70 h-[32px] text-center px-2 text-[15px]`}
            >
              Create ImpactCert
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
