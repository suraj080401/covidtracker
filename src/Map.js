import React from "react";
import { MapContainer, TileLayer} from 'react-leaflet';
import "./Map.css";
import ChangeMapView from './ChangeView';
import {showOnMap} from './util';

function Map({countries,casesType,center,zoom}) { 
  return (
    <div className="map">
    <MapContainer className="markercluster-map" center={center} zoom={zoom}>
    <ChangeMapView center={center} zoom={zoom}/>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />
        {showOnMap(countries,casesType)}
    </MapContainer>
    </div>
  );
}

export default Map;