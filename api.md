# Autonomy API
Autonomy exports basic functional helpers, looping constructs, functional sequencers which aims to complement existing ES5 methods with a slight functional style.

This module is often bundled with [interlude](https://github.com/clux/interlude), where extra functions exist on the imported object. This API will only mention functions existing in the interlude-less case.

For simplicity all functions are denoted with a leading `$.` to indicate how you might use it with ES6 if you were to set `var $ = require('autonomy')`. If you are using ES7 modules, this can look simpler. That said, since this library is just a bunch of functions, it may be of value to see clearly which functions are actually exported herein anyway.

## Functional Helpers

### $.id(x) :: x
The identity function f(x) = x.

```js
var x = "going through the identity";
$.id(x) === x; // true
```

### $.noop([..]) :: undefined
No operation. Does nothing.

```js
var log = console ? console.log : $.noop;
log("log this if possible");
```

### $.not(fn) :: (x -> Boolean)
Returns a function which negates `fn` results.
Sometimes useful for composing certain functions.

```js
[8,3,4,5,6].filter($.not((x) => x > 5)); // [3, 4, 5]

var partition = (p, xs) => [xs.filter(p), xs.filter($.not(p))];
partition((x) => x > 5, [8,3,4,5,6]); // [ [ 8, 6 ], [ 3, 4, 5 ] ]
```

### $.all(fn) -> (xs -> Boolean)
An accessor for Array.prototype.every, but with the function curried.

```js
[[3,4], [1,3], [2,3]].filter($.all($.elem([1, 3, 4]))); // [ [ 3, 4 ], [ 1, 3 ] ]
```

### $.any(fn) -> (xs -> Boolean)
An accessor for Array.prototype.some, but with the function curried.

```js
$.any((x) => x > 2)([1,2,3]); // true
[[3,4,5], [4,5,6]].filter($.any($.elem([6, 7]))); // [ [ 4, 5, 6 ] ]
```

### $.none(fn) -> (xs -> Boolean)
An accessor for the negated Array.prototype.some, but with the function curried.

### $.elem(xs) :: (x -> Boolean)
### $.notElem(xs) :: (x -> Boolean)

The membership tests are accessors for `Array.prototype.indexOf`, but with the array curried.

```js
[1,2,3,4,3].filter($.elem([1,3])); // [ 1, 3, 3 ]
[1,2,3,4,3].filter($.notElem([1,3])); // [ 2, 4 ]
```

## Math
Helpers for Integers.

### $.gcd(a, b) :: Int
Returns the greatest common divisor (aka highest common factor) of two Integers.

```js
$.gcd(3, 5); // 1
$.gcd(10, 15); // 5
```

### $.lcm(a, b) :: Int
Returns the least common multiple of the Integers a and b.

```js
$.lcm(3, 5); // 15
$.lcm(10, 15); // 30
```

### $.even(n), $.odd(n) :: Boolean
Returns whether or not the number is even or odd, respectively.

```js
$.even(5); // false
$.odd(5); // true
[1,2,3,4,5,6].filter($.even); // [ 2, 4, 6 ]
```

## Property Accessors
These are shortcut functions for extracting a property of an element.

### $.pluck(prop, xs) :: ys
Shorthand for of a common use-case for `Array.prototype.map`; extracting simple property values.

```js
$.pluck('length', [ [1,3,2],  [2], [1,2] ]); // [ 3, 1, 2 ]
```

### $.first(xs) :: x
Finds the first element of `xs`.

### $.last(xs) :: x
Finds the last element of `xs`.

### $.firstBy(fn, xs) :: x
Finds the first element `x` in `xs` for which `fn(x)` is true.

### $.lastBy(fn, xs) :: x
Finds the last element `x` in `xs` for which `fn(x)` is true.

```js
var ary = [{a:2}, {a:2, b:1}, {a:3}];
var aEq2 = (x) => x.a === 2;
$.firstBy(aEq2, ary); // {a:2}
$.lastBy(aEq2, ary); // {a:2, b:1}
$.last(ary); // {a:3}
```

##  Looping Constructs
These tools allow loop like code to be written in a more declarative style.

### $.range(length) :: [1 , 2 , .. , length]
Returns a 1-indexed inclusive range from of size `length`.

```js
$.range(5); // [ 1, 2, 3, 4, 5 ]
```


### $.replicate(n, fn)
Returns an `n` length Array with the return value of a passed in fn.

```js
$.replicate(5, () => 2); // [ 2, 2, 2, 2, 2 ]
$.replicate(3, (v, k) => [k]); // [ [0], [1], [2] ]

// call cluster.fork 5 times in map without passing accidental arguments
$.replicate(5).map(cluster.fork); // maps undefined -> cluster.fork
```

### $.iterate(times, init, fn) :: results
Returns a size `times` array of repeated applications of `fn` to `init`:

`$.iterate(times, x, f)` equals `[x, f(x), f(f(x)), ...]`

```js
$.iterate(5, 2, op.times(2)); // [ 2, 4, 8, 16, 32 ]

// Fibonacci numbers
var fibPairs = $.iterate(8, [0,1], (x) => [x[1], x[0] + x[1]]);
$.pluck(0, fibPairs);
// [ 0, 1, 1, 2, 3, 5, 8, 13 ]
```

### $.zipN(xs, ys [, zs [, ws]]) :: ls
zip takes between 2 and 4 arrays (depending on function chosen) and returns a single array of n length arrays by joining the input arrays on index.
If any input array is short, excess elements of the longer arrays are discarded.

```js
$.zip2([1,2,3], [2,2,2]); // [ [1,2], [2,2], [3,2] ]
$.zip3($.range(5), [1,2], [3,2,5]); // [ [1,1,3], [2,2,2] ]
```

Note that `zip` may be used as an alias for `zip2`.

### $.zipWithN(fn, xs, ys [, zs [, ws]]) :: ls
Same as `zip`, but applies each result array to `fn`, and collects these results.

zipWith generalises zip by zipping with the function given as the first argument, instead of a collecting the elements as tuples. For example, `$.zipWith((x, y) => x+y, xs, ys)` is applied to two arrays to produce the array of corresponding sums.

```js
$.zipWith2((x, y) => x + y, [1,1,1], $.range(5)); // [ 2, 3, 4 ]
$.zipWith3((x, y, z) => x*y*z, [2,2,2], [1,0,1], [1,2,3]); // [ 2, 0, 6 ]
```

Note that `zipWith` may be used as an alias for `zipWith2`.

## Curried Prototype Method Accessors

### $.map(fn) :: (xs -> results)
An accessor for `Array.prototype.map`, but with the function curried.

```js
[[1,2], [3,4]].map($.map((x, y) => x+y)); // [ [ 2, 3 ], [ 4, 5 ] ]
```

### $.filter(fn) :: (xs -> results)
An accessor for `Array.prototype.filter`, but with the function curried.

### $.reduce(fn [, start]) :: (xs -> results)
An accessor for `Array.prototype.reduce`, but with the function curried.

```js
var product = $.reduce((x, y) => x * y, 1);
var factorial = (n) => product($.range(n));
factorial(4); // 24

var flatten = $.reduce((xs, ys) => xs.concat(ys), []);
flatten([[1,2,3], [[1]], [2,3]]); // [ 1, 2, 3, [ 1 ], 2, 3 ]

```
