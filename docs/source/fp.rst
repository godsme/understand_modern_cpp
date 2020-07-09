C++编译时元编程
================================

.. code-block:: agda

   data List (A : Set) : Set where
     []   : List A
     _::_ : A -> List A -> List A


.. code-block:: c++

   template <typename A>
   struct List {
      List();
      List(A, List<A>);
   };
