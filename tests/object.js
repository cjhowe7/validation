const expect = require("chai").expect;
const utils = require("./utils");
const validation = require("..");

describe("Object", () => {
  describe("bad inputs fail validation", () => {
    const testInvalidObject = utils.makeInvalidTester(
      validation.object,
      /is not an object/
    );

    testInvalidObject("number type", 12);
    testInvalidObject("string type", "failing");
    testInvalidObject("function type", () => {});
  });

  describe("good inputs pass validation", () => {
    const testValidObject = utils.makeValidTester(validation.object, obj =>
      JSON.stringify(obj)
    );

    testValidObject("empty object", {}, {});
    testValidObject("single field value", { arst: 1 }, { arst: 1 });
    testValidObject("weird field name", { [`--`]: "test" }, { [`--`]: "test" });

    const date = new Date();
    testValidObject("date object", date, date);
  });

  describe("required constraint", () => {
    const requiredObject = validation.compose(
      validation.object,
      validation.required
    );
    const testValidRequiredObject = utils.makeValidTester(requiredObject, obj =>
      JSON.stringify(obj)
    );
    const testInvalidRequiredObject = utils.makeInvalidTester(
      requiredObject,
      /is required/
    );

    testValidRequiredObject("any object", {}, {});

    testInvalidRequiredObject("undefined", undefined);
    testInvalidRequiredObject("null", null);
  });

  describe("field constraints", () => {
    const validFields = validation.compose(
      validation.fields(
        { a: validation.int, b: validation.string },
        { c: validation.date }
      )
    );

    it("checks for required fields", () => {
      const noFieldErrors = expect(() => validFields({})).to.throw(
        validation.ValidationError,
        /is required/
      );
      noFieldErrors.with.property("field", "a");
      noFieldErrors.not.to.have.property("value");

      const oneFieldErrors = expect(() => validFields({ a: 12 })).to.throw(
        validation.ValidationError,
        /is required/
      );
      oneFieldErrors.with.property("field", "b");
      oneFieldErrors.not.to.have.property("value");
    });

    it("checks required fields for validity", () => {
      const invalidFieldError = expect(() =>
        validFields({ a: 12, b: 13 })
      ).to.throw(validation.ValidationError, /is not a string/);
      invalidFieldError.with.property("field", "b");
      invalidFieldError.with.property("value", 13);
    });

    it("checks optional fields for validity", () => {
      const invalidOptionalFieldError = expect(() =>
        validFields({ a: 12, b: "arst", c: "fail" })
      ).to.throw(validation.ValidationError, /is not a valid date/);
      invalidOptionalFieldError.with.property("field", "c");
      invalidOptionalFieldError.with.property("value", "fail");
    });

    it("works with a valid object", () => {
      let resultObject;

      expect(() => {
        resultObject = validFields({
          a: 12,
          b: "asrt",
          c: new Date(2018, 9, 22)
        });
      }).to.not.throw();

      expect(resultObject).to.have.property("a", 12);
      expect(resultObject).to.have.property("b", "asrt");
      expect(resultObject).to.have.property("c", "2018-10-22");
    });
  });
});
