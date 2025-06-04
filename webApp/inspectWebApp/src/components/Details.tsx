import { useState } from "react";
import "../assets/styles/Sidebar.css";
import rawInsectData from "../assets/insect_map_extended.json";

type DetailsProps = {
  imageURL: string;
  insectId: string;
  observationOwner: string;
  observationDate: string;
  observationLocation: string;
};

type Insect = {
  name: string;
  latin: string;
  description: string;
  red: string;
  druzina: string;
};

const redCodeToNameMap: Record<string, string> = {
    "H": "Hrošči",
    "K": "Kobilice",
    "M": "Metulji",
    "D": "Dvokrilci",
    "B": "Bogomolke",
    "KP": "Kačji Pastirji",
    "KK": "Kožekrilci",
    "P": "Polkrilci",
}

const insectData = rawInsectData as Record<string, Insect>;

function Details(props: DetailsProps) {
  const insect = insectData[props.insectId];

  if (!insect) return <p>Insect data not found for ID: {props.insectId}</p>;
  const { name, latin, red, druzina, description } = insect;

  return (
    <div className="detailsWrapper">
    <div className="detailsContainer">
      <img className="observationImage" src={props.imageURL} />
      <div className="observationMainInfoContainer">
        <h2 className="insectName">{name}</h2>
        <h3 className="insectLatinName">{"(" + latin + ")"}</h3>
        <div className="observationOwner">
          <p>{props.observationOwner}</p>
        </div>
        <div className="observationDate">
          <p>{props.observationDate}</p>
        </div>
        <div className="observationLocation">
          <p>{props.observationLocation}</p>
        </div>
      </div>
    </div>
    <div className="infoContainer">
        <p>{redCodeToNameMap[red] + "->" + druzina}</p>
        <p className="description">{description}</p>
    </div>
    </div>
  );
}

export default Details;
