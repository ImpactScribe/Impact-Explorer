"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Form from "./Form";
import { IoClose } from "react-icons/io5";
import { getProvider } from "@/actions/actions";
import { useState } from "react";

interface MintProps {
  children: React.ReactNode;
}

function Mint({ children }: MintProps) {
  const [open, setOpen] = useState(false);
  const verifyNet = async () => {
    const { provider, chainID } = await getProvider();
    const goerliID = 5;
    if (chainID !== goerliID) {
      await provider?.send("wallet_switchEthereumChain", [{ chainId: "0x5" }]);
    }
  };
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild onClick={() => verifyNet()}>
        {children}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed bg-neutral-900/90 inset-0 backdrop-blur z-[21]" />
        <AlertDialog.Content className="fixed focus:outline-none drop-shadow-md border z-[22] border-neutral-700 top-1 right-0 rounded-tl-[20px] rounded-bl-[20px] bg-white p-[25px]">
          <AlertDialog.Title
            className={`text-center font-semibold text-[22px]`}
          >
            Create NFT
          </AlertDialog.Title>
          <Form setOpen={setOpen} />
          <AlertDialog.Cancel asChild>
            <button
              className={`fixed top-3 right-3 flex items-center border shadow justify-center w-[30px] h-[30px] rounded-[50%] bg-white`}
            >
              <IoClose size={23} color={"#000000"} />
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action />
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default Mint;
