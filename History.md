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
