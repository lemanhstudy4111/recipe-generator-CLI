import { fetchJSON } from "../include/fetchJSON.js";
import { makeSearchURL } from "./universityWeather.js";

export interface GeoCoord {
  lat: number;
  lon: number;
}

interface GeoCoordReturn {
  place_id: number;
  licence: string;
  powered_by: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

export function fetchGeoCoord(query: string): Promise<GeoCoord> {
  //   // TODO
  const searchURL = makeSearchURL(query, `https://geocode.maps.co/search`, `q`);
  return fetchJSON(searchURL).then((json: GeoCoordReturn[]) => {
    if (Array.isArray(json) && json.length > 0) {
      const lat = Number.parseFloat(json[0].lat);
      const lon = Number.parseFloat(json[0].lon);
      return {
        lat: lat,
        lon: lon,
      };
    } else throw new Error(`No results found for query.`);
  });
}
