"use client";

import { getAll, getGeojson } from "@/actions/serverActions";
import { getOwnedTokens } from "@/actions/clientActions";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import FilterButton from "./FilterButton";
import { useState } from "react";
import { BrowserProvider } from "ethers";

// interface DiscoverProps {
//   map: Map | null;
//   setDetails: (value: React.SetStateAction<any>) => void;
//   setMetadataURI: (value: React.SetStateAction<any>) => void;
//   setImgs: (value: React.SetStateAction<any>) => void;
//   setTabOpen: (value: React.SetStateAction<any>) => void;
// }

function Discover() {
  const [selectedFilter, setSelectedFilter] = useState(0);
  const { walletProvider } = useWeb3ModalProvider();
  const filters = [
    {
      name: "Listings",
      method: async function getListings() {
        try {
          let listings = await getAll();
          if (listings !== undefined) {
            let geo = await getGeojson(listings);
          }
        } catch (error) {
          console.error("Error setting data:", error);
        }
      },
    },

    {
      name: "My ImpactCerts",
      method: async function getMyImpactCerts() {
        if (walletProvider) {
          try {
            let ownedNfts = await getOwnedTokens(
              new BrowserProvider(walletProvider)
            );
            if (ownedNfts !== undefined) {
              let geo = await getGeojson(ownedNfts);
            }
          } catch (err) {
            console.error("Failed to fetch owned NFTS:", err);
          }
        }
      },
    },
  ];

  return (
    <div className="flex gap-x-4 items-center bg-[#D9E0EC] my-[10px] py-[10px] px-3">
      <ul className={`flex gap-x-4`}>
        {filters.map((item, index) => (
          <FilterButton
            key={index}
            name={item.name}
            click={() => {
              item.method();
              setSelectedFilter(index);
            }}
            isSelected={selectedFilter === index}
          />
        ))}
      </ul>
    </div>
  );
}

export default Discover;
