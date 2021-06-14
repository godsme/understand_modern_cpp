
六大金刚
=============================

任何一个 ``C++`` 类，总会面临六大特殊函数的问题：

  1. default 构造
  2. copy 构造
  3. move 构造
  4. copy 赋值
  5. move 赋值
  6. 析构

它们之间的关系，在如下层面互相影响：

  * 存在性
  * 可操作性
  * 平凡性



而平凡性，则是能力的进一步约束。你能够被默认构造，但却不能被平凡构造。


存在性
--------------

所谓 **存在性** ，单纯指在一个类中，它的定义是否存在，无论是用户自己定义的还是系统默认生成的。

首先，对于任何一个特殊函数，如果用户明确定义或声明了它（ ``=default`` )，它都明确地存在。
其次，对于任何一个特殊函数，如果用户明确的删除了它，它都明确地不再存在。


而当系统决定默认生成某个特殊函数时，依然面临无法生成的困境。比如，其某个非静态成员变量，或者某个父类，将那个特殊函数删除了，
或者访问被禁止了，则系统也会放弃对此特殊函数的生成。

所以，我们下面只讨论在可生成的情况下，系统是否会默认生成某个特殊函数的场景。

默认构造
++++++++++++

只要用户明确声明了构造函数列表（包括 `copy/move` 构造），系统就不会自动生成默认构造。

注意，用户明确声明，并不是指用户自定义。哪怕用户明确的声明了 ``default/delete`` 某个构造，用户也就提供了明确的构造函数列表。比如：

.. code-block:: c++

   struct Thing {
      Thing(Thing&&) = delete;
   };

在这个用户明确声明的构造函数列表中，并不能查到默认构造函数，因而其并不存在。

如果用户没有明确声明任何构造函数。编译器将会尽力为它生成一个。除非编译器发现完全无法做到。
比如，某个非静态成员变量没有默认构造函数。

Copy 构造
+++++++++++

`copy` 构造则在 **构造三杰** 中，地位最高。

如果用户没有提供任何构造函数列表，系统会尽力为其生成一个。

如果用户提供了构造函数列表，即便其中查不到 **`copy` 构造** ，但 **`move` 家族** （ `move` 构造/赋值）没有被明确声明，
那么系统会尽力生成一个 **`copy` 构造** 。

.. code-block:: c++

   struct Thing {
      Thing() {}
      // 隐式生成一个copy构造
      // Thing(Thing const&) = default;
   };

.. code-block:: c++

   struct Thing {
      Thing(Thing&&) = delete;
      // copy构造被删除
      // Thing(Thing const&) = delete;
   };

.. code-block:: c++

   struct Thing {
      Thing(Thing&&) = default;
      // copy构造被删除
      // Thing(Thing const&) = delete;
   };


.. code-block:: c++

   struct Thing {
      auto operator=(Thing&&) -> Thing& = default;
      // copy构造被删除
      // Thing(Thing const&) = delete;
   };


.. code-block:: c++

   struct Thing {
      auto operator=(Thing&&) -> Thing& = delete;
      // copy构造被删除
      // Thing(Thing const&) = delete;
   };

所以它的默认存在性，只受 **`move` 家族** 的影响。


Move构造
+++++++++++++

**`move` 构造** 则在 **构造三杰** 中，最为脆弱。

如果用户明确声明了如下任何一个，系统都不会自动生成move构造：

  * copy构造
  * copy赋值
  * move赋值
  * 析构函数

所以其默认存在性，不仅受 **copy家族** 和 **析构** 的影响，还会遭受本家族另一成员的攻击。


Copy 赋值
++++++++++++

**`copy` 赋值** 与 **copy构造** 的处境一致。


Move 赋值
++++++++++++

**`move` 赋值** 与 **move构造** 的处境一致。差别只在于家族内自相残杀的对手。

.. code-block:: c++

   struct Thing {
      Thing(Thing&&) = default;
      // move赋值被删除
      // auto operator=(Thing&&) -> Thing& = delete;
   };


析构
+++++++++

**析构** 在 **六大金刚** 中，处于食物链的顶端: 它只可能影响别人的存在性，而其它五位的存在性对其毫无影响。

一旦用户明确自定义了析构，则 **move家族** 就丧失了被隐式提供的权利。除非程序员显式声明，否则，move家族的两个成员都被标记为删除。

析构对于 **copy家族** 与 **默认构造** 的存在性没有影响, 即便析构被明确标记为删除。



可操作性
---------------------

而可操作性，指的是，一个类的对象，是否可以执行某种操作。其与存在性高度相关，但又不完全相同。


首先， 一个类，move构造函数可以不存在，却是 **可move构造** 的（即 ``Foo foo2{std::move(foo1)}`` 是合法的表达式）。

这背后的原因不难理解。因为 ``std::move`` 操作仅仅是将一个表达式无条件变为右值引用。只要有一个构造函数能够匹配右值引用，那么这个类就是
`可move构造` 的。 毫无疑问 ``operator=(Foo const&)`` 形式的拷贝构造可以匹配右值引用，因而即便没有右值引用的构造函数，它依然是 `可move构造` 的。


.. code-block:: c++

   struct Foo {
      auto operator=(Foo const&) -> Foo& = default;
   };

   static_assert(std::is_copy_constructible_v<Foo>);
   static_assert(std::is_move_constructible_v<Foo>);


其次，一个类的拷贝构造可以是 ``operator=(Foo&)`` 的形式，但这样的拷贝构造，即无法接受 ``Foo const&`` ，也无法接受 ``Foo&&`` ，因而
如果这个类仅仅提供了这种形式的拷贝构造函数，那么它既不是 `可copy构造` 的，也不是 `可move构造` 的。

.. code-block:: c++

   struct Foo {
      Foo() = default;
      auto operator=(Foo&) -> Foo& = default;
   };

   static_assert(!std::is_copy_constructible_v<Foo>);
   static_assert(!std::is_move_constructible_v<Foo>);


但注意，这个 `copy构造` 函数，依然可以匹配 non-const 左值引用。因而依然可以进行拷贝构造操作。


.. code-block:: c++

   Foo foo{};
   Foo foo2{foo};


因而， ``std::is_copy_constructible_v<T>`` 测试的是 ``T(T const&)`` 是否是合法的。而 ``std::is_move_constructible_v<T>`` 测试的则是
 ``T(T&&)`` 表达式的合法性。

由于 `可move构造` 的条件并不意味着 ``T(std::move(t))`` 必然匹配的是 ``move构造`` ，这就会在某些情况下，由于程序员的疏忽而导致非期望的行为。比如：


.. code-block:: c++

   struct Foo {
      Foo(int a) : p{new int(a)} {}
      Foo(Foo const& rhs) : p{new int(*rhs.p)} {}
      auto operator=(Foo const& rhs) -> Foo& {
        delete p; p = new int{*rhs.p}; 
        return *this;
      }
      Foo(Foo&& rhs) : p{rhs.p} { rhs.p = nullptr; }
      auto operator=(Foo&& rhs) -> Foo& {
        delete p; p = rhs.p; rhs.p = nullptr;
        return *this;
      }
      ~Foo() { delete p; }
   private:
      int* p;
   };


   struct Bar : Foo {
     using Foo::Foo;

     ~Bar() { /* do something */ }
   };


在这个例子中，子类Bar由于自定了析构函数，按照之前在 **存在性** 里所讨论的，编译器将不会自动为 ``Bar`` 生成 ``move家族`` 的任何函数，但却
会自动为 ``Bar`` 生成 ``copy家族`` 的函数：

.. code-block:: c++

   struct Bar : Foo {
     using Foo::Foo;

     // copy家族的默认存在性不受影响
     // Bar(Bar const&) = default;
     // auto operator(Bar const&) -> Bar& = default;

     // 由于~Bar()被明确定义，因而move家族不再存在
     // Bar(Bar&&) = delete;
     // auto operator(Bar&&) -> Bar& = delete;

     ~Bar() { /* do something */ }
   };

   
在这样的情况下，如下代码将会十分完美的通过编译：

.. code-block:: c++

   Bar bar{10};
   Bar bar2{std::move(bar)};

但系统的行为却不是我们所期待的。


另外一个特殊情况则是：如果一个了的 **析构** 被标记为 ``delete`` ， 并不妨碍存在性规则。比如我们将上例中的 ``Bar`` 修改为：


.. code-block:: c++

   struct Bar : Foo {
     Bar() : Foo{10} {}

     // copy家族的默认存在性不受影响
     // Bar(Bar const&) = default;
     // auto operator(Bar const&) -> Bar& = default;

     // 由于~Bar()被明确声明为delete，因而move家族也不再存在
     // Bar(Bar&&) = delete;
     // auto operator(Bar&&) -> Bar& = delete;

     ~Bar() = delete;
   };


此时，我们依然可以合法地编写如下代码：

.. code-block:: c++

   Bar* bar  = new Bar{};
   Bar* bar2 = new Bar{*bar};
   Bar* bar3 = new Bar{std::move(*bar2)};
   *bar2     = *bar3;
   *bar3     = std::move(*bar);


但此时，所有构造相关的可操作性检验统统失败。

.. code-block:: c++

   static_assert(!std::is_default_constructible_v<Bar>);
   static_assert(!std::is_copy_constructible_v<Bar>);
   static_assert(!std::is_move_constructible_v<Bar>);


这是因为，虽然对于动态分配的对象而言，可以只创建，不销毁；但对于一个非动态非配的值对象而言，销毁是个必然会经历的过程，一旦无法销毁，也就意味着不能创建。

但赋值相关的两个操作，可操作性检验依然是成功的：

.. code-block:: c++

   static_assert(std::is_copy_assignable_v<Bar>);
   static_assert(std::is_move_assignable_v<Bar>);

这是因为，即便你是动态创建出来的永不销毁的对象，相互之间依然可以进行赋值操作。

