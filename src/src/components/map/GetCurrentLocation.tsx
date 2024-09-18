import { useMap } from "react-leaflet";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";
import "leaflet.locatecontrol";
import { useEffect } from "react";

const GetCurrentLocation = () => {
    const map = useMap();

    useEffect(() => {
        map.locate({
            setView: true,
            maxZoom: 16,
            enableHighAccuracy: true
        })
    
        map.on("locationerror", (e) => {
            console.error("Location access denied.");
        });
    }, [map])

    return null
}

export default GetCurrentLocation;