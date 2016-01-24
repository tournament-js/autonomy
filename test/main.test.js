var op = require('operators');
var $ = require('..');
var test = require('bandage');

test('common', function *(t) {
  t.eq($.id(10, 12), 10, '1-dim identity');
  t.eq($.noop(10), undefined, 'noop');
  t.eq($.constant(5)(10), 5, 'constant');
  t.ok($.even(4), 'even');
  t.ok($.odd(5), 'odd');
  t.ok($.not($.constant(false)), '!false');
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
  t.eq($.replicate(5, 2), [ 2, 2, 2, 2, 2 ], 'replicate 5x2');
  t.eq($.replicate(3, []), [ [], [], [] ], 'replicate 3x[]');

  var a = [1];
  var b = $.replicate(2, a);
  a.push(2); // should not affect b as replicate shallow copies arrays
  t.eq(b, [ [1], [1] ], 'replicate shallow copies arrays');

  t.eq($.replicate(5).filter(op.eq(undefined)).length, 5, 'replicate undef useful');

  t.eq($.scan([1,1,1], 5, op.plus2), [5,6,7,8],'scan 5 add [1,1,1] === [5,6,7,8]');
  t.eq($.iterate(4, 5, op.plus(1)), [5,6,7,8], 'iterate 3x (+1)');

  t.eq($.reduce(op.plus2, 5)([1,1,1]), 8, 'reduce add 5 + 1+1+1 === 8');

  t.eq([[1,3,5],[2,3,1]].filter($.any(op.gte(5))), [[1,3,5]], 'filter any gte');
  t.eq([[1,3,5],[2,2,2]].filter($.all(op.eq(2))), [[2,2,2]], 'filter all eq');
  t.eq([[1,3,5],[2,2,2]].filter($.none(op.eq(2))), [[1,3,5]], 'filter none eq');
});

test('composition', function *(t) {
  t.eq($(op.plus2, op.plus(5), op.times(2))(3,4), 24, 'seq fns');

  var res = $(op.plus4, op.plus(1), op.plus(1), op.plus(1))(1,1,1,1);
  t.eq(res, 7, '(1+1+1+1) +1 +1 +1');
});

test('accessors', function *(t) {
  // first/last
  var ary = [{a: 1}, {a: 2}, {a: 2, b: 1}, {a: 3}];
  var aEq2 = $($.get('a'), op.eq(2));
  t.eq($.first(ary), {a: 1}, 'first');
  t.eq($.last(ary), {a: 3}, 'last');
  t.eq($.last([]), undefined, 'last of empty');
  t.eq($.first([]), undefined, 'first of empty');
  t.eq($.lastBy($.id, []), undefined, 'lastBy $.id of empty');
  t.eq($.firstBy($.id, []), undefined, 'first $.id of empty');

  t.eq($.firstBy(aEq2, ary), {a: 2}, 'firstBy aEq2');
  t.eq($.lastBy(aEq2, ary), {a: 2, b: 1}, 'lastBy aEq2');

  // get
  t.eq($.get('length')([1,2,3]), 3, '$.get(length)');
  t.eq($.get('a')({a: 2}), 2, '$.get(a)');
  t.eq($.get(1)([5,7]), 7, '$.get(1)');

  // examples of get
  var objs = [{id: 1, s: 'h'}, {id: 2, s: 'e'}, {id: 3, s: 'y'}];
  t.eq(objs.map($.get('id')), [ 1, 2, 3 ], 'map get id === 1, 2, 3');
  t.eq(objs.map($.get('s')).join(''), 'hey', 'map get s join === hey');

  // deep get
  t.eq([[1],[2],[3]].map($.get(0)), [1,2,3], 'ary.map($.get(0))');

  // pluck
  t.eq($.pluck(0, [[1],[2],[3]]), [1,2,3], '$.pluck(0, ary)');
  t.eq($.pluck('a', [{a: 2}, {a: 3}]), [2,3], '$.pluck(a, ary)');

  // first/last
  var fary = [{a: 1}, {a: 2}, {a: 2, b: 1}, {a: 3}];
  var getAeq2 = $($.get('a'), op.eq(2));
  t.eq($.first(fary), {a: 1}, 'first');
  t.eq($.last(fary), {a: 3}, 'last');
  t.eq($.last([]), undefined, 'last of empty');
  t.eq($.first([]), undefined, 'first of empty');
  t.eq($.lastBy($.id, []), undefined, 'lastBy $.id of empty');
  t.eq($.firstBy($.id, []), undefined, 'first $.id of empty');

  t.eq($.firstBy(getAeq2, fary), {a: 2}, 'firstBy getAeq2');
  t.eq($.lastBy(getAeq2, fary), {a: 2, b: 1}, 'lastBy getAeq2');
});

test('zippers', function *(t) {
  t.eq($.zipWith(op.plus2, [1,3,5], [2,4]), [3, 7], 'zipWith plus2');
  t.eq($.zipWith(op.plus3, [1,3,5], [0,0,0], [2,4]), [3, 7], 'zipWith add');
  t.eq($.zip([1,3,5], [2,4]), [[1,2], [3,4]], 'zip 2 lists');
  t.eq($.zip([1,3,5], [0,0,0], [2,4]), [[1,0,2], [3,0,4]], 'zip 3 lists');
});

test('get', function *(t) {
  var objs = [
    { a: {b: 'abc', c: {d: {e: 1} } }, f: 1},
    { a: {b: 'def', c: {d: {e: 2} } }, f: 1},
    { a: {b: 'ghi', c: {d: {e: 3} } }, f: 1},
    { a: {b: 'jkl', c: {d: {e: 4} } }, f: 1}
  ];
  t.eq(objs.map($.get('f')), [1,1,1,1], 'get 1 level deep');
  t.eq(objs.map($.get('a', 'b')).join(''), 'abcdefghijkl', 'get 2 levels deep');
  t.eq(objs.map($.get('a', 'c', 'd', 'e')).join(''), '1234', 'get 4 levels deep');
  t.eq(objs.map($.get('a', 'c', 'ZZ', 'AA')).filter(op.neq()), [], 'harvest deep undefs');
  t.eq(objs.map($.get('ZZ', 'AA')).filter(op.neq()), [], 'harvest shallow undefs');
});

test('constant', function *(t) {
  var o = {bah: 'woot'};
  var fno = $.constant(o);
  var ocpy = fno();
  t.eq(o, ocpy, 'constant copies properties');
  ocpy.hi = 'there';
  t.eq(o.hi, undefined, 'constant returns new copy of object');

  var a = [1];
  var fna = $.constant(a);
  var acpy = fna();
  t.eq(acpy, a, 'constant copies array contents shallowly');
  acpy.push(2);
  t.eq(a.length, 1, 'constant slices arrays so leaves original unmodified');

  // other types do not need copying as they are not returned by reference:
  var s = 'hi';
  var fns = $.constant(s);
  var scpy = fns();
  t.eq(s, scpy, 'constant copies string');
  scpy = 'bi';
  t.eq(s, 'hi', 'we did not overwrite original');
});
