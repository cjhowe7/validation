const utils = require("./utils");
const validation = require("..");

describe("Timestamp", () => {
  describe("bad inputs fail validation", () => {
    const testInvalidTimestamp = utils.makeInvalidTester(
      validation.timestamp,
      /is not a valid timestamp/
    );

    testInvalidTimestamp("obviously bad timestamp", "failing");
    testInvalidTimestamp("bad time value", "2018-01-01T00:00:124Z");
    testInvalidTimestamp(
      "bad millisecond value",
      "2018-01-01T00:00:12.4000000000000000Z"
    );
    testInvalidTimestamp("not an ISO 8601 timestamp", "2018-01-1t00:00:00");
    testInvalidTimestamp("bad time offset", "2018-01-1T00:00:00+25:00");
  });

  describe("good inputs pass validation", () => {
    const testValidTimestamp = utils.makeValidTester(
      validation.timestamp,
      date => date.getTime()
    );

    const dateValue = new Date(2018, 12, 21, 12, 0, 0);
    testValidTimestamp("actual timestamp value", dateValue, dateValue);

    testValidTimestamp(
      "timestamp without time",
      "2018-01-01",
      new Date(2018, 0, 1, 0, 0, 0, 0)
    );

    testValidTimestamp(
      "timestamp with local time",
      "2018-01-01T13:45:15",
      new Date(2018, 0, 1, 13, 45, 15, 0)
    );

    const validUTCTimestamp = new Date(2018, 0, 1, 13, 45, 15, 0);
    // make sure to set the correct UTC hours regardless of test env timezone
    validUTCTimestamp.setUTCHours(13);
    testValidTimestamp(
      "timestamp with UTC time",
      "2018-01-01T13:45:15Z",
      validUTCTimestamp
    );

    const validOffsetTimestamp = new Date(2018, 0, 1, 0, 0, 0, 0);
    // make sure to set the correct UTC hours regardless of test env timezone
    validOffsetTimestamp.setUTCHours(12);
    testValidTimestamp(
      "valid timezone offset",
      "2018-01-01T16:00:00+04:00",
      validOffsetTimestamp
    );
  });
});
