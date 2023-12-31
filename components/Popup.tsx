"use client";

import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
const Slider = dynamic(() => import("@/components/Slider"), {
  loading: () => (
    <div
      className={`w-[200px] space-x-5 lg:h-[200px] h-[150px] flex items-center justify-center`}
    >
      <ClipLoader size={25} color={`#3D00B7`} />
    </div>
  ),
});
import ScrollAreaComponent from "./ScrollArea";
import HoverPop from "./HoverPop";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { getClaims } from "@/actions/hypercerts";
import { NFTData } from "@/context/types";
import ClipLoader from "react-spinners/ClipLoader";
import dynamic from "next/dynamic";

interface PopupProps {
  tabOpen: boolean;
  details: NFTData;
  setTabOpen: (value: SetStateAction<boolean>) => void;
}

function Popup({ tabOpen, setTabOpen, details }: PopupProps) {
  const [attestData, setAttestData] = useState<any[]>([]);
  const [claimsImgs, setClaimsImgs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (details !== undefined) {
        try {
          let imgSrcs = [];
          let attestData = [];
          let accountClaims = await getClaims(details.tokenAccount);
          if (accountClaims && accountClaims.length > 0) {
            const promises = accountClaims.map(async (claim) => {
              const res = await fetch(
                `https://ipfs.io/ipfs/${claim.claim.uri}`
              );
              if (res.ok) {
                const data = await res.json();
                const img = data.image;
                return img; // Return the image URL
              } else {
                return null;
              }
            });
            const hypercertIDs = accountClaims.map((claim) => claim.tokenID);
            const derseyPromises = hypercertIDs.map(async (id) => {
              const res = await fetch(
                `https://us-central1-deresy-dev.cloudfunctions.net/api/search_reviews?hypercertID=${id}`
              );
              if (res.ok) {
                const data = await res.json();
                return data;
              } else {
                return null;
              }
            });
            imgSrcs = await Promise.all(promises);
            attestData = await Promise.all(derseyPromises);
          }
          setClaimsImgs(imgSrcs);
          setAttestData(attestData);
        } catch (err) {
          console.error("Error setting claims images", err);
        }
      }
    })();
  }, [details]);

  return (
    <ScrollAreaComponent tabOpen={tabOpen} setTabOpen={setTabOpen}>
      <div className="block relative mx-auto lg:h-[200px] h-[190px] w-[350px] mb-10">
        <button
          onClick={() => setTabOpen(false)}
          className={`absolute top-2 right-3 w-[30px] h-[30px] rounded-[50%] flex justify-center items-center bg-white`}
        >
          <IoClose size={23} color={"#000000"} />
        </button>
        <Image
          src={details.coverImage}
          alt="Image"
          loading="eager"
          width={350}
          height={200}
          className="block w-[350px] rounded-b-[0.4rem] h-[190px] md:h-[160px] lg:h-[190px]"
        />

        <Image
          src={details.image}
          loading="eager"
          alt="NFT"
          width={100}
          height={100}
          className={`block ring-1 ring-white/80 rounded-[50%] lg:w-[100px] lg:h-[100px] w-[70px] h-[70px] absolute left-1/2 transform -translate-x-1/2 bottom-[-2rem]`}
        />
      </div>
      <p className={`text-[24px] font-semibold text-center`}>{details.name}</p>

      <div className="grid grid-cols-4 gap-x-4 gap-y-3 w-fit mx-auto my-3">
        {Array(...claimsImgs, ...details.attributes).map((attri, index) => (
          <div
            key={index}
            className={`bg-white w-[63px] h-[63px] flex justify-center items-center rounded-[50%]`}
          >
            <HoverPop name={attri}>
              <Image
                aria-label="hhhhh"
                alt="attribute"
                src={attri}
                width={60}
                height={60}
                className={`w-[60px] h-[60px] rounded-[50%]`}
              />
            </HoverPop>
          </div>
        ))}
      </div>
      <div className={`block mx-auto w-[320px]`}>
        <h1 className={`text-[16px] font-semibold text-start`}>Description</h1>
        <p className={`lg:text-[13px] text-[11px] `}>{details.description}</p>
      </div>
      <div className={`mt-6`}>
        <Slider imgs={details.projectImages} />
      </div>
      <div className={`flex w-full justify-around items-center p-5`}>
        <Link
          target="_blank"
          href={`https://goerli.etherscan.io/address/${details.tokenAccount}#nfttransfers`}
        >
          <Image
            src={`/etherscan.png`}
            alt="link"
            width={40}
            height={40}
            className={`rounded-[50%]`}
          />
        </Link>
        <Link href={`${details.ipfsUri}`} target="_blank">
          <Image
            src={`/ipfs.png`}
            alt="link"
            width={40}
            height={40}
            className={`rounded-[50%]`}
          />
        </Link>
        <Link
          target="_blank"
          href={`https://tokenbound.org/assets/goerli/0x4bB0a205fceD93c8834b379c461B07BBe6aAE622/${details.id}`}
        >
          <Image
            src={`/tokenbound.svg`}
            alt="link"
            width={40}
            height={40}
            className={`rounded-[50%]`}
          />
        </Link>
      </div>
    </ScrollAreaComponent>
  );
}

export default Popup;
