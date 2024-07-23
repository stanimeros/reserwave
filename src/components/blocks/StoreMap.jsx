import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "../../assets/leaflet/leaflet.css"

function StoreMap({lat,lon, title,street}) {
  const storeLocation = [lat, lon];

  var storeIcon = L.icon({
    iconUrl: '/images/icons/location-dot-solid.svg',
    iconSize:     [24, 50],
    iconAnchor:   [24, 50],
    popupAnchor:  [-12, -55]
  });

  return (
    <div className='store-map-block'>
      <MapContainer center={storeLocation} zoom={16} style={{ width: '100%'}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker icon={storeIcon} position={storeLocation}>
          <Popup>
            {title}
          </Popup>
        </Marker>
      </MapContainer>
      <a target="_blank" href={"https://www.google.com/maps/search/?api=1&query="+street} className='street-info card'>{street}</a>
    </div>
  )
}

export default StoreMap;