# `@cjhowe7/validation`

[![CircleCI](https://circleci.com/gh/cjhowe7/validation/tree/master.svg?style=svg)](https://circleci.com/gh/cjhowe7/validation/tree/master)
[![codecov](https://codecov.io/gh/cjhowe7/validation/branch/master/graph/badge.svg)](https://codecov.io/gh/cjhowe7/validation)

> Legit isomorphic validation using function composition

## Introduction

This is a package for validating input in requests using functional composition.
It runs in both browsers and Node.js, and is well-suited for sharing validations
between both of these environments.

Install it with `yarn add @cjhowe7/validation` or, if you use npm, with
`npm i --save @cjhowe7/validation`.

## Example

```js
const assert = require("assert");
const validation = require("@cjhowe7/validation");

const validateMyObject = validation.compose(
  // validates the fields of the object
  validation.fields(
    // these are the required fields
    {
      // name validates that it is a string with a length between 10 and 22
      // characters (inclusive)
      name: validation.compose(
        validation.lengthRange(
          10,
          22,
          "must be between 10 and 22 characters long"
        ),
        validation.string
      ),
      // email validates that is a string which is a valid email
      // (uses the isemail package)
      email: validation.compose(
        validation.email,
        validation.string
      )
    },
    {
      // validates that age is a positive integer, converting from a string if
      // necessary
      age: validation.compose(
        validation.min(0),
        validation.int
      )
    }
  ),
  validation.object
);

// validating a good value returns the converted value
const me = validateMyObject({
  name: "Christian Howe",
  email: "cjhowe7@pm.me",
  age: "24"
});

assert(me.age === 24);

// invalid objects throw an error
try {
  validateMyObject({ name: "Christian Howe" });
} catch (err) {
  assert(err.message === "is required");
  // ther error contains the field that caused it
  assert(err.field === "email");
}
```

## Date vs Timestamp

**WARNING: READ THIS FIRST**

This library makes the conceptual distinction between a date and a timestamp,
which is one of its primary features. They each refer to a different concept,
**entirely distinct from the Javascript `Date` type**.

A timestamp refers to a _specific point of time_, and takes into account its
timezone. You should use this for things like "the time of the meeting" or "the
time at which Jon posted this comment". This is usually what you would use the
Javascript `Date` type for.

A date refers to a _calendar day_, like Harry's first birthday or Christmas Day
in 2018. These do **not** take into account the time nor the time zone of the
date. If I live in Singapore, and at midnight I say "my birthday is October
10th, 1993", then I don't expect someone in Germany to think that I mean my
birthday is on October the 11th. This is a distinct type in some languages such
as Elixir. I consider the lack of a distinct type for this concept in the
Javascript standard one downside of the language.

## API Documentation

`require("@cjhowe7/validation")` returns a bunch of functions, which are
documented here, along with the `ValidationError` type.

- `ValidationError` is a type that is thrown when a validation fails. It has a
  few extra fields and methods beyond the standard `Error` type.
  - `field`: the name of the field that failed validation
  - `value`: the value of the field that failed validation
  - `fieldName(field)`: sets the name of the field that failed validation and
    returns `this`
  - `fieldValue(value)`: sets the value of the field that failed validation and
    returns `this`
- `date`: A function that validates that its input is a `Date` or an ISO 8601
  string, which will be parsed into a date. Ignores the timezone if provided.
  Returns the date as a string in the format `YYYY-MM-DD`. Please see above.
- `timestamp`: A function that validates that its input is a `Date` or an ISO
  8601 string, which will be parsed into a timestamp. Always returns a
  Javascript `Date` object when it validates successfully. Please see above.
- `int`: A function that validates that its input parses successfully with
  parseInt, and returns the parsed value.
- `float`: A function that validates that its input parses successfully with
  parseFloat, and returns the parsed value.
- `min(min, message?)`: A curried function that takes a minimum value and an
  optional error message, and returns a validation function. The validation
  function throws a validation error if its input is below the given value, or
  else returns the input value.
- `max(max, message?)`: A curried function that takes a maximum value and an
  optional error message, and returns a validation function. The validation
  function throws a validation error if its input is above the given value, or
  else returns the input value.
- `range(min, max, message?)`: A curried function that takes a minimum and a
  maximum value, along with an optional error message, and returns a validation
  function. The validation function throws a validation error if its input is
  below the given minimum value or above the given maximum value, or else
  returns the input value.
- `string`: A function that validates that its input is a string type, and
  returns the input value.
- `minLength(minLength, message)`: A curried function that takes a minimum
  length and an optional error message, and returns a validation function. The
  validation function throws a validation error if the `length` property of its
  input is below the given minimum, or else returns the input value.
- `maxLength(minLength, message)`: A curried function that takes a maximum
  length and an optional error message, and returns a validation function. The
  validation function throws a validation error if the `length` property of its
  input is above the given maximum, or else returns the input value.
- `lengthRange(min, max, message?)`: A curried function that takes a minimum
  length and a maximum length, along with an optional error message, and returns
  a validation function. The validation function throws a validation error if
  the `length` property of its input is below the given minimum or above the
  given maximum, or else returns the input value.
- `notBlank`: A function which checks if the string has any non-blank
  characters. If so, it returns the input string, otherwise it throws a
  validation error.
- `trim`: A function which trims its input string
- `email`: A function which throws an error if its input value is not a valid
  email according to the `isemail` package, or else returns the input value.
- `object`: A function that validates that its input is an object type, and
  returns the input value.
- `required`: A function that throws an error if its input value is null or
  undefined, or else returns its input value.
- `fields(requiredFields, optionalFields)`: A curried function which takes an
  object of required fields and optional fields, and returns a validation
  function that takes an input object. The `requiredFields` object has keys
  representing the required keys in the input object, and values with functions
  that validate the values at those keys. The `optionalFields` object has keys
  representing the optional keys in the input object, and values with functions
  that validate the values at those keys if they exist. The validation function
  will validate its input object against the required and optional fields, and
  return an object where its values are the return values from the validations
  in `requiredFields` and `optionalFields`. If extra fields that are in the
  input object which are not in `optionalFields` or `requiredFields`, they are
  dropped. This function will automatically call the `fieldName` method on any
  validation errors that are thrown.

## Development

First, clone the repository and install the dependencies with `yarn`. Then you
can run the Mocha tests in watch mode with `yarn test -w`.
