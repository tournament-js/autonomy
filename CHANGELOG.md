1.0.1 / 2015-11-15
==================
  * Added `.npmignore`

1.0.0 / 2014-09-30
==================
  * Add `$.copy` to shallow copy an element
  * `$.constant(n)` now uses `$.copy`
  * `$.replicate(o)` now uses `$.copy` (thus will additionally copy objects)

0.5.2 / 2014-09-02
==================
  * Move coverage to tests area to avoid confusing browserify

0.5.1 / 2014-07-10
==================
  * Better documentation and test coverage

0.5.0 / 2012-11-11
==================
  * `$(..fns)` now calls `$.seq`
  * `$.seq` still maintained for backwards compatibility in interlude for now.

0.4.2 / 2012-10-20
==================
  * `get` is now variadic and can do what `getDeep` could

0.4.1 / 2012-10-20
==================
  * `replicate` has been reinstated with an Array safe version

0.4.0 / 2012-10-20
==================
  * `has` removed as `Object.create(null)` fills the void
  * `seq2`, `seq3`, `seq4` variants removed - bad premature optimization
  * `getDeep` removed, bad to encourage that inefficiency over creating a more readable fn
  * `replicate` removed, faulty (assign by reference on arrays and object)

0.3.0 / 2012-07-04
==================
  * scan arguments now model $.iterate

0.2.0 / 2012-06-30
==================
  * First quite stable API release outside `interlude`
  * Moved pow/log to the `operators` module
  * Added a simple `extend`
