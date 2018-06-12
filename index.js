const { validate: isemail } = require("isemail");
const { DateTime } = require("luxon");
const R = require("ramda");

// re-export compose, since you *need* it to use this library
exports.compose = R.compose;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }

  fieldName(field) {
    this.field = field;
    return this;
  }

  fieldValue(value) {
    this.value = value;
    return this;
  }
}

exports.ValidationError = ValidationError;

exports.date = dateString => {
  const dateTime = DateTime.fromISO(dateString, {
    setZone: true
  });

  if (dateTime.invalidReason != null) {
    throw new ValidationError(
      `is not a valid date: ${dateTime.invalidReason}`
    ).fieldValue(dateString);
  } else {
    return dateTime.toFormat("yyyy-MM-dd");
  }
};

exports.timestamp = timestampString => {
  const dateTime = DateTime.fromISO(timestampString, {
    setZone: true
  });

  if (dateTime.invalidReason != null) {
    throw new ValidationError(
      `is not a valid timestamp: ${dateTime.invalidReason}`
    ).fieldValue(timestampString);
  } else {
    return dateTime.toJSDate();
  }
};

exports.int = string => {
  const value = parseInt(string, 10);
  if (isNaN(value)) {
    throw new ValidationError("is not a valid integer").fieldValue(string);
  } else {
    return value;
  }
};

exports.float = string => {
  const value = parseFloat(string);
  if (isNaN(value)) {
    throw new ValidationError("is not a valid decimal").fieldValue(string);
  } else {
    return value;
  }
};

// inclusive
exports.min = min => value => {
  if (min > value) {
    throw new ValidationError("is too small").fieldValue(value);
  } else {
    return value;
  }
};

// inclusive
exports.max = max => value => {
  if (value > max) {
    throw new ValidationError("is too large").fieldValue(value);
  } else {
    return value;
  }
};

// inclusive
exports.range = (min, max) =>
  R.compose(
    exports.max(max),
    exports.min(min)
  );

// inclusive
exports.minLength = minLength => value => {
  if (minLength > value.length) {
    throw new ValidationError("is too short").fieldValue(value);
  } else {
    return value;
  }
};

// inclusive
exports.maxLength = maxLength => value => {
  if (value.length > maxLength) {
    throw new ValidationError("is too long").fieldValue(value);
  } else {
    return value;
  }
};

// inclusive
exports.lengthRange = (min, max) =>
  R.compose(
    exports.maxLength(max),
    exports.minLength(min)
  );

exports.string = value => {
  if (typeof value !== "string") {
    throw new ValidationError("is not a string").fieldValue(value);
  } else {
    return value;
  }
};

exports.notBlank = string => {
  if (string.trim() === "") {
    throw new ValidationError("is blank").fieldValue(string);
  } else {
    return string;
  }
};

exports.trim = string => string.trim();

exports.email = string => {
  if (!isemail(string)) {
    throw new ValidationError("is not a valid email").fieldValue(string);
  } else {
    return string;
  }
};

exports.object = value => {
  if (typeof value !== "object") {
    throw new ValidationError("is not an object").fieldValue(value);
  } else {
    return value;
  }
};

exports.required = value => {
  if (value == null) {
    throw new ValidationError("is required").fieldValue(value);
  } else {
    return value;
  }
};

exports.fields = (
  requiredKeyValidations,
  optionalKeyValidations = {}
) => object =>
  R.merge(
    R.compose(
      R.fromPairs,
      R.map(([key, validate]) => {
        try {
          return [key, validate(object[key])];
        } catch (err) {
          err instanceof ValidationError && err.fieldName(key);
          throw err;
        }
      }),
      R.filter(([key]) => object[key] != null),
      R.toPairs
    )(optionalKeyValidations),
    R.mapObjIndexed((validate, key) => {
      if (object[key] == null) {
        throw new ValidationError("is required").fieldName(key);
      } else {
        try {
          return validate(object[key]);
        } catch (err) {
          err instanceof ValidationError && err.fieldName(key);
          throw err;
        }
      }
    }, requiredKeyValidations)
  );
