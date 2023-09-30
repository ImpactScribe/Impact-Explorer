"use client";
import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

function CreateNFT() {
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX as string;
  mapboxgl.accessToken = ACCESS_TOKEN;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lat, setLat] = useState(39.8283);
  const [lng, setLng] = useState(-98.5795);
  const [zoom, setZoom] = useState(2);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const numTabs = 4;
  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleNextClick = () => {
    if (currentTab < numTabs - 1) {
      setCurrentTab(currentTab + 1);
    }
  };
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const renderTabs = () => {
    const tabs = [];
    for (let i = 0; i < numTabs; i++) {
      tabs.push(
        <div
          key={i}
          className={`mx-1 mt-6 rounded-lg cursor-pointer ${
            currentTab === i
              ? "bg-[#3D00B7] h-[6px] lg:w-[35px]"
              : "bg-gray-400 h-[5px] lg:w-[30px]"
          }`}
          ref={(ref) => (tabRefs.current[i] = ref)}
          onClick={() => setCurrentTab(i)}
        ></div>
      );
    }
    return tabs;
  };

  useEffect(() => {
    if (currentTab === 2) {
      // Initialize the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom: zoom,
        projection: {
          name: "mercator",
        },
      });
    } else if (map.current) {
      // If the tab is switched away from the map, remove the map instance
      map.current.remove();
      map.current = null;
    }
  }, [currentTab]);

  return (
    <div className={`block w-full p-6`}>
      <div className="flex justify-center items-center">{renderTabs()}</div>
      <form
        className={`block relative  mx-auto border rounded-xl py-4 w-[40%] mt-[30px] p-5 `}
      >
        <h1 className={`text-center font-semibold text-[22px]`}>Create NFT</h1>
        {/* <div
          className={`absolute top-3 right-6 rounded-[50%] w-[30px] font-semibold flex justify-center items-center h-[30px] text-white bg-[#3D00B7]`}
        >
          {currentTab + 1}
        </div> */}
        {currentTab == 0 && (
          <div className={`space-y-6 mt-7 h-[70vh]`}>
            <input
              type="text"
              placeholder="Name"
              className={`ps-5 block mx-auto w-[80%] h-[35px] rounded-[15px] border`}
            />
            <input
              type="text"
              placeholder="Owner"
              className={`ps-5 block mx-auto w-[80%] h-[35px] rounded-[15px] border`}
            />
            <input
              type="text"
              placeholder="Type"
              className={`ps-5 block mx-auto w-[80%] h-[35px] rounded-[15px] border`}
            />
            <Select
              options={options}
              className={`w-[80%] block mx-auto rounded-[15px]`}
              placeholder={`Attributes`}
              isMulti
              closeMenuOnSelect={false}
            />
          </div>
        )}
        {currentTab == 1 && (
          <div className={`space-y-6 mt-7 h-[70vh]`}>
            <fieldset>
              <input
                type="text"
                placeholder="NFT Image URI"
                className={`ps-5 block mx-auto w-[80%] h-[35px] rounded-[15px] border`}
              />
              <p className={`text-center my-2 text-[17px]`}>Or</p>
              <input
                type="file"
                name="image"
                id="image"
                className={`rounded-[15px] block mx-auto mt-2 h-[30px] py-[2px] w-[80%] border ps-3`}
              />
            </fieldset>

            <input
              type="text"
              placeholder="Project Location"
              className={`ps-5 block mx-auto w-[80%] h-[35px] rounded-[15px] border`}
            />
            <fieldset className="block space-y-6 w-full">
              <label
                htmlFor="projectimages"
                className={`text-center block font-[500]`}
              >
                Project Images
              </label>
              <input
                type="file"
                name="image"
                id="projectimages"
                className={`rounded-[15px] block mx-auto mt-2 h-[30px] py-[2px] w-[80%] border ps-3`}
              />
              <input
                type="file"
                name="image"
                id="projectimages"
                className={`rounded-[15px] block mx-auto mt-2 h-[30px] py-[2px] w-[80%] border ps-3`}
              />
              <input
                type="file"
                name="image"
                id="projectimages"
                className={`rounded-[15px] block mx-auto mt-2 h-[30px] py-[2px] w-[80%] border ps-3`}
              />
            </fieldset>
          </div>
        )}
        {currentTab == 2 && (
          <div className={`h-[100vh]`}>
            <div
              ref={mapContainer}
              className={`block w-full h-[300px] rounded-lg`}
            />
          </div>
        )}
        <button
          type="button"
          className={`bg-[#3D00B7] w-[100px] absolute bottom-10 right-6 rounded-lg h-[30px] text-white hover:opacity-60 block`}
          onClick={() => handleNextClick()}
        >
          Next
        </button>
      </form>
    </div>
  );
}

export default CreateNFT;
