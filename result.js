import { assoc, compose, objOf, prop, unless, when } from "ramda";

export const error = compose(
  assoc("isError", true),
  objOf("value")
);

export const success = compose(
  assoc("isError", false),
  objOf("value")
);

export const isError = prop("isError");
export const unwrapResult = prop("value");

export const flatMapSuccess = curry((fn, result) =>
  unless(
    isError,
    compose(
      fn,
      unwrapResult
    ),
    result
  )
);

export const mapSuccess = curry((fn, result) =>
  flatMapSuccess(
    compose(
      success,
      fn
    ),
    result
  )
);

export const flatMapError = curry((fn, result) =>
  when(
    isError,
    compose(
      fn,
      unwrapResult
    ),
    result
  )
);

export const mapError = curry((fn, result) =>
  flatMapError(
    compose(
      error,
      fn
    ),
    result
  )
);
