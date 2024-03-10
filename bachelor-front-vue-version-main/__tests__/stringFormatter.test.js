import { stringFormatter } from "../src/util/stringFormatter";

describe("replaceDotsWithCommas", () => {
  test("replaces a string with dots to commas", () => {
    let str = "1.1";
    expect(stringFormatter.replaceDotsWithCommas(str)).toBe("1,1");
  });

  test("returns original string if no dots in it", () => {
    let str = "1,1";
    expect(stringFormatter.replaceDotsWithCommas(str)).toBe("1,1");
  });

  test("replaces if input is a number", () => {
    let num = 1.1;
    expect(stringFormatter.replaceDotsWithCommas(num)).toBe("1,1");
  });

  test("empty string", () => {
    let str = "";
    expect(stringFormatter.replaceDotsWithCommas(str)).toBe("");
  });

  test("null results in an error", () => {
    let str = null;
    expect(() => stringFormatter.replaceDotsWithCommas(str)).toThrow();
  });

  test('replaces underscored string with camelCase', () => {
    let str = 'hello_world';
    expect(stringFormatter.underscoreToCamelCase(str)).toBe('helloWorld');
  });
});