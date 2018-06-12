const utils = require("./utils");
const validation = require("..");

describe("Date", () => {
  describe("bad inputs fail validation", () => {
    const testInvalidDate = utils.makeInvalidTester(
      validation.date,
      /is not a valid date/
    );

    testInvalidDate("obviously invalid date", "obvious-failure");
    testInvalidDate("invalid date not in ISO 8601", "01 Jan 1971");
    testInvalidDate("invalid date in wrong order", "12-22-2018");
    testInvalidDate("invalid date with negative year", "-1-01-01");
    testInvalidDate("invalid date with two digit year", "93-01-01");
    testInvalidDate("invalid date with invalid month", "2018-13-01");
    testInvalidDate("invalid date with invalid day for month", "2018-02-29");
    testInvalidDate("invalid date with very large year", "10000000-01-01");
  });

  describe("good inputs pass validation", () => {
    const testValidDate = utils.makeValidTester(validation.date);

    testValidDate("actual date value", new Date(2018, 11, 21), "2018-12-21");
    testValidDate(
      "valid date with leap year day in february",
      "2016-02-29",
      "2016-02-29"
    );
    testValidDate(
      "correct date at midnight with -12:00 time offset",
      "2016-02-29T00:00:00-12:00",
      "2016-02-29"
    );
    testValidDate(
      "correct date at midnight with +12:00 time offset",
      "2016-02-29T00:00:00-12:00",
      "2016-02-29"
    );
    testValidDate(
      "correct date at 23:59:59 with +12:00 time offset",
      "2016-02-29T23:59:59+12:00",
      "2016-02-29"
    );
    testValidDate(
      "correct date with ISO time zone at 23:59:59",
      "2016-02-29T23:59:59Z",
      "2016-02-29"
    );
    testValidDate(
      "correct date with ISO time zone at midnight",
      "2016-02-29T00:00:00.000Z",
      "2016-02-29"
    );
    testValidDate(
      "correct date with fractional seconds",
      "1885-04-30T00:00:00.000Z",
      "1885-04-30"
    );
    testValidDate(
      "date with zero day rounds to first day",
      "2018-01-00",
      "2018-01-01"
    );
    testValidDate(
      "date with zero month rounds to January",
      "2018-00-01",
      "2018-01-01"
    );
    testValidDate("date with small year", "0093-01-01", "0093-01-01");
    testValidDate("date with large year", "9999-01-01", "9999-01-01");
  });
});
