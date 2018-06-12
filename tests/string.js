const utils = require("./utils");
const validation = require("..");

describe("String", () => {
  describe("bad inputs fail validation", () => {
    const testInvalidString = utils.makeInvalidTester(
      validation.string,
      /is not a string/
    );

    testInvalidString("integer value", 12);
    testInvalidString("date value", new Date());
    testInvalidString("null value", null);
    testInvalidString("undefined value");
  });

  describe("good inputs pass validation", () => {
    const testValidString = utils.makeValidTester(validation.string);

    testValidString("basic string", "arst", "arst");
  });

  describe("minimum length constraint", () => {
    const atLeast1Character = validation.compose(
      validation.minLength(1),
      validation.string
    );
    const testAtLeast1Character = utils.makeValidTester(atLeast1Character);
    const testNotAtLeast1Character = utils.makeInvalidTester(
      atLeast1Character,
      /is too short/
    );

    testNotAtLeast1Character(
      "0 character string is not at least 1 character",
      ""
    );
    testAtLeast1Character(
      "1 character string is at least 1 character",
      "a",
      "a"
    );
    testAtLeast1Character(
      "2 character string is at least 1 character",
      "ab",
      "ab"
    );
  });

  describe("maximum length constraint", () => {
    const atMost1Character = validation.compose(
      validation.maxLength(1),
      validation.string
    );
    const testAtMost1Character = utils.makeValidTester(atMost1Character);
    const testNotAtMost1Character = utils.makeInvalidTester(
      atMost1Character,
      /is too long/
    );

    testAtMost1Character("0 character string is at most 1 character", "", "");
    testAtMost1Character("1 character string is at most 1 character", "a", "a");
    testNotAtMost1Character(
      "2 character string is not at most 1 character",
      "ab",
      "ab"
    );
  });

  describe("length range constraint", () => {
    const between5And10Characters = validation.compose(
      validation.lengthRange(5, 10),
      validation.string
    );
    const testBetween5And10Characters = utils.makeValidTester(
      between5And10Characters
    );
    const testUnder5Characters = utils.makeInvalidTester(
      between5And10Characters,
      /is too short/
    );
    const testOver10Characters = utils.makeInvalidTester(
      between5And10Characters,
      /is too long/
    );

    testBetween5And10Characters(
      "5 character string is between 5 and 10 characters",
      "arsta",
      "arsta"
    );

    testBetween5And10Characters(
      "10 character string is between 5 and 10 characters",
      "arsta arst",
      "arsta arst"
    );

    testOver10Characters(
      "11 character string is over 10 characters",
      "arstarstars"
    );

    testUnder5Characters("4 character string is under 5 characters", "arst");
  });

  describe("not blank constraint", () => {
    const notBlankString = validation.compose(
      validation.notBlank,
      validation.string
    );
    const testValidNotBlankString = utils.makeValidTester(notBlankString);
    const testInvalidBlankString = utils.makeInvalidTester(
      notBlankString,
      /is blank/
    );

    testValidNotBlankString("some character", "a", "a");
    testValidNotBlankString("character prefixed with blanks", "  a", "  a");

    testInvalidBlankString("empty string", "");
    testInvalidBlankString("spaces string", "   ");
    testInvalidBlankString("tab string", "\t");
  });

  describe("trim modifier", () => {
    const testValidString = utils.makeValidTester(
      validation.compose(
        validation.trim,
        validation.string
      )
    );

    testValidString(
      "trims whitespace on both sides of string",
      "  arst  ",
      "arst"
    );
  });

  describe("email constraint", () => {
    const emailString = validation.compose(
      validation.email,
      validation.string
    );
    const testValidEmailString = utils.makeValidTester(emailString);
    const testInvalidEmailString = utils.makeInvalidTester(
      emailString,
      /is not a valid email/
    );

    testValidEmailString("short email", "a@b.c", "a@b.c");
    testValidEmailString(
      "long domain",
      "test@test.sample.test.com",
      "test@test.sample.test.com"
    );
    // test that no TLD validation takes place
    testValidEmailString(
      "invalid tld",
      "test@test.karstarst",
      "test@test.karstarst"
    );
    testValidEmailString("io email", "a@io", "a@io");
    testValidEmailString("numbers", "1@2", "1@2");

    testInvalidEmailString("no @", "arstarst");
    testInvalidEmailString("no domain", "a@");
    testInvalidEmailString("no user", "@gmail.com");
    testInvalidEmailString("only @", "@");
  });
});
