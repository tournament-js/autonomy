var tap = require('tap')
  , test = tap.test
  , op = require('operators')
  , $ = require('../');

test('common', function (t) {
  t.equal($.id(10, 12), 10, "1-dim identity");
  t.equal($.noop(10), undefined, "noop");
  t.equal($.constant(5)(10), 5, "constant");
  t.ok($.not($.constant(false)), "!false");
  t.deepEqual($.range(5).filter($.elem($.range(4))), $.range(4), "range/elem filter");
  t.deepEqual($.range(5).filter($.notElem($.range(4))), [5], "range/elem filter");
  t.end();
});

test('math', function (t) {
  t.equal($.gcd(5, 3), 1, "primes 5,3 are coprime");
  t.equal($.gcd(21, 14), 7, "21 and 14 have 7 as gcd");
  t.equal($.lcm(5, 3), 15, "primes 5 and 3 have lcm as product");
  t.equal($.lcm(21, 14), 42, "21 and 14 have 42 as lcm");
  t.end();
});

test("looping constructs", function (t) {
  t.deepEqual($.range(1,5), $.range(5), "range 1 indexed");
  t.deepEqual($.range(5), [1,2,3,4,5], "range inclusive");
  t.deepEqual($.range(1,5,2), [1,3,5], "range step inclusive");
  t.deepEqual($.range(1,6,2), [1,3,5], "range step inclusive");

  t.deepEqual($.replicate(5, 2), [ 2, 2, 2, 2, 2 ], "replicate 5x2");
  t.deepEqual($.replicate(3, []), [ [], [], [] ], "replicate 3x[]");

  var a = [1];
  var b = $.replicate(2, a);
  a.push(2); // should not affect b as replicate shallow copies arrays
  t.deepEqual(b, [ [1], [1] ], "replicate shallow copies arrays");

  t.equal($.replicate(5).filter(op.eq(undefined)).length, 5, "replicate undef useful");

  t.deepEqual($.scan([1,1,1], 5, op.plus2), [5,6,7,8],"scan 5 add [1,1,1] === [5,6,7,8]");
  t.deepEqual($.iterate(4, 5, op.plus(1)), [5,6,7,8], "iterate 3x (+1)");

  t.equal($.reduce(op.plus2, 5)([1,1,1]), 8, "reduce add 5 + 1+1+1 === 8");

  t.deepEqual([[1,3,5],[2,3,1]].filter($.any(op.gte(5))), [[1,3,5]], "filter any gte");
  t.deepEqual([[1,3,5],[2,2,2]].filter($.all(op.eq(2))), [[2,2,2]], "filter all eq");
  t.deepEqual([[1,3,5],[2,2,2]].filter($.none(op.eq(2))), [[1,3,5]], "filter none eq");
  t.end();
});

test("composition", function (t) {
  t.equal($(op.plus2, op.plus(5), op.times(2))(3,4), 24, "seq fns");

  var res = $(op.plus4, op.plus(1), op.plus(1), op.plus(1))(1,1,1,1);
  t.equal(res, 7, "(1+1+1+1) +1 +1 +1");

  t.end();
});

test("accessors", function (t) {
  // first/last
  var ary = [{a:1}, {a:2}, {a:2, b:1}, {a:3}];
  var aEq2 = $($.get('a'), op.eq(2));
  t.deepEqual($.first(ary), {a:1}, "first");
  t.deepEqual($.last(ary), {a:3}, "last");
  t.deepEqual($.last([]), undefined, "last of empty");
  t.deepEqual($.first([]), undefined, "first of empty");
  t.deepEqual($.lastBy($.id, []), undefined, "lastBy $.id of empty");
  t.deepEqual($.firstBy($.id, []), undefined, "first $.id of empty");

  t.deepEqual($.firstBy(aEq2, ary), {a:2}, "firstBy aEq2");
  t.deepEqual($.lastBy(aEq2, ary), {a:2, b:1}, "lastBy aEq2");

  // get
  t.equal($.get('length')([1,2,3]), 3, "$.get('length')");
  t.equal($.get('a')({a:2}), 2, "$.get('a')");
  t.equal($.get(1)([5,7]), 7, "$.get(1)");

  // examples of get
  var objs = [{id: 1, s: "h"}, {id: 2, s: "e"}, {id: 3, s: "y"}];
  t.deepEqual(objs.map($.get('id')), [ 1, 2, 3 ], "map get id === 1, 2, 3");
  t.equal(objs.map($.get('s')).join(''), "hey", "map get s join === hey");

  // deep get
  var objs = [
    {id: 1, s: "h", obj: {ary: [1,2]} }
  , {id: 2, s: "e", obj: {ary: [3,4]} }
  , {id: 3, s: "y", obj: {ary: [5,6]} }
  ];

  t.deepEqual([[1],[2],[3]].map($.get(0)), [1,2,3], "ary.map($.get(0))");

  // pluck
  t.deepEqual($.pluck(0, [[1],[2],[3]]), [1,2,3], "$.pluck(0, ary)");
  t.deepEqual($.pluck('a', [{a:2}, {a:3}]), [2,3], "$.pluck('a', ary)");

  // first/last
  var ary = [{a:1}, {a:2}, {a:2, b:1}, {a:3}];
  var aEq2 = $($.get('a'), op.eq(2))
  t.deepEqual($.first(ary), {a:1}, "first");
  t.deepEqual($.last(ary), {a:3}, "last");
  t.deepEqual($.last([]), undefined, "last of empty");
  t.deepEqual($.first([]), undefined, "first of empty");
  t.deepEqual($.lastBy($.id, []), undefined, "lastBy $.id of empty");
  t.deepEqual($.firstBy($.id, []), undefined, "first $.id of empty");

  t.deepEqual($.firstBy(aEq2, ary), {a:2}, "firstBy aEq2");
  t.deepEqual($.lastBy(aEq2, ary), {a:2, b:1}, "lastBy aEq2");
  t.end();
});

test("zipWith/zip", function (t) {
  t.deepEqual($.zipWith(op.plus2, [1,3,5], [2,4]), [3, 7], "zipWith plus2");
  t.deepEqual($.zipWith(op.add, [1,3,5], [0,0,0], [2,4]), [3, 7], "zipWith add");
  t.deepEqual($.zip([1,3,5], [2,4]), [[1,2], [3,4]], "zip 2 lists");
  t.deepEqual($.zip([1,3,5], [0,0,0], [2,4]), [[1,0,2], [3,0,4]], "zip 3 lists");
  t.end();
});

test("get", function (t) {
  var objs = [
     { a: {b: "abc", c: {d: {e: 1} } }, f: 1}
   , { a: {b: "def", c: {d: {e: 2} } }, f: 1}
   , { a: {b: "ghi", c: {d: {e: 3} } }, f: 1}
   , { a: {b: "jkl", c: {d: {e: 4} } }, f: 1}
 ];

 t.deepEqual(objs.map($.get('f')), [1,1,1,1], "get 1 level deep");
 t.equal(objs.map($.get('a', 'b')).join(''), "abcdefghijkl", "get 2 levels deep");
 t.equal(objs.map($.get('a', 'c', 'd', 'e')).join(''), "1234", "get 4 levels deep");
 t.deepEqual(objs.map($.get('a', 'c', 'ZZ', 'AA')).filter(op.neq()), [], "harvest deep undefs");
 t.deepEqual(objs.map($.get('ZZ', 'AA')).filter(op.neq()), [], "harvest shallow undefs");
 t.end();
});
