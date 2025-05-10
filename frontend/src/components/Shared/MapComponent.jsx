// import React, { useEffect, useState } from "react";

import { GoogleMap, LoadScript, Marker, useJsApiLoader } from "@react-google-maps/api";

const MapComponent = ({ places, type }) => {
    console.log(places);

    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: 'YOUR_API_KEY',
    //   })

    const defaultCenter = {
        lat: places[0].location.lat,
        lng: places[0].location.lng,
    };
    const mapStyles = {
        height: "70vh",
        width: "100%",
    };
    const handleMarkerClick = (place) => {
        // alert(`Hotel: ${place.name}`);
        // window.open(`https://www.google.com/search?q=${encodeURIComponent(place.name)}`, '_blank');
        if (type === "hotels") {
            window.open(
                `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
                    place.name + " bangladesh"
                )}`,
                "_blank"
            );
        } else {
            window.open(
                `https://www.google.com/search?q=${encodeURIComponent(
                    place.name
                )}`,
                "_blank"
            );
        }
    };
    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_TEST}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={14}
                center={defaultCenter}
            >
                {places.map((place, index) => {
                    console.log(place);
                    return (
                        <Marker
                            key={index}
                            position={{
                                lat: place.location.lat,
                                lng: place.location.lng,
                            }}
                            onClick={() => handleMarkerClick(place)}
                        />
                    );
                })}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
