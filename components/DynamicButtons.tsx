"use client";

import { NFTData } from "@/redux/types";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import List from "./List";
import AttestPDF from "./AttestPDF";
import Purchase from "./Purchase";
import Update from "./Update";
import PopoverButton from "./PopoverButton";
import Delist from "./Delist";
import Burn from "./Burn";

interface DynamicButtonsProps {
  data: NFTData;
  isOwner: boolean;
  isConnected: boolean;

  claimsImgs: string[];
}

function DynamicButtons({
  data,
  isOwner,
  isConnected,

  claimsImgs,
}: DynamicButtonsProps) {
  const { address } = useWeb3ModalAccount();
  if (isConnected) {
    if (isOwner) {
      return (
        <PopoverButton>
          <div className={`flex space-x-1`}>
            <List data={data}>
              <button
                onClick={(e) => e.stopPropagation()}
                className={`lg:h-[28px] h-[24px] w-fit font-medium text-black hover:bg-[#3D00B7] flex justify-center items-center hover:text-white active:opacity-50 lg:text-[15px] text-[10px] border bg-white rounded-[12px] px-2`}
              >
                List
              </button>
            </List>
            <AttestPDF tokenAccount={data.tokenAccount}>
              <button
                onClick={(e) => e.stopPropagation()}
                className={`lg:h-[28px] h-[24px] w-fit font-medium text-black hover:bg-[#3D00B7] flex justify-center items-center hover:text-white active:opacity-50 lg:text-[15px] text-[10px] border bg-white rounded-[12px] px-2`}
              >
                <p>Attest</p>
              </button>
            </AttestPDF>
            <Burn data={data} />
          </div>
        </PopoverButton>
      );
    } else if (!isOwner && data.isListing && data.owner !== address) {
      return (
        <Purchase
          attributes={[...data.attributes, ...claimsImgs]}
          data={data}
          name={data.name}
          image={data.image}
        >
          <button
            onClick={(e) => e.stopPropagation()}
            className={`lg:h-[28px] h-[24px] w-fit font-medium text-black hover:bg-[#3D00B7] space-x-1 flex justify-center items-center hover:text-white active:opacity-50 lg:text-[15px] text-[12px] border bg-white rounded-[10px] px-2`}
          >
            Purchase
          </button>
        </Purchase>
      );
    } else if (!isOwner && data.isListing && data.owner === address) {
      return (
        <PopoverButton>
          <div className={`flex space-x-1`}>
            <Update data={data}>
              <button
                onClick={(e) => e.stopPropagation()}
                className={`lg:h-[28px] h-[24px] w-fit font-medium text-black hover:bg-[#3D00B7] flex justify-center items-center hover:text-white active:opacity-50 lg:text-[15px] text-[10px] border bg-white rounded-[12px] px-2`}
              >
                Update
              </button>
            </Update>
            <AttestPDF tokenAccount={data.tokenAccount}>
              <button
                onClick={(e) => e.stopPropagation()}
                className={`lg:h-[28px] h-[24px] w-fit font-medium text-black hover:bg-[#3D00B7] flex justify-center items-center hover:text-white active:opacity-50 lg:text-[15px] text-[10px] border bg-white rounded-[12px] px-2`}
              >
                <p>Attest</p>
              </button>
            </AttestPDF>
            <Delist data={data} />
          </div>
        </PopoverButton>
      );
    }
  }
}

export default DynamicButtons;
