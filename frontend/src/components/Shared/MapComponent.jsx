// import React, { useEffect, useState } from "react";

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

const MapComponent = ({ places, type }) => {
    
    console.log(places);

    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: 'YOUR_API_KEY',
    //   })

    // const defaultCenter = {
    //     lat: places[0].location.lat,
    //     lng: places[0].location.lng,
    // };
    // const mapStyles = {
    //     height: "70vh",
    //     width: "100%",
    // };

    const handleMarkerClick = (place) => {
       //TODO: complete this method
    };

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;
