# Autonomy
[![npm status](http://img.shields.io/npm/v/autonomy.svg)](https://www.npmjs.org/package/autonomy)
[![build status](https://secure.travis-ci.org/clux/autonomy.svg)](http://travis-ci.org/clux/autonomy)
[![dependency status](https://david-dm.org/clux/autonomy.svg)](https://david-dm.org/clux/autonomy)
[![coverage status](http://img.shields.io/coveralls/clux/autonomy.svg)](https://coveralls.io/r/clux/autonomy)

Autonomy is a lightweight functional helper library. It is meant to complement an ES6 style with curried helpers, math helpers, curried accessors and higher order looping constructs.

These library is partly inspired by Haskell's [Prelude](https://hackage.haskell.org/package/base/docs/Prelude.html), but its exports are optimized for JavaScript semantics and performance.

This will start to look even more haskelly when the new module syntax pipes in and you can import what you need. But for now, enjoy your `$` spam.

## Usage
Attach it to the short variable of choice:

```js
var $ = require('autonomy');
```

and get functional:

```js
var partition = (p, xs) => [xs.filter(p), xs.filter($.not(p))];
partition((x) => x > 5, [8,3,4,5,6]); // [ [ 8, 6 ], [ 3, 4, 5 ] ]

[[3,4,5], [4,5,6]].filter($.any($.elem([6, 7]))); // [ [ 4, 5, 6 ] ]

$.range(10).filter($.even); // [ 2, 4, 6, 8, 10 ]

$.replicate(5).forEach(cluster.fork); // calls a function with undefined arguments

$.zip3($.range(5), [1,2], [3,2,5]); // [ [ 1, 1, 3 ], [ 2, 2, 2 ] ]
$.zipWith2($.gcd, [5, 10, 15], $.range(5)); // [ 1, 2, 3 ]

var product = $.reduce((x, y) => x * y, 1);
var factorial = (n) => product($.range(n));
factorial(4); // 24
```

Read the read the [API](https://github.com/clux/autonomy/blob/master/api.md).

*This modules makes up the core part of the larger utility library*: [interlude](https://github.com/clux/interlude). If you find yourself co-using `operators` or `subset`, you could use `interlude` instead (there's also more documentation included for interlude).

## Installation

```bash
$ npm install autonomy
```

## License
MIT-Licensed. See LICENSE file for details.
