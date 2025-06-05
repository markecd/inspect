import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import "../assets/styles/ObservationMap.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { getAllObservations, getUserFriendsObservations, getUserObservations } from "../services/firebase/firestoreService";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_MAP_ID;
console.log(mapId);

export type Observation = {
  id: string;
  username?: string;
  cas: string;
  naziv: string;
  TK_rod: number;
  LLMConversation?: { role: string; content: string }[] | null;
  position: { lat: number; lng: number };
  image_path: string;
};

function ObservationMap() {
  const [location, setLocation] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selectedObservation, setSelectedObservation] =
    useState<Observation | null>(null);
  const [selected, setSelected] = useState("Jaz");
  const [zoom, setZoom] = useState(12);

  const image = "https://www.bodieko.si/wp-content/uploads/2011/05/Pikapolonica.jpg";

  useEffect(() => {
    const fetchData = async () => {
        console.log(selected)
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("User not logged in, redirecting or skipping fetch");
          return;
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          });
        }

        let observationsReturned;
        if(selected == "Vsi") observationsReturned = await getAllObservations();
        else if(selected == "Prijatelji") observationsReturned = await getUserFriendsObservations(userId);
        else observationsReturned = await getUserObservations(userId);
        setObservations(observationsReturned!);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [selected]);

  function setView(view: string){
    setSelected(view);
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="container">
        <div className="sidebarContainer">
          <Sidebar selectedObservation={selectedObservation!} selectView={setView}/>
        </div>
        <div className="mapContainer">
          {location &&  
          <Map
            zoom={zoom}
            onZoomChanged={(event) => setZoom(event.detail.zoom)}
            mapId={mapId}
            defaultCenter={location}
            mapTypeId="roadmap"
            disableDefaultUI={false}
          >
            {observations.map((item) => (
              <AdvancedMarker position={item.position} key={item.naziv}>
                <div
                  className="mapMarker"
                  onClick={() => setSelectedObservation(item)}
                >
                  <img className="mapMarkerImage" src={item.image_path} />
                </div>
              </AdvancedMarker>
            ))}
          </Map>
}
        </div>
      </div>
    </APIProvider>
  );
}

export default ObservationMap;
