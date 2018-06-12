# `@cjhowe7/validation`: legit functional validation

[![CircleCI](https://circleci.com/gh/cjhowe7/validation/tree/master.svg?style=svg)](https://circleci.com/gh/cjhowe7/validation/tree/master)
[![codecov](https://codecov.io/gh/cjhowe7/validation/branch/master/graph/badge.svg)](https://codecov.io/gh/cjhowe7/validation)

> Isomorphic validation using function composition

## Introduction

This is a package for validating input in requests using functional composition.
It runs in both browsers and Node.js, and is well-suited for sharing validations
between both of these environments.

Install it with `yarn add @cjhowe7/validation` or, if you use npm, with
`npm i --save @cjhowe7/validation`.

## Development

First, clone the repository and install the dependencies with `yarn`. Then you
can run the Mocha tests in watch mode with `yarn test -w`.
