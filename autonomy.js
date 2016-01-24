var slice = Array.prototype.slice;

// ---------------------------------------------
// Functional Sequencing is default function
// ---------------------------------------------
var seq = function () {
  var fns = arguments;
  return function () {
    var res = fns[0].apply(this, arguments);
    for (var i = 1, len = fns.length; i < len; i += 1) {
      res = fns[i](res);
    }
    return res;
  };
};

var $ = seq;
$.seq = seq; // backwards compat

// ---------------------------------------------
// Functional Helpers
// ---------------------------------------------
$.id = (x) => x;
$.noop = function () {};

$.copy = function (val) {
  if (Array.isArray(val)) {
    return val.slice();
  }
  if (val === Object(val)) {
    return $.extend({}, val);
  }
  return val;
};

$.constant = (val) => () => $.copy(val);
$.not = (fn) => (x) => !fn(x);
$.all = (fn) => (xs) => xs.every(fn);
$.any = (fn) => (xs) => xs.some(fn);
$.none = (fn) => (xs) => !xs.some(fn);
$.elem = (xs) => (x) => xs.indexOf(x) >= 0;
$.notElem = (xs) => (x) => xs.indexOf(x) < 0;

$.extend = function (target, source) {
  var keys = Object.keys(source);
  for (var j = 0; j < keys.length; j += 1) {
    var name = keys[j];
    target[name] = source[name];
  }
  return target;
};

// ---------------------------------------------
// Math
// ---------------------------------------------
$.gcd = function (a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    var temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

$.lcm = function (a, b) {
  return (!a || !b) ? 0 : Math.abs((a * b) / $.gcd(a, b));
};

$.even = (n) => n % 2 === 0;
$.odd = (n) => n % 2 === 1;

// ---------------------------------------------
// Property accessors
// ---------------------------------------------
$.get = function () {
  var args = arguments;
  return function (el) {
    var res = el;
    for (var i = 0; i < args.length && res !== undefined; i += 1) {
      res = res[args[i]];
    }
    return res;
  };
};

$.pluck = function (prop, xs) {
  var result = [];
  for (var i = 0, len = xs.length; i < len; i += 1) {
    result[i] = xs[i][prop];
  }
  return result;
};

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
$.replicate = (length, el) => Array.from({length}, () => $.copy(el));


$.zipWith = function () {
  var fn = arguments[0]
    , args = slice.call(arguments, 1)
    , numLists = args.length
    , results = []
    , len = Math.min.apply(Math, $.pluck('length', args));

  for (var i = 0; i < len; i += 1) {
    var els = [];
    for (var j = 0; j < numLists; j += 1) {
      els.push(args[j][i]);
    }
    results.push(fn.apply(this, els));
  }
  return results;
};

$.zip = function () {
  var numLists = arguments.length
    , results = []
    , len = Math.min.apply(Math, $.pluck('length', arguments));

  for (var i = 0; i < len; i += 1) {
    var els = [];
    for (var j = 0; j < numLists; j += 1) {
      els.push(arguments[j][i]);
    }
    results.push(els);
  }
  return results;
};

$.iterate = function (times, init, fn) {
  var result = [init];
  for (var i = 1; i < times; i += 1) {
    result.push(fn(result[i - 1]));
  }
  return result;
};

$.scan = function (xs, init, fn) {
  var result = [init];
  for (var i = 0, len = xs.length ; i < len; i += 1) {
    result.push(fn(result[i], xs[i]));
  }
  return result;
};

// ---------------------------------------------
// Curried Prototype Accessors
// ---------------------------------------------
$.reduce = (fn, init) => (xs) => xs.reduce(fn, init);
$.map = (fn) => (xs) => xs.map(fn);
$.filter = (fn) => (xs) => xs.filter(fn);

// end - export
module.exports = $;
