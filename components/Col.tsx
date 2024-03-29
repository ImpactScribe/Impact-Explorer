"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isOwnerOf } from "@/actions/clientActions";
import { NFTData } from "@/redux/types";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getClaims } from "@/actions/hypercerts";
import { BrowserProvider, ethers } from "ethers";
import DynamicButtons from "./DynamicButtons";

interface ColProps {
  name?: string;
  img?: string;
  data: NFTData;
  click?: (e: React.MouseEvent<HTMLDivElement>, data: any) => void;
}

function Col({ click, data }: ColProps) {
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const isConnected = useSelector(
    (state: RootState) => state.isConnected.value
  );

  const [attestData, setAttestData] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [claimsImgs, setClaimsImgs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (data !== undefined) {
        try {
          let imgSrcs = [];
          let attestData = [];
          let accountClaims = await getClaims(data.tokenAccount);
          if (accountClaims && accountClaims.length > 0) {
            let promises = accountClaims.map(async (claim) => {
              let res = await fetch(`https://ipfs.io/ipfs/${claim.claim.uri}`);
              if (res.ok) {
                let data = await res.json();
                let img = data.image;
                return img; // Return the image URL
              } else {
                return null;
              }
            });
            let hypercertIDs = accountClaims.map((claim) => claim.tokenID);
            let derseyPromises = hypercertIDs.map(async (id) => {
              let res = await fetch(
                `https://us-central1-deresy-dev.cloudfunctions.net/api/search_reviews?hypercertID=${id}`
              );
              if (res.ok) {
                let data = await res.json();
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
          console.error("Error fetching claims data", err);
        }
      }
    })();
  }, [data]);

  useEffect(() => {
    if (isConnected && data.id && walletProvider) {
      isOwnerOf(data.id, new BrowserProvider(walletProvider))
        .then((res) => setIsOwner(res as boolean))
        .catch((err) => console.error("Unable to define ownership", err));
    }
  }, [isConnected, data, walletProvider]);

  return (
    <div
      className={`block shadow mt-1 lg:w-[269px] mx-auto lg:h-fit md:h-[300px] md:w-[200px] w-[170px] h-[280px] p-2  rounded-[20px]`}
      onClick={(e) => click && click(e, data)}
    >
      <div
        suppressHydrationWarning
        style={{ backgroundImage: `url('${data.image}')` }}
        className="bg-cover lg:w-[250px] block mx-auto lg:h-[250px] md:w-[200px] md:h-[200px] w-full h-[150px] relative rounded-[15px]"
      ></div>
      <div className="flex items-center mt-5">
        <div className="block lg:space-y-2  space-y-1 w-full">
          <p
            className={`lg:text-[19px] text-[12px] text-black font-semibold`}
            suppressHydrationWarning
          >
            {data.name}
          </p>
          <div className="flex w-full justify-between items-center px-1 lg:px-2 pb-1 lg:pb-3">
            {data.price && (
              <div className="flex space-x-2 items-center">
                <Image
                  src={`/ethgreen2.png`}
                  alt="eth"
                  width={9}
                  height={15}
                  className={`w-[9px] h-[15px]`}
                />
                <p className={`text-[11px] font-[500] text-black`}>
                  {ethers.formatUnits(`${data.price}`, "ether").toString()} ETH
                </p>
              </div>
            )}
            <p className={`text-[13px] block font-medium text-black`}>
              #{data.id}
            </p>
          </div>
          <hr />
          <div className="flex justify-between px-3">
            <div className={`flex items-center`}>
              <Link
                target="_blank"
                href={`https://goerli.etherscan.io/address/${data.tokenAccount}#nfttransfers`}
              >
                <Image
                  src={`/etherscan.png`}
                  alt="link"
                  width={20}
                  height={20}
                  className={`rounded-[50%]`}
                />
              </Link>
              <Link href={`${data.ipfsUri}`} target="_blank">
                <Image
                  src={`/ipfs.png`}
                  alt="link"
                  width={20}
                  height={20}
                  className={`rounded-[50%]`}
                />
              </Link>
              <Link
                target="_blank"
                href={`https://tokenbound.org/assets/goerli/0x4bB0a205fceD93c8834b379c461B07BBe6aAE622/${data.id}`}
              >
                <Image
                  src={`/tokenbound.svg`}
                  alt="link"
                  width={20}
                  height={20}
                  className={`rounded-[50%]`}
                />
              </Link>
            </div>
            <DynamicButtons
              claimsImgs={claimsImgs}
              isConnected={isConnected}
              data={data}
              isOwner={isOwner}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Col;
