const utils = require("./utils");
const validation = require("..");

describe("Int", () => {
  describe("bad inputs fail validation", () => {
    const testInvalidInt = utils.makeInvalidTester(
      validation.int,
      /is not a valid integer/
    );

    testInvalidInt("no numbers", "arstarst");
    testInvalidInt("first character decimal", ".122");
    testInvalidInt("not a number", "NaN");
    testInvalidInt("infinity", "Infinity");
    testInvalidInt("negative infinity", "-Infinity");
  });

  describe("good inputs pass validation", () => {
    const testValidInt = utils.makeValidTester(validation.int);

    testValidInt("small integer", "1", 1);
    testValidInt("big integer", "909180130", 909180130);
    testValidInt("floating point truncates", "123.214", 123);
    testValidInt("leading 0", "02525", 2525);
    testValidInt("parses valid part", "36738636arstarst", 36738636);
  });

  describe("minimum constraint", () => {
    const intAtLeast10 = validation.compose(
      validation.min(10),
      validation.int
    );
    const testIntAtLeast10 = utils.makeValidTester(intAtLeast10);
    const testIntNotAtLeast10 = utils.makeInvalidTester(
      intAtLeast10,
      /is too small/
    );

    testIntAtLeast10("10 is at least 10", "10", 10);
    testIntAtLeast10("11 is at least 10", "11", 11);
    testIntAtLeast10("1111111111 is at least 10", "1111111111", 1111111111);
    testIntNotAtLeast10("9 is not at least 10", "9", 9);
    testIntNotAtLeast10("-9 is not at least 10", "-9", -9);
  });

  describe("maximum constraint", () => {
    const intAtMost10 = validation.compose(
      validation.max(10),
      validation.int
    );
    const testIntAtMost10 = utils.makeValidTester(intAtMost10);
    const testIntNotAtMost10 = utils.makeInvalidTester(
      intAtMost10,
      /is too large/
    );

    testIntAtMost10("10 is at most 10", "10", 10);
    testIntAtMost10("9 is at most 10", "9", 9);
    testIntAtMost10("-9 is at most 10", "-9", -9);
    testIntAtMost10("-999999 is at most 10", "-999999", -999999);
    testIntNotAtMost10("11 is not at most 10", "11", 11);
    testIntNotAtMost10(
      "1111111111 is not at most 10",
      "1111111111",
      1111111111
    );
  });

  describe("range constraint", () => {
    const intBetween10And20 = validation.compose(
      validation.range(10, 20),
      validation.int
    );
    const testIntBetween10And20 = utils.makeValidTester(intBetween10And20);
    const testIntNotBetween10And20 = utils.makeInvalidTester(
      intBetween10And20,
      /is not between 10 and 20/
    );

    testIntBetween10And20("15 is between 10 and 20", "15", 15);
    testIntBetween10And20("10 is between 10 and 20", "10", 10);
    testIntBetween10And20("20 is between 10 and 20", "20", 20);

    testIntNotBetween10And20("21 is not between 10 and 20", "21", 21);
    testIntNotBetween10And20("9 is not between 10 and 20", "9", 9);
  });
});

describe("Float", () => {
  describe("bad inputs fail validation", () => {
    const testInvalidFloat = utils.makeInvalidTester(
      validation.float,
      /is not a valid decimal/
    );

    testInvalidFloat("no numbers", "arstarst");
    testInvalidFloat("not a number", "NaN");
  });

  describe("good inputs pass validation", () => {
    const testValidFloat = utils.makeValidTester(validation.float);

    testValidFloat("small integer", "1", 1.0);
    testValidFloat("big integer", "909180130", 909180130.0);
    testValidFloat("small decimal", "1.0112", 1.0112);
    testValidFloat("negative decimal", "-1.0112", -1.0112);
    testValidFloat("big decimal", "92592.125125", 92592.125125);
    testValidFloat("first character decimal", ".122", 0.122);
    testValidFloat("parses valid part", "12.--", 12.0);
    testValidFloat("exponent", "1.2e5", 1.2e5);
    testValidFloat("negative exponent", "1.2e-5", 1.2e-5);
    testValidFloat("negative decimal with exponent", "-1.2e5", -1.2e5);
    testValidFloat(
      "negative decimal with negative exponent",
      "-1.2e-5",
      -1.2e-5
    );
    testValidFloat("infinity", "Infinity", Infinity);
    testValidFloat("negative infinity", "-Infinity", -Infinity);
  });

  describe("minimum constraint", () => {
    const floatAtLeast10 = validation.compose(
      validation.min(10.0),
      validation.float
    );
    const testFloatAtLeast10 = utils.makeValidTester(floatAtLeast10);
    const testFloatNotAtLeast10 = utils.makeInvalidTester(
      floatAtLeast10,
      /is too small/
    );

    testFloatAtLeast10("10.0 is at least 10.0", "10.0", 10.0);
    testFloatAtLeast10("10.0001 is at least 10", "10.0001", 10.0001);
    testFloatAtLeast10(
      "111111.1111 is at least 10",
      "111111.1111",
      111111.1111
    );
    testFloatAtLeast10("Infinity is at least 10", "Infinity", Infinity);
    testFloatNotAtLeast10("9.9999 is not at least 10", "9.9999", 9.9999);
    testFloatNotAtLeast10("-9.9 is not at least 10", "-9.9", -9.9);
    testFloatNotAtLeast10(
      "-Infinity is not at least 10",
      "-Infinity",
      -Infinity
    );
  });

  describe("maximum constraint", () => {
    const floatAtMost10 = validation.compose(
      validation.max(10.0),
      validation.float
    );
    const testFloatAtMost10 = utils.makeValidTester(floatAtMost10);
    const testFloatNotAtMost10 = utils.makeInvalidTester(
      floatAtMost10,
      /is too large/
    );

    testFloatAtMost10("10.0 is at most 10.0", "10.0", 10.0);
    testFloatAtMost10("9.999999 is at most 10", "9.999999", 9.999999);
    testFloatAtMost10("-9.12 is at most 10", "-9.12", -9.12);
    testFloatAtMost10("-9999.99 is at most 10", "-9999.99", -9999.99);
    testFloatAtMost10("-Infinity is at most 10", "-Infinity", -Infinity);
    testFloatNotAtMost10("10.00001 is not at most 10", "10.00001", 10.00001);
    testFloatNotAtMost10(
      "1111111.111 is not at most 10",
      "1111111.111",
      1111111.111
    );
    testFloatNotAtMost10("Infinity is not at most 10", "Infinity", Infinity);
  });
});
