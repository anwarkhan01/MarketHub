import React, {useState, forwardRef} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import getReadableAddress from "../utils/getReadableAddress";

const CustomZoomControl = () => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  const handleZoomChange = (e) => {
    e.stopPropagation();
    const newZoom = parseInt(e.target.value, 10);
    setZoomLevel(newZoom);
    map.setZoom(newZoom);
  };

  return (
    <div className="absolute bottom-4 left-4 z-[1000] w-40">
      <input
        type="range"
        min="1"
        max="18"
        value={zoomLevel}
        onChange={handleZoomChange}
        className="w-full h-1 bg-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-opacity opacity-70 hover:opacity-100"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>1</span>
        <span>{zoomLevel}</span>
        <span>18</span>
      </div>
    </div>
  );
};

const SearchBox = ({onSelectLocation, setReadableAddress}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (query.trim() === "") return;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await response.json();
    setResults(data);
  };

  const handleSelect = (location) => {
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lon);
    onSelectLocation(lat, lng);
    setResults([]);
    setQuery(location.display_name);
  };

  const stopEventPropagation = (e) => {
    e.stopPropagation();
    // e.preventDefault();
  };
  return (
    <div
      className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl z-[1000]"
      onClick={stopEventPropagation}
    >
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search for a location..."
          value={query}
          onClick={stopEventPropagation}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setReadableAddress(null);
            }}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        )}
      </form>
      <ul className="mt-2 bg-white shadow-lg text-gray-800 rounded-lg max-h-64 overflow-y-auto">
        {results.map((result) => (
          <li
            key={result.place_id}
            onClick={() => handleSelect(result)}
            className="p-3 cursor-pointer hover:bg-gray-100"
          >
            {result.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MapUpdater = ({lat, lng}) => {
  const map = useMap();
  map.setView([lat, lng], 13);
  return null;
};

const LocationMarker = ({onLocationSelect}) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const {lat, lng} = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        Selected Location: <br />
        Latitude: {position[0]}, Longitude: {position[1]}
      </Popup>
    </Marker>
  ) : null;
};

const MapComponent = forwardRef(({onLocationSelect, setShowMap}, ref) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [readableAddress, setReadableAddress] = useState(null);

  const handleLocationSelect = async (lat, lng) => {
    setSelectedLocation({lat, lng});
    await getReadableAddress(lat, lng).then((address) => {
      setReadableAddress(address);
    });
  };

  const handleConfirmLocation = () => {
    onLocationSelect(selectedLocation);
    // console.log("confirmed location:", selectedLocation);
  };
  return (
    // <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div
      className="relative w-full max-w-2xl lg:max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden"
      ref={ref}
    >
      {/* Map Section */}
      <div className="h-[50vh] sm:h-[60vh] lg:h-[70vh]">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
          style={{height: "100%", width: "100%"}}
          zoomControl={false}
          whenCreated={(map) => map.on("click", handleMapClick)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedLocation && (
            <>
              <MapUpdater
                lat={selectedLocation.lat}
                lng={selectedLocation.lng}
              />
              <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                <Popup>
                  Selected Location: <br />
                  Latitude: {selectedLocation.lat}, Longitude:{" "}
                  {selectedLocation.lng}
                </Popup>
              </Marker>
            </>
          )}
          <CustomZoomControl />
          <SearchBox
            onSelectLocation={handleLocationSelect}
            ReadbleAddress={readableAddress}
            setReadableAddress={setReadableAddress}
          />
        </MapContainer>
      </div>

      {/* Action Section */}
      <div className="p-4 bg-gray-100 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div className="flex-1 text-sm text-gray-600 overflow-hidden">
          <span className="font-medium">
            {readableAddress
              ? readableAddress
              : "Click on the map to select a location"}
          </span>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowMap(false)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLocation}
            className="disabled:opacity-70 disabled:cursor-not-allowed bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
            disabled={!selectedLocation}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
});

export default MapComponent;
