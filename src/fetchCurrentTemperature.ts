import { fetchJSON } from "../include/fetchJSON.js";
import { GeoCoord } from "./fetchGeoCoord.js";

interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}

interface CurrentTemperatureReturn {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
  // TODO
  const searchURL = new URL(`https://api.open-meteo.com/v1/forecast`);
  searchURL.searchParams.append(`latitude`, coords.lat.toString());
  searchURL.searchParams.append(`longitude`, coords.lon.toString());
  searchURL.searchParams.append(`hourly`, `temperature_2m`);
  searchURL.searchParams.append(`temperature_unit`, `fahrenheit`);

  return fetchJSON(searchURL.toString()).then((json: CurrentTemperatureReturn) => {
    return {
      time: json.hourly.time,
      temperature_2m: json.hourly.temperature_2m,
    };
  });
}
