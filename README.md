# Autonomy
[![npm status](http://img.shields.io/npm/v/autonomy.svg)](https://www.npmjs.org/package/autonomy)
[![build status](https://secure.travis-ci.org/clux/autonomy.svg)](http://travis-ci.org/clux/autonomy)
[![dependency status](https://david-dm.org/clux/autonomy.svg)](https://david-dm.org/clux/autonomy)
[![coverage status](http://img.shields.io/coveralls/clux/autonomy.svg)](https://coveralls.io/r/clux/autonomy)

Autonomy is a lightweight functional helper library. It is meant to complement an ES5 style with curried helpers, math helpers, curried accessors and higher order looping constructs.

These library is partly inspired by Haskell's [Prelude](http://www.haskell.org/ghc/docs/latest/html/libraries/base/Prelude.html), but its exports are optimized for JavaScript semantics and performance. It does not try to make JavaScript into something it's not.

## Usage
Attach it to the short variable of choice:

```js
var $ = require('autonomy');
```

and get functional:

```js
$.id(x) === x;
$.noop(x) === undefined;

[1,3,2].map($.constant(5)); // [5, 5, 5]

[1,2,3,4,3].filter($.elem([1,3])); // [ 1, 3, 3 ]

[1,3,5,-1].some($.notElem([1,2,3,4,5])); // true

$.gcd(10, 15); // 5

[1,2,3,4,5,6].filter($.even); // [ 2, 4, 6 ]

$.range(5); // [ 1, 2, 3, 4, 5 ]

$.zip3($.range(5), [1,2], [3,2,5]); // [ [ 1, 1, 3 ], [ 2, 2, 2 ] ]
$.zipWith2($.gcd, [5, 10, 15], $.range(5)); // [ 1, 2, 3 ]
```

Read the read the [API](https://github.com/clux/autonomy/blob/master/api.md).

*This modules makes up the core part of the larger utility library*: [interlude](https://github.com/clux/interlude). If you find yourself co-using `operators` or `subset`, you could use `interlude` instead (there's also more documentation included for interlude).

## Installation

```bash
$ npm install autonomy
```

## License
MIT-Licensed. See LICENSE file for details.
