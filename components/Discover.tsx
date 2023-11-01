"use client";

import { getAll, getGeojson, getOwnedTokens } from "@/actions/actions";

import FilterButton from "./FilterButton";
import { useEffect, useState } from "react";
import { Map } from "mapbox-gl";
import mapboxgl from "mapbox-gl";

// interface DiscoverProps {
//   map: Map | null;
//   setDetails: (value: React.SetStateAction<any>) => void;
//   setMetadataURI: (value: React.SetStateAction<any>) => void;
//   setImgs: (value: React.SetStateAction<any>) => void;
//   setTabOpen: (value: React.SetStateAction<any>) => void;
// }

function Discover() {
  const [selectedFilter, setSelectedFilter] = useState(0);
  const filters = [
    {
      name: "Listings",
      method: async function getListings() {
        try {
          let listings = await getAll();
          if (listings !== undefined) {
            // setAllData([]);
            // let geo = await getGeojson(listings);
            // setGeojson(geo);
            // setAllData(listings);
          }
        } catch (error) {
          console.error("Error setting data:", error);
        }
      },
    },

    {
      name: "My ImpactCerts",
      method: async function getMyImpactCerts() {
        try {
          let ownedNfts = await getOwnedTokens();
          if (ownedNfts !== undefined) {
            // setAllData([]);
            // let geo = await getGeojson(ownedNfts);
            // setAllData(ownedNfts);
            // setGeojson(geo);
          }
        } catch (err) {
          console.error("Failed to fetch owned NFTS:", err);
        }
      },
    },
  ];

  // useEffect(() => {
  //   filters[selectedFilter].method();
  // }, [selectedFilter]);

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
