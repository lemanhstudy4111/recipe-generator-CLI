import assert from "assert";
import { fetchGeoCoord } from "./fetchGeoCoord.js";

function comparingNumbers(actual: number, expected: number, error = 1) {
  return expect(Math.abs(actual - expected)).toBeLessThanOrEqual(error);
}

describe("fetchGeoCoord", () => {
  it("follows type specification", () => {
    const promise = fetchGeoCoord("University of Massachusetts Amherst");

    return promise.then(result => {
      assert(typeof result === "object"); //  Assert the result is an object
      assert(typeof result.lon === "number"); // Assert that the lon value is a number
      assert(typeof result.lat === "number"); // Assert that the lat value is a number
      assert(Object.keys(result).length === 2); // Assert there are only two keys in the object
    });
  });
  it("returns coordinates for 'New York City'", () => {
    const promise = fetchGeoCoord("New York City");

    return promise.then(result => {
      comparingNumbers(result.lat, 40.7128, 0.04); // Assert that the lat value is 40.7128
      comparingNumbers(result.lon, -74.006, 0.04); // Assert that the lon value is -74.0060
    });
  });
});
