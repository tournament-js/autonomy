var $ = {};

// ---------------------------------------------
// Functional Helpers
// ---------------------------------------------
$.id = (x) => x;
$.noop = function () {};
$.not = (fn) => (x) => !fn(x);
$.all = (fn) => (xs) => xs.every(fn);
$.any = (fn) => (xs) => xs.some(fn);
$.none = (fn) => (xs) => !xs.some(fn);
$.elem = (xs) => (x) => xs.indexOf(x) >= 0;
$.notElem = (xs) => (x) => xs.indexOf(x) < 0;
$.extend = Object.assign;

// ---------------------------------------------
// Math
// ---------------------------------------------
$.gcd = function (a_, b_) {
  var a = Math.abs(a_);
  var b = Math.abs(b_);
  while (b) {
    var temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};
$.lcm = (a, b) => (!a || !b) ? 0 : Math.abs((a * b) / $.gcd(a, b));

$.even = (n) => n % 2 === 0;
$.odd = (n) => n % 2 === 1;

// ---------------------------------------------
// Property accessors
// ---------------------------------------------
$.pluck = (prop, xs) => xs.map((x) => x[prop]);

$.first = (xs) => xs[0];
$.last = (xs) => xs[xs.length - 1];

$.firstBy = function (fn, xs) {
  for (var i = 0, len = xs.length; i < len; i += 1) {
    if (fn(xs[i])) {
      return xs[i];
    }
  }
};
$.lastBy = function (fn, xs) {
  for (var i = xs.length - 1; i >= 0; i -= 1) {
    if (fn(xs[i])) {
      return xs[i];
    }
  }
};

// ---------------------------------------------
// Higher order looping
// ---------------------------------------------
$.range = (length) => Array.from({length}, (v, k) => k + 1);
$.replicate = (length, fn) => Array.from({length}, fn);

$.zipWith2 = function (fn, xs, ys) {
  var length = Math.min(xs.length, ys.length);
  return Array.from({length}, (v, k) => fn(xs[k], ys[k]));
};
$.zipWith3 = function (fn, xs, ys, zs) {
  var length = Math.min(xs.length, ys.length, zs.length);
  return Array.from({length}, (v, k) => fn(xs[k], ys[k], zs[k]));
};
$.zipWith4 = function (fn, xs, ys, zs, ws) {
  var length = Math.min(xs.length, ys.length, zs.length, ws.length);
  return Array.from({length}, (v, k) => fn(xs[k], ys[k], zs[k], ws[k]));
};

$.zip2 = (xs, ys) => $.zipWith2((x, y) => [x, y], xs, ys);
$.zip3 = (xs, ys, zs) => $.zipWith3(((x, y, z) => [x, y, z]), xs, ys, zs);
$.zip4 = (xs, ys, zs, ws) => $.zipWith4((x, y, z, w) => [x, y, z, w], xs, ys, zs, ws);

// ---------------------------------------------
// Curried Prototype Accessors
// ---------------------------------------------
$.reduce = (fn, init) => (xs) => xs.reduce(fn, init);
$.map = (fn) => (xs) => xs.map(fn);
$.filter = (fn) => (xs) => xs.filter(fn);

// end - export
module.exports = $;
