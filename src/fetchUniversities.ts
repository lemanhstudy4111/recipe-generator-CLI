import { fetchJSON } from "../include/fetchJSON.js";
import { makeSearchURL } from "./universityWeather.js";

interface UniNamesReturn {
  "state-province": null | string;
  domains: string[];
  name: string;
  country: string;
  web_pages: string[];
  alpha_two_code: string;
}

export function fetchUniversities(query: string): Promise<string[]> {
  // TODO
  const searchURL = makeSearchURL(query, `http://universities.hipolabs.com/search`, "name");
  return fetchJSON(searchURL).then((json: UniNamesReturn[]) => {
    const uniNames: string[] = [];
    if (json.length === 0) return uniNames;
    json.forEach((obj: UniNamesReturn) => uniNames.push(obj.name));
    return uniNames;
  });
}
