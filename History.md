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
