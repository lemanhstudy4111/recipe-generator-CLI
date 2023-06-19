import assert from "assert";
import { fetchUCalWeather, fetchUMassWeather } from "./universityWeather.js";

describe("fetchUCalWeather", () => {
  it("follows type specification", () => {
    const promise = fetchUCalWeather();

    const result_1 = promise;
    assert(typeof result_1 === "object");
    assert(Object.keys(result_1).every(x => typeof x === "string"));
    assert(Object.values(result_1).every(x_1 => typeof x_1 === "number"));
  });
});

describe("fetchUMassWeather", () => {
  it("follows type specification", () => {
    const promise = fetchUMassWeather();

    const result_1 = promise;
    assert(typeof result_1 === "object");
    assert(Object.keys(result_1).every(x => typeof x === "string"));
    assert(Object.values(result_1).every(x_1 => typeof x_1 === "number"));
  });
});
