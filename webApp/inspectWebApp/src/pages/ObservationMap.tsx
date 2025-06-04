import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import "../assets/styles/ObservationMap.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_MAP_ID;
console.log(mapId)

function ObservationMap() {
    const [location, setLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

    const testData = [
        {image: "https://www.bodieko.si/wp-content/uploads/2011/05/Pikapolonica.jpg", position:{lat: 46.334567, lng: 15.437226}},
        {image: "https://www.bodieko.si/wp-content/uploads/2011/05/Pikapolonica.jpg", position:{lat: 46.335632, lng: 15.436226}},
        {image: "https://www.bodieko.si/wp-content/uploads/2011/05/Pikapolonica.jpg", position:{lat: 46.333544, lng: 15.437326}},
        {image: "https://www.bodieko.si/wp-content/uploads/2011/05/Pikapolonica.jpg", position:{lat: 46.339234, lng: 15.433426}},
    ]

    useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                position => setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
            )
        }
    })
  return (
    <APIProvider apiKey={apiKey}>
      <div className="container">
        <div className="sidebarContainer">
            <Sidebar />
        </div>
        <div className="mapContainer">
            <Map zoom={15} mapId={mapId} defaultCenter={location}  mapTypeId="roadmap" disableDefaultUI={false}>
                {testData.map((item, key) => (
                    <AdvancedMarker position={item.position} key={key}>
                        <div className="mapMarker">
                            <img className="mapMarkerImage" src={item.image} />
                        </div>
                    </AdvancedMarker>
                ))}
            </Map>
        </div>
      </div>
    </APIProvider>
  );
}

export default ObservationMap;
