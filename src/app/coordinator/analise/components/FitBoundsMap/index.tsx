import { LatLngBounds } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const FitBoundsComponent = ({ geojson }: { geojson: any }) => {
  const map = useMap();

  useEffect(() => {
    if (geojson.features.length > 0) {
      const bounds = new LatLngBounds([]);

      geojson.features.forEach((feature: any) => {
        const coordinates = feature.geometry.coordinates[0];
        coordinates.forEach((latlng: [number, number]) => {
          const [lng, lat] = latlng;
          bounds.extend([lat, lng]);
        });
      });

      map.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 16,
      });
    }
  }, [geojson, map]);

  return null;
};

export default FitBoundsComponent;
