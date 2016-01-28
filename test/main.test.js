var $ = require('..');
var op = require('operators');
var test = require('bandage');

test('common', function *(t) {
  t.eq($.id(10, 12), 10, '1-dim identity');
  t.eq($.noop(10), undefined, 'noop');
  t.ok($.even(4), 'even');
  t.ok($.odd(5), 'odd');
  t.ok($.not((x) => !x), '!false');
  t.eq($.range(5).filter($.elem($.range(4))), $.range(4), 'range/elem filter');
  t.eq($.range(5).filter($.notElem($.range(4))), [5], 'range/elem filter');
  t.eq([[1,2], [3,4]].map($.map(op.plus(1))), [ [2,3], [4,5] ], 'map +1');
  t.eq($.filter($.not(op .gt(2)))([0,1,2,3,4]), [0,1,2], 'filter not');
  var trg = {b: 'boo'};
  var src = {a: 'hi'};
  t.eq($.extend(trg, src), trg, 'extend modifies target');
  t.eq(trg, {a: 'hi', b: 'boo'}, 'extend');
});

test('math', function *(t) {
  t.eq($.gcd(5, 3), 1, 'primes 5,3 are coprime');
  t.eq($.gcd(21, 14), 7, '21 and 14 have 7 as gcd');
  t.eq($.lcm(5, 3), 15, 'primes 5 and 3 have lcm as product');
  t.eq($.lcm(21, 14), 42, '21 and 14 have 42 as lcm');
});

test('loopingConstructs', function *(t) {
  t.eq($.range(5), [1,2,3,4,5], 'range inclusive');
  t.eq($.replicate(5, () => 2), [ 2, 2, 2, 2, 2 ], 'replicate 5x2');
  t.eq($.replicate(3, () => []), [ [], [], [] ], 'replicate 3x[]');
  t.eq($.replicate(3, (v, k) => [k]), [ [0], [1], [2] ], 'using replicate cb');
  t.eq($.interval(2, 5), [2,3,4,5], 'interval gives correct start and end');

  var a = [1];
  var b = $.replicate(2, () => a.slice());
  a.push(2); // should not affect b as replicate shallow copies arrays
  t.eq(b, [ [1], [1] ], 'replicate shallow copies arrays');

  t.eq($.replicate(5).filter(op.eq(undefined)).length, 5, 'replicate undef useful');

  t.eq($.reduce(op.plus2, 5)([1,1,1]), 8, 'reduce add 5 + 1+1+1 === 8');

  t.eq([[1,3,5],[2,3,1]].filter($.any(op.gte(5))), [[1,3,5]], 'filter any gte');
  t.eq([[1,3,5],[2,2,2]].filter($.all(op.eq(2))), [[2,2,2]], 'filter all eq');
  t.eq([[1,3,5],[2,2,2]].filter($.none(op.eq(2))), [[1,3,5]], 'filter none eq');

  t.eq($.iterate(4, 5, op.plus(1)), [5,6,7,8], 'iterate 3x (+1)');
  t.eq($.iterate(5, 2, op.times(2)), [ 2, 4, 8, 16, 32 ], 'iterate 5x (*2)');

  var fibPairs = $.iterate(8, [0,1], (x) => [x[1], x[0] + x[1]]);
  t.eq($.pluck(0, fibPairs), [ 0, 1, 1, 2, 3, 5, 8, 13 ], 'iterate fibonacci');
});

test('accessors', function *(t) {
  // first/last
  var ary = [{a: 1}, {a: 2}, {a: 2, b: 1}, {a: 3}];
  var aEq2 = (el) => el.a === 2;
  t.eq($.first(ary), {a: 1}, 'first');
  t.eq($.last(ary), {a: 3}, 'last');
  t.eq($.last([]), undefined, 'last of empty');
  t.eq($.first([]), undefined, 'first of empty');
  t.eq($.lastBy($.id, []), undefined, 'lastBy $.id of empty');
  t.eq($.firstBy($.id, []), undefined, 'first $.id of empty');

  t.eq($.firstBy(aEq2, ary), {a: 2}, 'firstBy aEq2');
  t.eq($.lastBy(aEq2, ary), {a: 2, b: 1}, 'lastBy aEq2');

  // examples of get
  var objs = [{id: 1, s: 'h'}, {id: 2, s: 'e'}, {id: 3, s: 'y'}];
  t.eq(objs.map((x) => x.id), [ 1, 2, 3 ], 'map get id === 1, 2, 3');
  t.eq(objs.map((x) => x.s).join(''), 'hey', 'map get s join === hey');

  // pluck
  t.eq($.pluck(0, [[1],[2],[3]]), [1,2,3], '$.pluck(0, ary)');
  t.eq($.pluck('a', [{a: 2}, {a: 3}]), [2,3], '$.pluck(a, ary)');

  // first/last
  var fary = [{a: 1}, {a: 2}, {a: 2, b: 1}, {a: 3}];
  t.eq($.first(fary), {a: 1}, 'first');
  t.eq($.last(fary), {a: 3}, 'last');
  t.eq($.last([]), undefined, 'last of empty');
  t.eq($.first([]), undefined, 'first of empty');
  t.eq($.lastBy($.id, []), undefined, 'lastBy $.id of empty');
  t.eq($.firstBy($.id, []), undefined, 'first $.id of empty');

  t.eq($.firstBy(aEq2, fary), {a: 2}, 'firstBy aEq2');
  t.eq($.lastBy(aEq2, fary), {a: 2, b: 1}, 'lastBy aEq2');

  t.eq([[1],[2],[3]].map($.first), [1,2,3], 'ary.map($.first)');
});

test('zippers', function *(t) {
  t.eq($.zipWith2(op.plus2, [1,3,5], [2,4]), [3, 7], 'zipWith2 plus2');
  t.eq($.zipWith3(op.plus3, [1,3,5], [0,0,0], [2,4]), [3, 7], 'zipWith3 add');
  t.eq($.zipWith4(op.plus4, [1,3,5], [0,0,0], [2,4], [1,1]), [4, 8], 'zipWith4 add');
  t.eq($.zip2([1,3,5], [2,4]), [[1,2], [3,4]], 'zip 2 lists');
  t.eq($.zip3([1,3,5], [0,0,0], [2,4]), [[1,0,2], [3,0,4]], 'zip 3 lists');
  t.eq($.zip4([1,3,5], [0,0,0], [2,4], [1,1]), [[1,0,2,1], [3,0,4,1]], 'zip 4 lists');
});

test('get', function *(t) {
  var objs = [
    { a: {b: 'abc', c: {d: {e: 1} } }, f: 1},
    { a: {b: 'def', c: {d: {e: 2} } }, f: 1},
    { a: {b: 'ghi', c: {d: {e: 3} } }, f: 1},
    { a: {b: 'jkl', c: {d: {e: 4} } }, f: 1}
  ];
  t.eq(objs.map((el) => el.f), [1,1,1,1], 'get 1 level deep');
  t.eq(objs.map((el) => el.a.b).join(''), 'abcdefghijkl', 'get 2 levels deep');
  t.eq(objs.map((el) => el.a.c.d.e).join(''), '1234', 'get 4 levels deep');
});
