
六大金刚
=============================

任何一个 ``C++`` 类，总会面临六大特殊函数的问题：

  1. `default` 构造
  2. `copy` 构造
  3. `move` 构造
  4. `copy` 赋值
  5. `move` 赋值
  6. 析构

这六大金刚，有着不同的分类方法。

首先一种分类方法是：
   
   1. 构造三杰 : `default/copy/move` 构造;
   2. 赋值二将 : `copy/move` 赋值;
   3. 析构


另一种分类方法是：

   1. 默认构造
   2. `copy` 家族: `copy` 构造/赋值
   3. `move` 家族: `move` 构造/赋值
   4. 析构


第三种分类方法为：

   1. 默认构造/析构
   2. 四大金刚： `copy/move` 构造/赋值


还有一种分类方法是：

   1. 默认构造
   2. `gang of 5` : 其它五个


在谈论不同的特性时，这几种不同的分类方法各自有其自己的意义。


而这六大金刚之间的关系，在如下层面互相影响：

  * 存在性
  * 可操作性
  * 平凡性


存在性
--------------

所谓 **存在性** ，单纯指在一个类中，它的定义是否存在，无论是用户自己定义的还是系统默认生成的。

首先，对于任何一个特殊函数，如果用户明确定义了它（ 包括 ``=default`` )，它都明确地存在。
其次，对于任何一个特殊函数，如果用户明确删除了它 ( ``delete`` )，它都明确地不再存在。


而当系统决定默认生成某个特殊函数时，依然面临无法生成的困境。比如，其某个非静态成员变量，或者某个父类，将那个特殊函数删除了，
或者访问被禁止了，则系统也会放弃对此特殊函数的生成。

所以，我们下面只讨论在可生成的情况下，系统是否会默认生成某个特殊函数的场景。


默认构造
++++++++++++

只要用户 **明确声明** 了构造函数列表（包括 **copy/move 构造** ），系统就不会隐式定义 **默认构造** 。

注意，用户 **明确声明** ，并不是指用户 **自定义** : 用户可以明确地声明 ``T() = default`` 或者 ``T() = delete`` ， 但这些都不是用户自定义默认构造。 但只要用户明确声明了任何构造，编译器都不会再自动生成默认构造。比如：

.. code-block:: c++

   struct Thing {
      Thing(Thing&&) = delete;
   };

在这个用户明确声明的构造函数列表中，并不能查到 **默认构造** ，因而其并不存在。

如果用户没有 明确声明 **任何** 构造函数。编译器将会尽力为它生成一个。除非编译器发现完全无法做到。 比如，父类或其某个非静态成员变量没有 **默认构造函数** 。


.. attention::

   系统隐式定义的默认构造为 ``T() = default`` 。 它从行为上与用户亲自定义一个空的默认构造函数： ``T() {}`` 没有任何差别。 其行为调用父类
   和所有非静态成员的默认构造。对于所有的基本类型，指针，枚举等，其默认构造什么也不做，让值保持其被分配出来时，内存中的值。 

   不过，虽然 ``T() = default`` 和 ``T() {}`` 从自身行为上完全一致。但是当用户对 ``T`` 类型的对象进行 :ref:`value_initialize` 时
   ( ``T value{}`` )， 过程却完全不同：前者，系统会对首先将 ``value`` 的内存清零，然后再调用默认构造；而后者，由于用户提供了默认
   构造，系统则会直接调用默认构造。 过程的不同，最终也会导致初始化的结果很可能不同。


copy 构造
++++++++++++++++++++++++

*copy 构造* 则在 **构造三杰** 中，地位最高。

如果用户没有提供任何构造函数列表，系统会尽力为其生成一个。

如果用户提供了构造函数列表，即便其中查不到 **copy 构造** ，但只要 **move 家族** 的所有成员都没有被明确声明，
那么系统会尽力生成一个 **copy 构造** 。

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


所以它的默认存在性，只受 **move 家族** 的影响。

.. attention::

   隐式生成的拷贝构造，其行为为：依次调用所有父类和非静态成员的copy构造。


move 构造
+++++++++++++

**move 构造** 则在 **构造三杰** 中，最为脆弱。

如果用户明确声明了如下任何一个，系统都不会自动生成move构造：

  * `copy` 构造
  * `copy` 赋值
  * `move` 赋值
  * 析构函数

所以其默认存在性，不仅受 **copy家族** 和 **析构** 的影响，还会遭受本家族另一成员的攻击。

.. attention::

   隐式生成的move构造，其行为为：依次调用所有父类和非静态成员的move构造。


copy 赋值
++++++++++++

**copy 赋值** 与 **copy构造** 的处境一致。


move 赋值
++++++++++++

**move 赋值** 与 **move构造** 的处境一致。差别只在于家族内自相残杀的对手。

.. code-block:: c++

   struct Thing {
      Thing(Thing&&) = default;
      // move赋值被删除
      // auto operator=(Thing&&) -> Thing& = delete;
   };


析构
+++++++++

.. _existance:

**析构** 在 **六大金刚** 中，处于食物链的顶端: 它只可能影响别人的存在性，而其它五位的存在性对其毫无影响。

一旦用户明确自定义了 **析构** ，则 **move家族** 就丧失了被编译器隐式生成的权利。除非程序员显式声明，否则， **move家族** 的两个成员都被标记为删除。

**析构** 对于 **copy家族** 与 **默认构造** 的存在性没有影响, 即便 **析构** 被明确标记为删除。


.. attention::

   系统自动生成的析构，会依次调用父类的析构以及所有非静态成员的析构。


可操作性
---------------------

而 **可操作性** ，指的是，一个类的对象，是否可以执行某种操作。其与 **存在性** 高度相关，但又不完全相同。


并不move的move
+++++++++++++++++++++++

首先， 一个类，**move 构造** 可以不存在，却是 **可 move 构造** 的（即 ``Foo foo2{std::move(foo1)}`` 是合法的表达式）。

这背后的原因不难理解。因为 ``std::move`` 操作仅仅是将一个表达式无条件变为右值引用。只要有一个构造函数能够匹配右值引用，那么这个类就是 **可 move 构造** 的。 毫无疑问 ``operator=(Foo const&)`` 形式的拷贝构造可以匹配右值引用，因而即便没有右值引用的构造函数，它依然是 **可 move 构造** 的。


.. code-block:: c++

   struct Foo {
      auto operator=(Foo const&) -> Foo& = default;
   };

   static_assert(std::is_copy_constructible_v<Foo>);
   static_assert(std::is_move_constructible_v<Foo>);


其次，一个类的拷贝构造可以是 ``operator=(Foo&)`` 的形式，但这样的拷贝构造，即无法接受 ``Foo const&`` ，也无法接受 ``Foo&&`` ，因而, 如果这个类仅仅提供了这种形式的拷贝构造函数，那么它既不是 `copy constructible` 的，也不是 `move constructible` 的。

.. code-block:: c++

   struct Foo {
      Foo() = default;
      auto operator=(Foo&) -> Foo& = default;
   };

   static_assert(!std::is_copy_constructible_v<Foo>);
   static_assert(!std::is_move_constructible_v<Foo>);


但注意，这个 **copy 构造** 函数，依然可以匹配 `non-const` 左值引用。因而依然可以进行 **copy 构造** 操作。


.. code-block:: c++

   Foo foo{};
   Foo foo2{foo};


因而, 

  1. ``std::is_copy_constructible_v<T>`` 测试 ``T(T const&)`` 是否是合法的; 而
  2. ``std::is_move_constructible_v<T>`` 测试的则是 ``T(T&&)`` 表达式的合法性。


由于 **可 move 构造** 的条件并不意味着 ``T(std::move(t))`` 必然匹配的是 **move 构造** ，这就会在某些情况下，由于程序员的疏忽而导致非期望的行为。比如：


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


在这个例子中，子类 ``Bar`` 由于自定了 **析构** 函数，按照之前在 :ref:`存在性<existance>` 里所讨论的，编译器将不会自动为 ``Bar`` 生成 **move 家族** 的任何函数，但却会自动为 ``Bar`` 生成 **copy 家族** 的函数：

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


析构 = delete
+++++++++++++++++++++++++

另外一个特殊情况则是：如果一个类的 **析构** 被标记为 ``delete`` ， 并不妨碍存在性规则。比如我们将上例中的 ``Bar`` 修改为：


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

但 **赋值二将** 的 **可操作性** 检验依然是成功的：

.. code-block:: c++

   static_assert(std::is_copy_assignable_v<Bar>);
   static_assert(std::is_move_assignable_v<Bar>);

这是因为，即便你是动态创建出来的永不销毁的对象，相互之间依然可以进行赋值操作。


平凡性
--------------------

**平凡性** 当然首先是基于 **可操作性** 的。你只有首先具备可操作性，才能谈论一个操作是不是平凡的。

而六大金刚一旦是平凡的，那么它们的行为也可以很平凡的分为两类：

  1. 对于 **析构** 和 **默认构造** ，什么也不用做；
  2. 对于 **copy/move 家族** 的四大金刚，等同于 ``::memcpy`` ；

虽然规范中，对于 **平凡copy构造** ，明确的说明了 `padding` 并不需要拷贝，但也并不禁止，但编译器基本上都会基于性能和简单性的考量，直接 ``::memcpy`` 了事。


为了探究平凡性，我们先构造一个无比平凡的类：

.. code-block:: c++

   struct Thing {
      Thing() = default;

      Thing(Thing const&) = default;
      auto operator=(Thing const&) -> Thing& = default;

      Thing(Thing&&) = default;
      auto operator=(Thing&&) -> Thing& = default;

      ~Thing() = default;
   };


你无法再定义一个比它还要平凡的类，这六大 ``default`` 行为，其实完全不需要写。因而，毫无意外，它们应该都能通过平凡性测试：

.. code-block:: c++

   static_assert(std::is_trivially_default_constructible_v<Thing>);

   static_assert(std::is_trivially_copy_constructible_v<Thing>);
   static_assert(std::is_trivially_copy_assignable_v<Thing>);

   static_assert(std::is_trivially_move_constructible_v<Thing>);
   static_assert(std::is_trivially_move_assignable_v<Thing>);

   static_assert(std::is_trivially_destructible_v<Thing>);


而 **析构** 函数，继续在 **平凡性** 领域表现其王者气质。


一旦我们将其变为 **明确定义** 的：


.. code-block:: c++

   struct Thing {
      Thing() = default;

      Thing(Thing const&) = default;
      auto operator=(Thing const&) -> Thing& = default;

      Thing(Thing&&) = default;
      auto operator=(Thing&&) -> Thing& = default;

      ~Thing() {} // 明确定义
   };


则所有的构造，马上变为非平凡的：

.. code-block:: c++

   static_assert(!std::is_trivially_default_constructible_v<Thing>);
   static_assert(!std::is_trivially_copy_constructible_v<Thing>);
   static_assert(!std::is_trivially_move_constructible_v<Thing>);

如果我们将 **析构** 定义为 ``delete`` ，那么连 **可操作性** 都没有了，就更不用说操作的 **平凡性** 了。


也就是说，只有当 **析构** 是平凡的，那么三大构造才可能是平凡的。


这样的决策并不是在所有的场景下都必然合理。但出于保守的动机，这又是一个合理的选择。比如，我们定义如下一个类：

.. code-block:: c++

   struct Foo {
      int fd;
      ~Foo() { if(a != 0) ::close(fd); }
   };

单纯从数据成员，以及其它五大金刚看，这个类也平凡无比。但那个无比平凡的整数成员，事实上是一个文件描述符。析构函数会负责将其关闭。

对于这个类，其用户必须保证其构造时，都进行零初始化：

.. code-block:: C++

    Foo foo{};


但这个类，也可能通过某种框架被使用。比如 ``vector<Foo>`` 。当你调用 ``vector.emplace()`` 时， ``emplace`` 的实现可以根据平凡性进行优化：

.. code-block:: c++

    if constexpr(!std::is_trivially_default_constructible_v<T>) {
        elem[n] = {};
    }


我们知道 ``{}`` 这种值初始化方式，会保证对象一定会被初始化，最不济也会将内存清0。但如果一个对象的默认拷贝函数是平凡的，我们则无需进行这样的重量级操作。直接用默认初始化——什么都不用做就好。

当然，对于非平凡默认构造的对象而言，还是要老老实实说进行值初始化为好。所以，对于 ``Foo`` ，系统必须明确的指明其默认构造是非平凡的，才可能让框架对其进行必要的初始化。

当然，你肯定会鄙视这个类的设计者，认为这是一个连菜鸟都不会做出的糟糕设计。但做为语言的设计者，却无法禁止程序员可以这么做。因而只能保守
的决定，即便 **默认构造** 、 **拷贝构造** 都是可操作的（甚至操作是平凡的），但如果你检测它是否是 **可平凡构造** 的，它的答案是NO。至少编译器或者框架基于 **平凡性** (而不是 **非平凡性** ）所做出的任何自动决定都会被禁止。让程序员亲自为自己的设计决策负责。


另外，需要注意的是， **析构** 的 **非平凡性** ，并不会影响两个 **赋值** 操作的 **平凡性** 。对于上面的例子：

.. code-block:: c++

   static_assert(std::is_trivially_copy_assignable_v<Thing>);
   static_assert(std::is_trivially_move_assignable_v<Thing>);


.. attention::

   之所以两个赋值函数处处不受析构函数性质的影响（无论是存在性还是平凡性），核心原因在于：构造和析构是于对象的生命周期有关的接口，是必须存在的（尤其是构造），但两个赋值接口却是在对象存在的情况下的 **修改接口** （类似于 `set` 函数）。

   一个只读对象可以没有 `set` 接口（也不应该有），但却不可能没有构造。它们和 **copy/move 构造** 表面上的相似性, 经常会导致程序员忽略了它们从根本上不同的性质，从而本末倒置地陷入困惑。


除了析构函数之外，其它五大金刚的平凡性，则 **只受它们各自的影响** 。如果它们各自本来是平凡的，将其中任何一个改为不平凡的（通过明确定义或 `delete` )，它自己就会变为非平凡的。但其它金刚的平凡性质保持不变。


除了这六大平凡性判断之外，还有两个总体判断平凡性的 `type trait` ：

  1. std::is_trivially_copiable<T>
  2. std::is_trivially<T>


其中前者包含了除了 **默认构造** 之外的其它 **五人帮** 的平凡性判断：只有那五者都被判断为平凡的，才为真。

而后者，则必须 **六大金刚** 统统是平凡的，才为真。


而前者对于框架尤其有价值的地方是：如果它断言为真，则使用 ``::memcpy`` 进行对象拷贝必然是安全的。 但这并不意味着它断言为假， ``::memcpy`` 则是不安全的。毕竟那是一个在进一步信息缺失的情况下, 只能最苛刻保守地必然保证copy安全的条件。如果一个框架，能够获得更多的信息，则无需这么严苛的条件也可以进行安全的拷贝。而程序员自身是拥有信息最多的，上述五个条件即便一个都不成立，程序员也可能保证某个类 ``::memcpy`` 是安全的。

.. important::

   - 析构的平凡性影响所有构造的平凡性;
   - 其它五者的平凡性各自独立;
   - trivially_copiable是在没有进一步的信息的情况下，能保证拷贝安全。
   - trivially_copiable要求除了默认拷贝之外的其它五者必须平凡；trivial则要求全部平凡。
   
