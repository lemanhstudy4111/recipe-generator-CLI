import assert from "assert";
import { fetchUniversities } from "./fetchUniversities.js";

describe("fetchUniversities", () => {
  it("follows type specification", () => {
    const promise = fetchUniversities("University of Massachusetts at Amherst");

    return promise.then(result => {
      assert(Array.isArray(result)); // Assert the result in an array
      assert(result.every(x => typeof x === "string")); // Assert each element in the array is a string
    });
  });
  it("fetches correct universities", () => {
    const promise1 = fetchUniversities("Montana");

    return promise1.then(result => {
      assert(result.length === 8);
      assert(result[0] === "Western Montana College");
      assert(result[7] === "Montana Tech");
    });
  });
});
