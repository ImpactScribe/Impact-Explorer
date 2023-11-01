"use client";

import { useState } from "react";
import { getAll, getGeojson, getOwnedTokens } from "@/actions/actions";
import { useDispatch } from "react-redux";
import { getData } from "@/redux/slices/nfts.slice";
import { setGeoJson } from "@/redux/slices/geojson.slice";
function Filter() {
  const [show, setShow] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const dispatch = useDispatch();
  const filters = [
    {
      name: "Listings",
      method: async function getListings() {
        try {
          let listings = await getAll();
          if (listings !== undefined) {
            let geo = await getGeojson(listings);
            dispatch(setGeoJson(geo));
            dispatch(getData(listings));
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
            dispatch(getData([]));
            let geo = await getGeojson(ownedNfts);
            dispatch(getData(ownedNfts));
            dispatch(setGeoJson(geo));
          }
        } catch (err) {
          console.error("Failed to fetch owned NFTS:", err);
        }
      },
    },
  ];
  const handleClick = () => {
    setShow((prevShow) => !prevShow);
  };
  const applyFilter = () => {
    filters[selectedFilter].method();
    setShow(false);
  };

  return (
    <div className={`block lg:w-[80%] w-[90%] mx-auto relative`}>
      <div
        className={`flex w-full justify-start px-6 border items-center my-[20px] shadow mx-auto h-[70px] rounded-lg`}
      >
        <button
          onClick={() => handleClick()}
          type="button"
          className={`flex w-[130px] active:opacity-60 h-[35px] rounded-[10px] border justify-center items-center space-x-2`}
        >
          Filter
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div
        className={`${
          show ? "block" : "hidden"
        } absolute top-[70px] w-[50%] z-[29] flex p-4 bg-white shadow`}
      >
        <div className={`block w-[250px] space-y-3 rounded-lg`}>
          <div className={`block w-full p-3 border rounded-lg`}>
            <h3 className={`text-center`}>Categories</h3>
            <ul className={`space-y-3`}>
              {filters.map((item, index) => (
                <li className={`flex space-x-3 items-center`} key={index}>
                  <input
                    type="checkbox"
                    name="listing"
                    id="listing"
                    checked={selectedFilter === index}
                    onChange={() => {
                      setSelectedFilter(index);
                    }}
                  />
                  <label htmlFor="listing">{item.name}</label>
                </li>
              ))}
            </ul>
          </div>
          <button
            className={`w-[100px] h-[35px] block mx-auto rounded-[10px] active:opacity-75 bg-[#3D00B7] text-white`}
            onClick={applyFilter}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
