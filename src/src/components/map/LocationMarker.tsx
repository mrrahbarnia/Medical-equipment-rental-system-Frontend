import { useMapEvent } from "react-leaflet";
import L, { LeafletMouseEvent } from "leaflet";

const LocationMarker = ({setSelectedLocation}: {setSelectedLocation: (latlng: L.LatLngExpression) => void}) => {
    useMapEvent("click", (e: LeafletMouseEvent) => {
        setSelectedLocation(e.latlng)
    })

    return null;
}

export default LocationMarker;