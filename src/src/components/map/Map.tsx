import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import GetCurrentLocation from "./GetCurrentLocation";
import LocationMarker from "./LocationMarker";

const MapComponent = ({
    clickable, className, selectedLocation, setSelectedLocation
}: {
    clickable: boolean,
    className: string,
    selectedLocation?: L.LatLngExpression | null,
    setSelectedLocation?: (latlng: L.LatLngExpression) => void
}) => {
    const markerIcon = L.icon({
        iconUrl: "/images/marker.png"
    })
    const centerPoint: L.LatLngExpression = selectedLocation ? selectedLocation : [35.7219, 51.3347] ;
    return (
        <MapContainer
            className={className}
            center={centerPoint}
            zoom={16}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            {selectedLocation && <Marker position={selectedLocation} icon={markerIcon} />}
            {clickable && setSelectedLocation && <LocationMarker setSelectedLocation={setSelectedLocation} />}
            {clickable && <GetCurrentLocation />}

        </MapContainer>
    )
}

export default MapComponent;