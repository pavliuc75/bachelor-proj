import { getRandomString } from "../src/util/stringGenerator";

describe("getRandomString", () => {
  test("length > 0", () => {
    expect(getRandomString(3).length).toBe(3);
  });

  test("length = 0", () => {
    expect(getRandomString(0).length).toBe(0);
  });

  test("length < 0 does not work", () => {
    expect(() => getRandomString(-1)).toThrow();
  });
});