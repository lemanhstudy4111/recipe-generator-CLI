import { fetchUniversities } from "../src/fetchUniversities.js";
import { fetchGeoCoord } from "../src/fetchGeoCoord.js";
import { fetchCurrentTemperature } from "../src/fetchCurrentTemperature.js";
import { URL } from "url";

export interface GeoCoords {
  lat: number;
  lon: number;
}

export interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}
interface AverageTemperatureResults {
  totalAverage: number;
  [key: string]: number;
}

export function makeSearchURL(query: string, url: string, param: string): string {
  // Construct a new URL object using the resource URL
  const searchURL = new URL(url);

  // Access the searchParams field of the constructed url
  // The field holds an instance of the URLSearchParams
  // Add a new "q" parameter with the value of the functions input
  searchURL.searchParams.append(param, query);

  return searchURL.toString(); // Return the resulting complete URL
}
export function fetchUniversityWeather(
  universityQuery: string,
  transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
  // TODO
  //fetch university names
  //fetch each geo coords
  //fetch current temperature at the geo coord

  //university names
  async function fetchUWHelper(): Promise<AverageTemperatureResults> {
    const uniNames = await fetchUniversities(universityQuery);
    if (uniNames.length === 0) {
      throw new Error(`No result found for query. (university names)`);
    }
    const res: AverageTemperatureResults = {
      totalAverage: 0,
    };
    let total = 0;
    let cnt = 0;
    for (let i = 0; i < uniNames.length; ++i) {
      const name: string = transformName !== undefined ? transformName(uniNames[i]) : uniNames[i];
      const geoCoords = await fetchGeoCoord(name);
      const temperatureInd = await fetchCurrentTemperature(geoCoords);
      const avgTempInd =
        temperatureInd.temperature_2m.reduce((acc, e) => acc + e, 0) / temperatureInd.temperature_2m.length;
      res[name] = avgTempInd;
      total += avgTempInd;
      ++cnt;
    }
    if (cnt > 0) res.totalAverage = total / cnt;
    else res.totalAverage = 0;
    return res;
  }
  return fetchUWHelper();
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
  // TODO
  const umassQuery = "University of Massachusetts";
  const transformName = (name: string) => {
    // Replace `at Amherst` with `Amherst`
    return name.replace(" at ", " ");
  };
  return fetchUniversityWeather(umassQuery, transformName);
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return fetchUniversityWeather(`University of California`);
}
