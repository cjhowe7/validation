import { validate as isemail } from "isemail";
import { DateTime } from "luxon";
import {
  always,
  assoc,
  both,
  complement,
  compose,
  curry,
  either,
  equals,
  flip,
  gte,
  ifElse,
  invoker,
  is,
  isEmpty,
  isNil,
  length,
  lensProp,
  lte,
  over,
  prop,
  toPairs,
  trim,
  type,
  unary
} from "ramda";
import { flatMapSuccess, mapError, mapSuccess } from "./result";

export const validIf = curry((fn, message, result) =>
  flatMapSuccess(ifElse(fn, success, always(error({ message }))), result)
);

export const transformValue = mapSuccess;

export const replaceErrorMessage = curry((message, result) =>
  mapError(assoc("message", message), result)
);

const dateTimeFromISO = curry(flip(DateTime.fromISO));
const dateTimeFromJS = unary(DateTime.fromJSDate);
const formatDateTime = invoker(1, "toFormat");
const dateTimeToJS = invoker(0, "toJSDate");

const validIfDateTime = validIf(
  compose(
    isNil,
    prop("invalidReason")
  )
);

const validIfDateTimeType = validIf(either(is(Date), is(String)));

const toDateTime = transformValue(
  ifElse(is(Date), dateTimeFromJS, dateTimeFromISO({ setZone: true }))
);

export const date = compose(
  transformValue(formatDateTime("yyyy-MM-dd")),
  validIfDateTime("must be a valid date"),
  toDateTime,
  validIfDateTimeType("must be a valid date type")
);

export const timestamp = compose(
  dateTimeToJS,
  validIfDateTime("must be a valid timestamp"),
  toDateTime,
  validIfDateTimeType("must be a valid timestamp type")
);

const validIfNotNaN = validIf(complement(isNaN));

export const int = compose(
  validIfNotNaN("must be a valid integer"),
  curry(flip(parseInt))(10)
);

export const float = compose(
  validIfNotNaN("must be a valid decimal"),
  parseFloat
);

export const min = curry((minValue, result) =>
  validIf(gte(minValue), `must be at least ${minValue}`, result)
);

export const max = curry((maxValue, result) =>
  validIf(lte(maxValue), `must be at most ${maxValue}`, result)
);

export const range = curry((minValue, maxValue, result) =>
  validIf(
    both(gte(minValue), lte(maxValue)),
    `must be between ${minValue} and ${maxValue}`,
    result
  )
);

export const string = validIf(is(String), "must be a string");

export const minLength = curry((minLength, result) =>
  validIf(
    compose(
      gte(minLength),
      length
    ),
    `must be at least length ${minLength}`,
    result
  )
);

export const maxLength = curry((maxLength, result) =>
  validIf(
    compose(
      lte(maxLength),
      length
    ),
    `must be at most length ${maxLength}`,
    result
  )
);

export const lengthRange = curry((minLength, maxLength, result) =>
  validIf(
    compose(
      both(gte(minLength), lte(maxLength)),
      length
    ),
    `must be at least length ${minLength} and at most length ${maxLength}`,
    result
  )
);

export const notBlank = validIf(
  compose(
    complement(isEmpty),
    trim
  ),
  "must not be blank"
);

export const trim = transformValue(trim);

export const email = validIf(isemail, "must be a valid email");

export const object = validIf(
  compose(
    equals("Object"),
    type
  )
);

export const required = validIf(complement(isNil), "must be provided");

const addFieldNameToError = fieldName =>
  over(lensProp("field"), append(fieldName));

const validateField = ([key, validationFn]) =>
  flatMapSuccess(rootObject =>
    compose(
      mapError(addFieldNameToError),
      mapSuccess(always(rootObject)),
      validationFn,
      prop(key)
    )(rootObject)
  );

export const fields = curry((keyValidations, object) =>
  reduceRight(
    uncurryN(2, validateField),
    validationSuccess(object),
    toPairs(keyValidations)
  )
);
