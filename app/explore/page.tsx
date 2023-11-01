"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import dynamic from "next/dynamic";
import { ClipLoader } from "react-spinners";
import { getGeojson, getAll } from "@/actions/actions";
import { NFTData } from "@/redux/types";
import Compass from "@/components/Compass";
import Discover from "@/components/Discover";
import Filter from "@/components/Filter";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setGeoJson } from "@/redux/slices/geojson.slice";
import { getData } from "@/redux/slices/nfts.slice";
const DynamicCol = dynamic(() => import("@/components/Col"), {
  loading: () => (
    <div
      className={`w-[200px] space-x-5 lg:h-[200px] h-[150px] flex items-center justify-center`}
    >
      <ClipLoader size={25} color={`#3D00B7`} />
    </div>
  ),
});
const DynamicPopup = dynamic(() => import("@/components/Popup"));

function Main() {
  const data = useSelector((state: RootState) => state.nfts.value);
  const geojson = useSelector((state: RootState) => state.geojson.value);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX as string;
  const dispatch = useDispatch();
  mapboxgl.accessToken = ACCESS_TOKEN;
  let map = useRef<mapboxgl.Map | null>(null);
  const [details, setDetails] = useState<GeoJSON.GeoJsonProperties | undefined>(
    undefined
  );
  const [lat, setLat] = useState(7.1881);
  const [lng, setLng] = useState(21.0938);
  const [zoom, setZoom] = useState(2);
  const [imgs, setImgs] = useState<string[] | string>("");
  const [tabOpen, setTabOpen] = useState(false);
  const [metadataURI, setMetadataURI] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let allNFTData = await getAll();
        if (allNFTData !== undefined) {
          let geo = await getGeojson(allNFTData);
          dispatch(setGeoJson(geo));
          dispatch(getData(allNFTData));
          console.log("All data fetched");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error setting data:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (data.length !== 0 && mapContainer.current instanceof HTMLElement) {
      if (map.current === null) {
        console.log("New map created");
        map.current = new mapboxgl.Map({
          container: mapContainer.current as HTMLDivElement,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [lng, lat],
          zoom: zoom,
          projection: {
            name: "mercator",
          },
        });
      }
      map.current.scrollZoom.disable();
      map.current.on("touchstart", (e) => {
        if (e.points.length === 2) {
          e.preventDefault();
        }
      });

      map.current.on("load", () => {
        if (map.current) {
          map.current.addSource("mydata", {
            type: "geojson",
            data: geojson,
          });

          map.current.addLayer({
            id: "custom-layer",
            type: "circle",
            source: "mydata",
            paint: {
              "circle-radius": 6,
              "circle-stroke-width": 2,
              "circle-color": "#19c37d",
              "circle-stroke-color": "white",
            },
          });
          map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        }
      });
      console.log("map Initialized");
      map.current.on("click", "custom-layer", (e) => {
        //@ts-ignore
        const id = e.features[0].properties.id;
        //@ts-ignore
        const foundObject = data.find((nft) => nft.id == id);
        if (foundObject) {
          setDetails(foundObject);
          setMetadataURI(foundObject.ipfsUri);
          setImgs(foundObject.projectImages);
          setTabOpen(true);

          map.current?.flyTo({
            center: [e.lngLat.lng, e.lngLat.lat],
            zoom: 7,
            essential: true,
          });
        } else {
          //Happy hallowen
        }
      });
    } else {
      console.log("Map container:", mapContainer.current);
      console.log("Map failed to init");
    }
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        console.log("Map removed");
      }
    };
  }, [lng, lat, zoom, data, geojson]);

  function selectNFT(e: React.MouseEvent<HTMLDivElement>, data: NFTData) {
    if (!(e.target instanceof HTMLDivElement)) {
      return;
    }
    setDetails(data);
    setImgs(data.projectImages);
    setMetadataURI(data.ipfsUri);
    setTabOpen(true);
    map.current?.flyTo({
      center: [data.coordinates[0], data.coordinates[1]],
      zoom: 7,
      essential: true,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  console.log(geojson);

  return (
    <>
      {isLoading ? (
        <Compass />
      ) : (
        <div className={`relative h-full`}>
          <div
            ref={mapContainer}
            className="block mt-[80px] h-[500px] lg:h-[630px] relative"
          >
            {details != undefined && tabOpen ? (
              <DynamicPopup
                ipfs={metadataURI}
                setTabOpen={setTabOpen}
                details={details}
                tabOpen={tabOpen}
                imgs={imgs as string[]}
              />
            ) : null}
          </div>
          <Filter />
          <div className="flex justify-center py-11 w-full">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 md:gap-10 lg:gap-10 grid-cols-2 gap-y-5 gap-x-2">
              {data.length !== 0 &&
                data.map((nft, index) => (
                  <DynamicCol key={index} data={nft} click={selectNFT} />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
