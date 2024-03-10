import dateFormatterMixin from "../src/util/dateFormatterMixin";

describe("getDatePartOfDateAsString", () => {
  test("returns date part as string", () => {
    let date = new Date("2020-01-01T00:00:00.000Z");
    expect(dateFormatterMixin.methods.getDatePartOfDateAsString(date)).toBe("01.01.2020");
  });

  test("returns empty string when invalid input", () => {
    let date = new Date("2020-01-01T000Z");
    expect(dateFormatterMixin.methods.getDatePartOfDateAsString(date)).toBe("");
  });
});
