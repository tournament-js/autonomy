# Autonomy API
Autonomy exports basic functional helpers, looping constructs, functional sequencers which aims to complement existing ES5 methods with a slight functional style.

This module is often bundled with [interlude](https://github.com/clux/interlude), where extra functions exist on the imported object. This API will only mention functions existing in the interlude-less case.

Autonomy goes particularly well with the [operators](https://github.com/clux/operators) module. The [operators API](https://github.com/clux/operators/blob/master/api.md) should perhaps be skimmed to see what functions from there are used. Ultimately these are just simple shortcuts and are in this document assumed bound to the `op` object to illustrate how these go together.

## Functional Composition
Functional composition is done in sequential (rather than algebraic) order. The reasoning for this is there is no real benefit of listing the functions in the reverse order of execution in JavaScript. It is such a fundamental operation that it is available with the `$` function.

### $(f [, g [, ..]]) :: (args.. -> ..(g(f(args..))) )
Returns a function which will apply the passed in functions in sequential order.

```js
var isPair = $($.get('length'), op.eq(2)); // (xs -> Boolean)
[[1,3,2], [2], [], [2,1], [1,2]].filter(isPair); // [ [ 2, 1 ], [ 1, 2 ] ]
```

## Functional Helpers

### $.id(x) :: x
The identity function f(x) = x.

```js
var x = "going through the identity";
$.id(x) === x; // true
```

### $.noop([..]) :: Undefined
No operation. Does nothing.

```js
var log = (console) ? console.log : $.noop;
log("log this if possible");
```

### $.constant(x) :: (y -> x)
Returns the constant function f(y) = x.

```js
[1,3,2].map($.constant(5)); // [5, 5, 5]
```

### $.not(fn) :: (x -> Boolean)
Returns a function which negates `fn` results.
Sometimes useful for composing certain functions.

```js
[8,3,4,5,6].filter($.not(op.gt(5))); // [3, 4, 5]

var partition = function (p, xs) {
  return [xs.filter(p), xs.filter($.not(p))]
};
partition(op.gt(5), [8,3,4,5,6]); // [ [ 8, 6 ], [ 3, 4, 5 ] ]
```

### $.all(fn) -> (xs -> Boolean)
An accessor for Array.prototype.every, but with the function curried.

```js
[[3,4], [1,3], [2,3]].filter($.all($.elem([1, 3, 4]))); // [ [ 3, 4, 5 ] ]
```

### $.any(fn) -> (xs -> Boolean)
An accessor for Array.prototype.some, but with the function curried.

```js
$.any(op.gt(2))([1,2,3]); // true
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

### $.extend(target, source) :: target
Copies the keys of source to target.

```
var defaults = {useBlimp : false, noFire: true}
var config = {useBlimp: true}
$.extend(defaults, config); // {useBlimp: true, noFire: true}
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
These are shortcut functions for extracting a property of an element. Since this is easier natuarlly to do for one element by using the dot operator, the use of these functions are primarily for mass extraction via `Array.prototype.map`.

### $.get(prop [, prop2 [, prop3 [, ..]]]) :: (el -> el[prop] .. [propN])
Allows simple property extraction on an element for maps.

```js
var objs = [{s: "h"}, {s: "e", obj: {hi: 42}}, {s: "y"}];
objs.map($.get('s')).join(''); // 'hey'

// if undefined keys, undefined is returned in maps
objs.map($.get('obj', 'hi')).filter(op.neq(undefined)); // [ 42 ]

var isFieldPos = $($.get('field'), op.gt(0))
```

### $.pluck(prop, xs) :: ys
Shorthand for of a common use-case for `Array.prototype.map`; extracting simple (not deeply nested) property values.

Behaviourally equivalent to `xs.map($.get(prop))`, but skipping the extra function call per element.

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
var aEq2 = $($.get('a'), op.eq(2));
$.firstBy(ary, aEq2); // {a:2}
$.lastBy(ary, aEq2); // {a:2, b:1}
$.last(ary); // {a:3}
```

#### Accessors Note
For all accessors; if a property is undefined on an element, undefined is returned. This also applies for `first`, `firstBy`, `last` and `lastBy` if the array is empty or no matches were found.

To only get the defined values from a map of this style; filter by `op.neq()` or `op.neq(undefined)` to be explicit about what the inequality test tests against.

```js
[{a:5}, {}].map($.get('a')); // [ 5, undefined ]
[{a:5}, {}].map($.get('a')).filter(op.neq()); // [ 5 ]
```

##  Looping Constructs
These tools allow loop like code to be written in a more declarative style.

### $.range(stop) :: [1 , 2 , .. , stop]
### $.range(start, stop) :: [start, start + 1, .. , stop]
### $.range(start, stop, step) :: [start, start + step, ..]
Returns an inclusive range from start to stop, where start and step defaults to 1. The if step is >1, the range may not include the stop.

```js
$.range(5); // [ 1, 2, 3, 4, 5 ]
$.range(0, 4); // [ 0 , 1, 2, 3, 4 ]
$.range(1, 6, 2); // [ 1, 3, 5 ]
$.range(0, 6, 2); // [ 0, 2, 4, 6 ]
```


-### $.replicate(n, x)
Returns an `n` length Array with the element `x` at every position.

NB: Will shallow clone arrays, but insert the same object by reference.

```js
$.replicate(5, 2); // [ 2, 2, 2, 2, 2 ]

$.replicate(3, []); // [ [], [], [] ]

var a = [1];
var b = $.replicate(2, a);
a.push(2); // wont affect b as replicate shallow copies arrays
b; // [ [1], [1] ]

// call cluster.fork 5 times in map without passing accidental arguments
$.replicate(5).map(cluster.fork); // maps undefined -> cluster.fork
```

### $.zip(xs, ys [, zs [, ..]]) :: ls
zip takes n arrays and returns an array$. of n length arrays by joining the input arrays on index.
If any input array is short, excess elements of the longer arrays are discarded.

```js
$.zip([1,2,3], [2,2,2]); // [ [1,2], [2,2], [3,2] ]
$.zip($.range(5), [1,2], [3,2,5]); // [ [1,1,3], [2,2,2] ]
```

### $.zipWith(fn, xs, ys [, zs [, ..]]) :: ls
Same as `zip`, but applies each result array to `fn`, and collects these results.

zipWith generalises zip by zipping with the function given as the first argument, instead of a collecting the elements. For example, $.zipWith(op.plus2, xs, ys) is applied to two arrays to produce the array of corresponding sums.

```js
$.zipWith(op.plus2, [1,1,1], $.range(5)); // [ 2, 3, 4 ]
$.zipWith(op.multiply, [2,2,2], [1,0,1], [1,2,3]); // [ 2, 0, 6 ]
```

### $.iterate(times, init, fn) :: results
Returns a size `times` array of repeated applications of `fn` to `init`:

`$.iterate(times, x, f) equals [x, f(x), f(f(x)), ...]`

```js
$.iterate(3, "ha!", op.prepend("ha")); // [ 'ha!', 'haha!', 'hahaha!' ]

// Fibonacci numbers
var fibPairs = $.iterate(8, [0,1], function (x) {
  return [x[1], x[0] + x[1]];
});
$.pluck(0, fibPairs);
// [ 0, 1, 1, 2, 3, 5, 8, 13 ]
```

### $.scan(xs, init, fn) :: results
Operationally equivalent to `xs.reduce(fn, start)`, but additionally collects all the intermediate results. Thus:

`scan([x1, x2, ...], z, f) equals [z, f(z, x1), f(f(z, x1), x2), ...]`

so the length of the output is `xs.length + 1`:

```js
[1,2,3,4].reduce(op.plus2, 0); // 10
$.scan([1,2,3,4], 0, op.plus2); // [ 0, 1, 3, 6, 10 ]
$.scan([1,1,1,1], 0, op.plus2); //[ 0, 1, 2, 3 ,4 ]
$.iterate(4, 0, op.plus2); // [ 0, 1, 2, 3, 4 ]
```

## Curried Prototype Method Accessors

### $.map(fn) :: (xs -> results)
An accessor for `Array.prototype.map`, but with the function curried.

```js
[[1,2], [3,4]].map($.map(op.plus(1))); // [ [ 2, 3 ], [ 4, 5 ] ]
```

### $.filter(fn) :: (xs -> results)
An accessor for `Array.prototype.filter`, but with the function curried.

### $.reduce(fn [, start]) :: (xs -> results)
An accessor for `Array.prototype.reduce`, but with the function curried.

```js
// alternative implementations of operators' `product` and `flatten` :
var product = $.reduce(op.times2, 1);
var flatten = $.reduce(op.append2, []);
```

### $.invoke(methodName [, args..]) :: (x -> result)
An accessor for any method on the prototype of `x`.

```js
[[1,2], [3,4]].map($.invoke('join','w')); // [ '1w2', '3w4' ]

["Hello", "World"].map($.invoke('slice', 1)); // [ 'ello', 'orld' ]

var xs = [[1,2], [3,4]]
xs.forEach($.invoke('pop'));
xs; // [ [ 1 ], [ 3 ] ]

[f, g, h].map($.invoke('apply', this, arguments));
// [ result of f, result of g, result of h ]
```
