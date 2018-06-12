const expect = require("chai").expect;
const validation = require("..");

exports.makeInvalidTester = (validationFn, errRegex) => (message, value) => {
  it(message, () => {
    const validationError = expect(() => validationFn(value)).to.throw(
      validation.ValidationError,
      errRegex
    );
    validationError.has.property("value", value);
    validationError.has.property("name", "ValidationError");
  });
};

// postProcessor allows values to be prepared for comparison, in the timestamp
// tests for example
exports.makeValidTester = (validationFn, postProcessor = val => val) => (
  message,
  value,
  expectedValue
) => {
  it(message, () => {
    let resultValue;
    expect(
      () => (resultValue = postProcessor(validationFn(value)))
    ).to.not.throw();
    expect(resultValue).to.equal(postProcessor(expectedValue));
  });
};
