import { useState } from "react";
import "../assets/styles/Sidebar.css";
import Details from "./Details";
import Filter from "./Filter";
import type { Observation } from "../pages/ObservationMap";

type SidebarProps = {
  selectedObservation: Observation;
  selectView: (view: string) => void;
};

function Sidebar({selectedObservation, selectView}: SidebarProps) {
  const [selected, setSelected] = useState("Jaz");

  return (
    <div className="sidebarContentContainer">
      <div className="filterContainer">
        <div className="tabsContainer">
          <button
            className={`tab ${selected === "Jaz" ? "active" : ""}`}
            onClick={() => {setSelected("Jaz"); selectView("Jaz")}}
          >
            Jaz
          </button>
          <span className="tabSeperator">|</span>
          <button
            className={`tab ${selected === "Prijatelji" ? "active" : ""}`}
            onClick={() => {setSelected("Prijatelji"); selectView("Prijatelji")}}
          >
            Prijatelji
          </button>
          <span className="tabSeperator">|</span>
          <button
            className={`tab ${selected === "Vsi" ? "active" : ""}`}
            onClick={() => {setSelected("Vsi"); selectView("Vsi")}}
          >
            Vsi
          </button>
        </div>
      </div>
      <div className="analyticsContainer">
        <Filter />
      </div>
      <div className="observationDetailsContainer">
        {selectedObservation ? 
        <Details 
          imageURL={"https://www.urbanatura.si/data/galerija/5bed4071308fc9cc9a0b606d5a6f40a22ddf116a/31623837306Dorcus_8.JPG"} 
          insectId={selectedObservation.TK_rod.toString()}
          observationOwner={selectedObservation.username!}
          observationDate={selectedObservation.cas}
          observationLocation={selectedObservation.position.lat.toString()} 
        />
          : <p>Nobeno opažanje ni izbrano</p>
       }
        </div>
    </div>
  );
}

export default Sidebar;
