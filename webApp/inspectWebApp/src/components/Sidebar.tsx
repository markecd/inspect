import { useState } from "react";
import "../assets/styles/Sidebar.css";
import Details from "./Details";
import Filter from "./Filter";

function Sidebar() {
  const [selected, setSelected] = useState("Jaz");

  return (
    <div className="sidebarContentContainer">
      <div className="filterContainer">
        <div className="tabsContainer">
          <button
            className={`tab ${selected === "Jaz" ? "active" : ""}`}
            onClick={() => setSelected("Jaz")}
          >
            Jaz
          </button>
          <span className="tabSeperator">|</span>
          <button
            className={`tab ${selected === "Prijatelji" ? "active" : ""}`}
            onClick={() => setSelected("Prijatelji")}
          >
            Prijatelji
          </button>
          <span className="tabSeperator">|</span>
          <button
            className={`tab ${selected === "Vsi" ? "active" : ""}`}
            onClick={() => setSelected("Vsi")}
          >
            Vsi
          </button>
        </div>
      </div>
      <div className="analyticsContainer">
        <Filter />
      </div>
      <div className="observationDetailsContainer">
        <Details imageURL={"https://www.urbanatura.si/data/galerija/5bed4071308fc9cc9a0b606d5a6f40a22ddf116a/31623837306Dorcus_8.JPG"} insectId={"5743112"} observationOwner={"Mare Care"} observationDate={"20. 5. 2025"} observationLocation={"Blato"} />
      </div>
    </div>
  );
}

export default Sidebar;
