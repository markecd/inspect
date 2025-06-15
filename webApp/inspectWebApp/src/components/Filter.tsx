import { useState } from "react";
import "../assets/styles/Sidebar.css";


const redCodeToNameMap: Record<string, string> = {
  H: "Hrošči",
  K: "Kobilice",
  M: "Metulji",
  D: "Dvokrilci",
  B: "Bogomolke",
  KP: "Kačji Pastirji",
  KK: "Kožekrilci",
  P: "Polkrilci",
};

function Filter() {
  const [selectedRed, setSelectedRed] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSearch = () => {
console.log(selectedRed, fromDate, toDate)
  };

  return (
    <div className="filterWrapper">
      <select
        className="filterInput"
        value={selectedRed}
        onChange={(e) => setSelectedRed(e.target.value)}
      >
        <option value="">Vse kategorije</option>
        {Object.entries(redCodeToNameMap).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      <input
        className="filterInput"
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <input
        className="filterInput"
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      <button className="filterButton" onClick={handleSearch}>Išči</button>

    </div>
  );
}

export default Filter;
