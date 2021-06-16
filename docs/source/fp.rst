C++编译时元编程（一）
================================

``C++`` 编译时元编程，是对 **类型** 和 **值** 的计算。类型自不必说，不存在 ``mutable`` 的可能性；而数值，``C++`` 也规定了
必须是常量，即 ``immutable`` 的数值即对象。而任何基于常量的计算，如果其计算能力是图灵完备的，那么其从实际效果上，必然与
函数式编程是等价的。

为了理解 ``C++`` 编译时元编程的思想，最好有一门函数式编程语言做为引导。最为知名的函数式编程语言 ``Haskell`` 是一个直觉上最佳的选择。
不幸的是，由于 ``C++`` 编译时，不仅仅可以操纵 **数值** ，还可以操纵 **类型** ，而这两者高度融合在一个体系中，没有清晰界限。
但 ``Haskell`` 对于类型和数据区分的非常清楚：其每个数据都有自己的类型，但参与计算的是数据，没有计算类型的能力。
而 ``Agda`` 的类型系统高了一个层次，在计算层面，数值和类型的边界被消除，拥有同等的计算能力。因而，本文主要通过 ``Agda`` 来做为引导，
来理解 ``C++`` 编译时元编程的思想。

List
----------------

我们先通过一段 ``Agda`` 代码来熟悉其语法和语意：

.. code-block:: agda

   data List (A : Set) : Set where
     []   : List A
     _::_ : A -> List A -> List A


这段代码里，``data`` 说明这是在定义一个数据类型，其名字是 ``List`` ， 而这个类型，需要另外一个类型做为输入，即 ``A`` ，而
``A`` 的类型为 ``Set`` ；而被定义的类型： ``List``， 其类型也是 ``Set`` 。

在类型系统理论中，每一个类型都是一个 **集合** ，比如：``bool`` 是一个集合，集合里的元素是其 **值域** ： ``true`` 和 ``false`` 。
而 ``int`` 则是整个整数集合。加法类型，即 ``C/C++`` 中的 ``union`` ，其 **值域** 则是 ``union`` 中每种类型 **值域** 的并集
（这就是为何被称做加法类型）；而乘法类型，即 ``C/C++`` 中的 ``struct`` ，其 **值域** 则是 ``struct`` 中每个 ``field`` 的
**值域** 相乘 。总之，不难理解，每一个类型都是一个集合。

但所有类型放在一起，也是一个集合。这个集合被称做 ``Set1`` 。之所以被叫做 ``Set1`` ，因为理论上，所有的
``Set1`` 也是一个集合，那个集合被称做 ``Set2`` ，从而可以 ``Set3, ..., SetN, ...`` 无穷的递归上去。

当然，我们现实中的类型系统，到 ``Set1`` 即足够了。所以上面代码中的 ``Set`` ，就是 ``Set1`` ，即所有类型的集合。因而，任何时候
你看到一个符号的类型是 ``Set`` ，那就意味着那个符号是一个类型。

接着看上面的代码。第 2 行和第 3 行，分别定义了两个 ``构造函数`` ：

1. 第一个构造了一个空列表，其类型当然是 ``List A`` ；
2. 第二个构造函数有两个参数： 类型分别为 ``A`` 和 ``List A`` ，
   即把一个 ``A`` 类型的数据追加到列表前面，得到计算结果：一个新的列表。
   这就是 ``A -> List A -> List A`` 的含义。


如果我们把上述代码直接映射到 ``C++`` ，就是下面的代码：

.. code-block:: c++

   template <typename A>
   struct List {
      List();
      List(A, List<A>);
   };

请花上一点时间，仔细对照这两段代码。它们之间的语意映射关系相当直接和清楚。
这其中，``typename`` 正是 ``Agda`` 中的 ``Set`` 。另外， ``C++`` 的构造函数的返回值类型正是其构造的类型本身，因而无须描述。

你或许会感叹 ``Agda`` 可以直接使用符号来定义构造。但那不是本文的重点。

当然，``C++`` 只是那么描述，是无法完成一个 ``List`` 真正的职责的。下面给出一个可以工作的实现：

.. code-block:: C++

   template<typename T, size_t N = 0>
   struct List {
     const T head;
     const List<T, N-1> tail;
   };

   template<typename T>
   struct List<T, 0> {};

这里通过 ``模版部分特化`` 的方式实现 ``if-else`` 逻辑。而这也正是函数式编程的主要方式：通过模式匹配选择不同的函数实现。比如：

.. code-block:: haskell

   fib   :: (Integral a) => a -> a
   fib n = (fib n-1) + (fib n-2)
   fib 1 = 1
   fib 0 = 0

这是一段 ``Haskell`` 代码，其中 ``a`` 代表这是一种范型参数，其属于 ``Integral`` TypeClass 。 而对应的 `C++` 实现为：

.. code-block:: c++

   template <std::integral auto N>
               constexpr auto fib    = fib<N-1> + fib<N-2>;
   template <> constexpr auto fib<1> = 1;
   template <> constexpr auto fib<0> = 0;

其中 ``std::integral`` 是 ``C++20`` 引入的 ``concept`` ，它比 ``Haskell`` 的 ``TypeClass`` 更为强大。但在本例中，起到的作用
一样。

但这个例子只是通过模式匹配在做 **数值** 演算。而对于 ``List`` 的例子，我们则是通过模式匹配进行类型选择。从本质上理解，如果模糊
数值和类型的差异，那么类模版也是一个函数。比如，下面的模版类：

.. code-block:: C++

   template <typename T, int I>
   struct Class {
      using type = T;
   };

其语意上，是下面的类 ``agda`` 语法描述（并不是真正的语法，因为 ``agda`` 没有 ``struct/class`` ）：

.. code-block:: agda

  Class     : (T : Set) -> int -> Set
  Class T I = struct { using type = T; }

即, 模版名字是函数名，其有两个参数，其中 ``T`` 通过花括号里 ``{T : Set}`` 说明 ``T`` 是一个类型。其参数为 ``T`` 和 ``int``
类型的数值 ``I`` ，函数的求值结果是一个类型：即后面的结构体内容定义。

因而，上面的对于 ``List`` 的定义，转化为类 ``agda`` 语法为：

.. code-block:: agda

  List     : (T : Set) -> size_t -> Set
  List T N = struct { const T head; const List<T, N-1> tail; }
  List T 0 = struct { }

通过不同的输入参数，我们匹配到了不同函数，返回了不同的类型。空列表为空实现，非空列表才会有 ``head`` 和 ``tail`` 。

将类模版理解为函数，将模版特化看作函数调用的模式匹配，这就把对于数值的计算，和对于类型的计算，完全统一在一起。这会极大的拓展对于类型
操作能力的理解。要知道，``C++`` 范型对于类型的操作能力是 **图灵完备** 的。不要只是把它当作简单的实例化一个容器那样的基本泛型，否则你
会错过 ``C++`` 最为强大，也最为精彩的能力。


我们接着实现上面的 ``List`` 。为了让用户可以不要在每次使用 ``List`` 时都要指明类型，我们定义两个 ``Deduction Guide`` ，
而第 2 个正是 ``Agda`` 例子中的第 2 个构造。而另外一个构造，则是对只有一个元素情况下的简便写法。
至于空列表构造，``C++`` 已经帮我们生成了默认构造，我们无须再写。

.. code-block:: C++

   template<typename T>
   List(T) -> List<T, 1>;

   template<typename T, size_t N>
   List(T, List<T, N>) -> List<T, N+1>;

这里如果不使用 ``Deduction Guide`` ，换成构造函数，则是如下写法：

.. code-block:: c++

   template<typename T, size_t N = 0>
   struct List {
     List(T head) : head{head}, tail{} {}
     List(T head, List<T, N-1> tail) : head{head}, tail{tail} {}

     const T head;
     const List<T, N-1> tail;
   };

很明显，这种写法要啰嗦的多。毕竟都是非常平凡的构造，写起来很无聊。另外，最重要的是，这样的写法，``C++`` 无法自动推演
出来 ``N`` 的值。因为构造函数的参数 ``List<T, N-1>`` 里，``N`` 处于一个计算表达式里。这在 ``C++`` 的定义中属于
不可推演上下文。

13.10.2.5 [temp.deduct.type]:
  A ``non-type template argument`` or an array bound in which a ``subexpression`` references a template
  parameter.

另外，``Deduction Guide`` 本身并不是构造函数。此处之所以通过 ``Deduction Guide`` 就可以构造，是因为 ``List`` 类型本身
是一个 **聚合** (Aggregate) ，聚合本身就可以直接构造其成员。比如下面的聚合以及初始化：

.. code-block::

   struct Foo { int a; int b; };

   Foo foo1 = { 1, 2 }; // a=1, b=2
   Foo foo2 = { 1 };    // a=1, b=0

所以，``Deduction Guide`` 并没有创建任何构造函数，而只是根据 ``Deduction Guide`` 的指导，在调用聚合的初始化而已。

下面我们再定义与空列表有关的类型和常量：

.. code-block:: c++

   template<typename T>
   using Nil_t = List<T, 0>;

   template<typename T>
   constexpr Nil_t<T> Nil{};

有了 ``Deduction Guide`` 的指导， 和 ``Nil`` 常量的辅助，我们就可以定义 `List` 常量了：

.. code-block:: C++

   constexpr auto emtpy = Nil<int>;                   // int 型空列表，由于类型无法推演，必须明确指明
   constexpr auto list1 = List{1, List{2, List{3}}};  // 构造 1::2::3::Nil

从中，你可以清晰的看出函数式语言中的 ``List`` 就是这样的递归构造。``Agda`` 在构造一个 ``list`` 时，则是如下语法：

.. code-block:: agda

  let emtpy = []
  let list1 = 1 :: 2 :: 3 :: []

明显比我们上面的定义看起来要清晰。当然 ``C++`` 也可以重载操作符，比如：

.. code-block:: C++

   struct NilList {};
   constexpr NilList nil = {};

   template<typename A, size_t N>
   constexpr auto operator>>=(const A& value, const List<A, N>& list) -> List<A, N+1> {
     return List{ value, list };
   }

   template<typename A>
   constexpr auto operator>>=(const A& value, const NilList&) -> List<A, 1> {
      return List{ value };
   }

然后，我们就可以做和 ``Agda`` 类似的写法：

.. code-block:: C++

  constexpr auto list1 = 1 >>= 2 >>= 3 >>= nil;

之所以选择这个符号，因为 `C++` 只有 ``@=`` (其中 ``@`` 代表 ``+``, ``-`` , ``>>`` 等二元操作符）是右结合的。

另外，你会发现 ``nil`` 没有指明任何类型信息。而不像之前必须指明类型： ``Nil<int>`` 。这是因为，在它所在的
``operator>>=`` 环境里，``List`` 的类型可以从做左边的操作数 ``3`` 获取到。可以回到 ``operator>>=`` 里理解这一点。
如果没有上下文可以推演类型，则仍然必须亲自指明类型。

如果你还想更加简洁，则可以使用变参模版大法：

.. code-block:: C++

  template<auto H, auto ... RESTs>
  constexpr auto makeList                   = List{H};

  template<auto H, auto H1, auto ... RESTs>
  constexpr auto makeList<H, H1, RESTs...>  = H >>= makeList<H1, RESTs...>;

这是一个完全递归的计算，典型的函数式计算方式。另外，``makeList`` 从参数上约束了必须至少有一个元素，否则在空列表的情况下，
其类型由于缺乏上下文而无法推导。

现在，用户就可以非常简单的创建列表了：

.. code-block:: c++

   constexpr auto list1 = makeList<1,2,3,4>;


下面我们来看与 ``List`` 有关的操作。比如最典型的 ``map`` 操作。下面是 ``Agda`` 的实现：

.. code-block:: agda

   map             : {A B : Set} -> (A -> B) -> List A -> List B
   map f []        = []
   map f (x :: xs) = f x :: map f xs

第一行类型声明。其意思是：有两个类型 ``A`` 和 ``B`` ，函数的输入参数有两个 : 第一个参数 ``(A->B)`` ，这是从 ``A`` 类型到 ``B`` 类型
的映射函数，``List A`` 是一个元素为 ``A`` 类型的 ``List`` ，函数的求值结果是元素类型为 ``B`` 的 ``List`` 。

``C++`` 的实现非常类似：

.. code-block:: c++

   template<typename A, typename B>
   constexpr auto map(Nil_t<A>, auto (*f) (A) -> B) -> Nil_t<B> {
      return Nil<B>;
   }

   template<typename A, typename B, size_t N>
   constexpr auto map(List<A, N> xs, auto (*f) (A) -> B) -> List<B, N> {
      return f(xs.head) >>= map(xs.tail, f);
   }

然后，你就可以这样使用：

.. code-block:: c++

   constexpr auto result = map(makeList<1,2,3>, +[](int value) {
      return double(value + 1) * 1.2;
   });

你或许已经注意到，我们定义的所有变量和函数都有 ``constexpr`` 声明，因为我们在做编译时的计算，只能是常量。编译时计算是完全
没有副作用的。并且如果你的计算代码使用了任何标准中的未定义行为，都会导致编译出错。运行时计算则不会如此。


现在，我们再来定义另外一个 ``List`` 操作函数：将两个 ``List`` 衔接在一起。我们先来看 ``Agda`` 的实现：

.. code-block:: agda

   _++_            : {A : Set} -> List A -> List A -> List A
   [] ++ ys        = ys
   (x :: xs) ++ ys = x :: (xs ++ ys)

这个函数的类型很容易懂，不再赘述。其中新的元素是 ``_++_`` ，这是这个函数的名字，两边的下划线说明这是一个中位操作符。所以其下面
定义函数实现时，也直接使用了中位操作方式。

``C++`` 的实现则是重载操作符。但算法一摸一样：

.. code-block:: c++

   template<typename A, size_t N>
   constexpr auto operator+(const Nil_t<A>&, const List<A, N>& rhs) -> List<A, N> {
      return rhs;
   }

   template<typename A, size_t M, size_t N>
   constexpr auto operator+(const List<A, M>& lhs, const List<A, N>& rhs) -> List<A, M + N> {
      return lhs.head >>= (lhs.tail + rhs);
   }

注意，``C++`` 的实现里，模版参数多了 ``size`` 参数，因为它是 ``C++`` 实现的 ``List`` 类型的一部分，但它
属于自动推演参数，用户永远不需要亲自指定它。

然后用户就可以这么使用：

.. code-block:: c++

   constexpr auto result1 = nil + makeList<1, 2, 3>;
   constexpr auto result2 = makeList<'a', 'b', 'c'> + makeList<'d','e'>;

本文中 ``List`` 的例子，展示了在 ``C++`` 编译时元编程时，和函数式编程完全一样的思路。当然，你永远不会在现实项目中
使用 ``List`` 这样低效的结构。有很多支持常量计算的数据结构才是你真正应该选择的。

.. Important::

   - ``C++`` 编译时元编程都是常量语意；
   - **类型** 与 **值** ，在 ``C++`` 编译时元编程的世界里，从概念上没有本质区别。``typename`` 是类型的 ``Set`` 。
   - ``C++`` 的类模版也是函数语意；其求值结果的类型是 ``Set`` ，即类型；
   - **模式匹配** ，**递归** ，是函数式编程处理条件选择和循环问题的典型手段；同样也是 ``C++`` 编译时计算的主要手段。




TypeList
----------------------

自从 ``C++11`` 引入了变参模版，极大的增强了范型编程的能力。这就意味着，我们在前面的 **数值** 列表，现在有了 **类型** 列表。因而，
在实际项目中，我们也需要对类型列表有着和类型列表一样的操作。

Elem
+++++++++++++++++++++

比如，我们想从一个 **类型列表** 中取出第 ``N`` 个类型：

.. code-block:: c++

   template<size_t N, typename ... Ts>
   struct Elem;

   template<size_t N, typename H, typename ... Ts>
   struct Elem<N, H, Ts...> {
      using type = typename Elem<N-1, Ts...>::type;
   };

   template<typename H, typename ... Ts>
   struct Elem<0, H, Ts...> {
      using type = H;
   };

然后，我们再定义一个别名，让用户使用时可以有更简单的表达式：

.. code-block:: c++

   template<size_t N, typename ... Ts>
   using Elem_t = typename Elem<N, Ts...>::type;

如下的 ``Agda`` 伪代码，反映了上述同样的算法：

.. code-block:: c++

   Elem           :: size_t -> [Set] -> Set
   Elem N (H::Ts) = Elem (N-1) Ts
   Elem 0 (H::Ts) = H

当然，代码中没有明确应对 ``N`` 值超过列表长度的情况，在 ``C++`` 下，这回导致一个编译错误。而这正是我们想要的结果。

另外，你如果仔细观察，会发现 ``Elem`` 模版里只有一个元素，即 ``type`` 。这种情况下，其实 ``Elem`` 类模版是没有价值的；因为它
一则是静态的，即没有人会用它所实例化得到的类型去创建对象；二则，它里面只有一个静态元素，并不起到包的作用（当一个类，或者模版里
有多个元素时，并且这些元素都是静态的，那么类某种程度就像是一个包，或者名字空间一样）。

因而，如果我们可以直接这么写，就可以让代码更加简洁：

.. code-block:: c++

   template<size_t N, typename ... Ts>
   using Elem = typename Elem<N, Ts...>;

   template<size_t N, typename H, typename ... Ts>
   using Elem<N, H, Ts...> = typename Elem<N-1, Ts...>;

   template<typename H, typename ... Ts>
   using Elem<0, H, Ts...> = H;

但很不幸， ``using`` 一个类型，在 ``C++`` 里属于 **别名** (Alias)，而别名模版只是别名而已，不支持特化。

所以，我们还是只能使用类模版的方式。但对比两者，我们我们可以看出，我们真正关心的是其中的 ``type`` 。而不是外面的类模版。所以后者
才更真实直接的在表达我们本来的语意。之所以采取前者那种间接表达方式，是因为 ``C++`` 的限制。

或许未来 ``C++`` 标准委员会意识到这是一种广泛的需求，因为这是 ``C++`` 泛型编程极为常见的需求，标准库里到处都是这种用法。

事实上，在 ``C++11`` 之前，你只有两种模版类型：类模版和函数模版。因而，对于处理结构性问题时，只有类模版一条途径，哪怕只是简单的值计算。
我们还是举之前 `斐波那契数列` 的例子，在 ``C++11`` 之前，

.. code-block:: c++

   template <unsigned int N>
   struct Fib {
      static const unsigned int value = Fib<N-1>::value + fib<N-2>::value;
   }

   template <> struct Fib<1> {
      static const unsigned int value = 1;
   }

   template <> struct Fib<0> {
      static const unsigned int value = 0;
   }

同样的， 模版 ``Fib`` 存在的唯一目的，是为了提供静态的 ``value`` ，（正如上面为了提供静态的 ``type`` ）。
那时候，``C++`` 也不支持 ``constexpr`` ，所以也无法通过函数来进行这样的编译时值计算。因而只能以这样的方式实现。

随后，``C++11`` 引入了 ``constexpr`` ，而 ``C++14`` 终于提供了  **变量模版** 。于是程序员终于可以在意图只是
通过模版定义单个常量时，可以直接使用更加简洁的方式，直接表达的自己意图。

值的枷锁已经被解除，单个类型的枷锁或许很快也会被打破。要知道，在 ``C++11`` 之前，甚至 **类型别名模版** 都不支持。

但无论如何，我们必须明确，``Elem`` 的例子里，如果将 ``Elem`` 看作一个函数，从语意上，函数真正的求值结果是里面
的 ``type`` ，而不是外面的 ``struct/class`` 。


Drop
+++++++++++++++++++++

现在，我们再来实现另外一个经典函数：``drop`` ，即将列表中的前 ``N`` 个元素抛弃掉之后所得到的列表。

这从算法上和 ``Elem`` 极为相似，唯一的差别是，``Elem`` 只要第 ``N`` (从 0 开始计数) 的元素，而 ``Drop`` 则是抛弃掉
前 ``N`` 个元素（此时 ``N`` 不像 ``Elem`` 的 ``N`` 一样是索引，而是一个总数 ），得到一个列表。

结果是单个类型，还是一个类型列表，对于设计的影响完全不同。因为 ``C++`` 类型却可以指代，因而，才可以通过：

.. code-block:: c++

  template<typename H, typename ... Ts>
  struct Elem<0, H, Ts...> {
      using type = H; // 这里通过type指代
  };

  template<size_t N, typename ... Ts>
  using Elem_t = typename Elem<N, Ts...>::type; // 这里访问那个指代

但不幸的是，``C++`` 类型列表无法指代。你无法通过诸如：``using type... = Ts...`` 的方式，
来指代一个从模版参数传入的参数列表。因而，也就无法直接返回一个结果列表。

我们在之前已经看到，模版参数可以是 **类型** 或者 **数值** 。还有一种允许的模版参数类型就是 **模版** 。之前我们一直强调，
模版的语意是求类型的 **函数** ；这就意味着，一个函数的参数也可以是函数，而能将函数当作参数，或者能返回函数的函数，被称作
高阶函数。而允许高阶函数是函数做为一等公民的关键特征。与之对应，模版也是 ``C++`` 泛型编程的一等公民。

高阶函数(Higher Order Function):
  In mathematics and computer science, a higher-order function is a function that does at least one of the following:

  - takes one or more functions as arguments (i.e. procedural parameters),
  - returns a function as its result.

  All other functions are first-order functions

所以，对于刚才的问题，我们可以传入一个函数（也就是模版），其参数是一个变参（即类型列表），这样我们就可以把计算出来的参数列表做为结果
传递给那个模版，由那个模版根据调用者的需要，随意处理。下面是我们的实现：

.. code-block:: c++

   template<
      size_t                          N,
      template<typename ...> typename RESULT,
      typename                    ... Ts>
   struct Drop;

   template<
      size_t                          N,
      template<typename ...> typename RESULT,
      typename                        H,
      typename                    ... Ts>
   struct Drop<N, RESULT, H, Ts...> {
      using type = typename Drop<N-1, RESULT, Ts...>::type;
   };

   template<
      template<typename ...> typename RESULT,
      typename                        H,
      typename                    ... Ts>
   struct Drop<0, RESULT, H, Ts...> {
      using type = RESULT<H, Ts...>;
   };

   template<
      template<typename ...> typename RESULT>
   struct Drop<0, RESULT> {
      using type = RESULT<>;
   };

其中，``RESULT`` 就是用户指定的回调模版，而将 ``TypeList`` 传递给它之后，它就被实例化为一个类型，从而就得到了指代能力。

用 ``Agda`` 伪代码描述如下：

.. code-block:: c++

   Drop           :: size_t -> ([Set] -> Set) -> [Set] -> Set
   Drop N RESULT (H::Ts) = Drop (N-1) RESULT Ts
   Drop 0 RESULT (H::Ts) = RESULT H::Ts
   Drop 0 RESULT []      = Result []

当然，其实最后两种情况，从道理上是可以合并的，但是从 ``C++`` 模式匹配的角度，合并之后，``C++`` 无法判断两种情况那种更特别。
只有将 ``H`` , ``Ts...`` 展开写， ``C++`` 才能对比它和前面那个模版的特化度。

然后我们就可以定义 ``Drop_t`` 别名，以简化用户的表达式：

.. code-block:: c++

   template<
     size_t                          N,
     template<typename ...> typename RESULT,
     typename                    ... Ts>
   using Drop_t = typename Drop<N, RESULT, Ts...>::type;

我们之前已经谈到， ``Elem`` 和 ``Drop`` 的算法完全一直，无非就是所要的结果不同。因而，我们可以废弃掉之前 ``Elem`` 的实现，
复用 ``Drop`` 的实现，而复用的方式，是通过传入自己特定的 ``RESULT`` 函数。

.. code-block:: c++

   template<typename ... Ts>
   struct Head;

   template<typename H, typename ... Ts>
   struct Head<H, Ts...> {
      using type = H;
   };

   template<
     size_t N,
     typename ... Ts>
   using Elem_t = Drop_tt<N, Head, Ts...>;

我们传入的 ``RESULT`` 函数就是 ``Head`` ，它拿到了一个 ``TypeList`` 之后，只取出第一个，即 ``H`` ，而把其余的全部都丢弃掉。
而这正是如果利用这种回调机制操作类型的一个示例。

除了直接的回调方式，还有另外一种方式：先让 ``Drop`` 自身计算结束，然后返回给一个 **高阶模版** 。用户可以在那个时候，
通过这个 **高阶模版** ，以回调的方式获取结果：

.. code-block:: c++

   template<
      size_t       N,
      typename ... Ts>
   struct Drop {
      template<template<typename ...> typename RESULT>
      using output = RESULT<>;
   };

   template<
      typename     H,
      typename ... Ts>
   struct Drop<0, H, Ts...> {
      template<template<typename ...> typename RESULT>
      using output = RESULT<H, Ts...>;
   };

   template<
      size_t       N,
      typename     H,
      typename ... Ts>
   struct Drop<N, H, Ts...> {
      template<template<typename ...> typename RESULT>
      using output = typename Drop<N-1, Ts...>::template output<RESULT>;
   };

其中， 模版 ``output`` 即是计算返回的高阶模版。 而回调的时机则推迟到：

.. code-block:: c++

   template<
     size_t                          N,
     template<typename ...> typename RESULT,
     typename                    ... Ts>
   using Drop_t = typename details::Drop<N, Ts...>::template output<RESULT>;

这种返回 **高阶模版** 的做法，让模版计算和 ``lambda`` 一样，拥有了 **闭包** ，即计算时自由访问环境的能力。我们先来看
一个 ``C++`` ``lambda`` 的例子：

.. code-block:: c++

   auto l1 =
   [](int a, int b) -> int {
      return [=](int c) -> int {
         return a + b + c;  // 访问 a, b
      }
   }

   auto l2     = l1(10, 20); // l2 is a lambda
   auto result = l2(30);

对比一下模版的例子：

.. code-block:: c++

   template<
      size_t       N,
      typename     H,
      typename ... Ts>
   struct Drop<N, H, Ts...> {
      template<template<typename ...> typename RESULT>
      using output = // 访问外围模版的 Ts...
        typename Drop<N-1, Ts...>::template output<RESULT>;
   };

   using T1 = Drop<1, int, double, char>;  // 调用Drop得到 T1 类型
   using T2 = T1::template output<Result>; // 调用T1类型的 output模版，得到我们的结果

.. Important:

   深刻理解 **模版** 就是 ``lambda``，它可以是高阶 ``lambda`` ，并拥有和 ``lambda`` 一样的闭包能力，
   会帮助你充分利用 ``C++`` 模版对类型进行计算的能力。

Transform
+++++++++++++++++++++

现在我们再实现另外一个非常经典的函数 ``map`` ，由于在 ``C++`` 中， ``map`` 在标准库里代表一个 ``k/v`` 容器，而将 ``fp`` 领域
里的 ``map`` 称做 ``transform`` ，我们也继续遵守这个习俗。

``Transform`` 操作是将一组类型，通过一个转化函数，转化成另外一组相同数量的其它类型。用 ``Agda`` 伪代码描述如下：

.. code-block:: c++

   Transform  :: [Set] -> (Set -> Set) -> [Set]


注意，这里面有两个 ``TypeList`` ，一个是输入，一个是输出。而两者的内容经过 ``(Set -> Set)`` 转换后，很可能是完全不同的。

虽然之前的 ``Drop`` 也是输入一个 ``TypeList`` ，输出一个 ``TypeList`` ，但后者只是前者的一部分。
因而事实上只需要在一个 ``TypeList`` 上操作即可。

对于 ``Transform`` 算法来说，它一边从输入列表中读取单个元素，将其转化后，不断追加新生成的输出列表上。另外，由于类型列表无法指代，
所以，不可能使用诸如下面的算法：

.. code-block:: agda

   {- 后面的 map f xs 有一个返回输出，但在 `C++`` 下无法通过这种方式直接输出一个列表 -}
   map f (x :: xs) = f x :: map f xs

因而，我们必须将输出的列表随时保存在模版参数上，然后将最终结果想 ``Drop`` 算法一样，传递用户的回调。

同时，``C++`` 有另外一个约束，即类模版的变参列表只允许有一个，并且必须放在最后。（不知道未来 ``C++`` 是否可以放开这样的限制，
如果两个类型列表中，存在一个非类型参数，其实是可以区分的）。所以这个宝贵的变参列表位置一旦留给输出，那么输入列表该放在何处？

答案是，将其保存在另外一个模版里，其操作方式，应该和我们最初定义 ``List`` 非常类似：

.. code-block:: c++

   template<typename ... Ts>
   struct TypeList {};

   template<typename H, typename ... Ts>
   struct TypeList<H, Ts...> {
      using Head = H;
      using Tail = TypeList<Ts...>;
   };

这个定义精准的反映了一个 ``List`` 的本质，这是一个递归结构。因而，你总是可以通过如下方式读取任何元素：

.. code-block:: c++

   using list = TypeList<int, double, char>;

   list::head                     // int
   list::tail::head               // double
   list::tail::tail::head         // char
   list::tail::tail::tail::head   // 编译出错

   TypeList<>::head               // 编译出错

所以，我之前其实撒谎了。我一直在宣称 ``C++`` 的 ``TypeList`` 无法指代。其实指的是 ``Ts...`` 形式的列表无法指代。但一旦
将其保存在刚刚定义的 ``TypeList`` 里，它就可以指代了。

但是，以 ``TypeList<Ts...>`` 的方式给用户，但需用需要的是 ``Ts...`` ，最终用户还是必须通过回调的方式才能使用 ``Ts...`` 形式，
（这个我们后面会谈到），既然迟早都要回调，那还不如让用户完全意识不到 ``TypeList<Ts...>`` 这样一个中间结构，尽早回调。

下面就是 ``Transform`` 的实现：

.. code-block:: c++

   template<
      typename                    IN,
      template<typename> typename F,
      typename = void,
      typename                ... OUT>
   struct Transform {
      using type = TypeList<OUT...>;
   };

   template<
      typename                    IN,
      template<typename> typename F,
      typename                ... OUT>
   struct Transform<IN, F, std::void_t<typename IN::Head>, OUT...> {
      using type =
         typename Transform<
            typename IN::Tail,
            F,
            void,
            __TYPE_LIST_APPEND(OUT..., typename F<typename IN::Head>::type)
         >::type;
   };

代码看起来很长，但只是只是参数列表很长，真正的有逻辑的地方只有三处：

1. 第一个模版是整个 ``Transform`` 结束时的情况。所以将 ``OUT...`` ，即转换最终得到的输出列表传递给用户的回调模版。
2. ``std::void_t<typename IN::Head>`` 是一个 ``SFINAE`` 条件，即要求输入列表中还有 ``Head`` ，如果还存在，
   则说明 ``IN`` 列表还没有遍历结束；因而，
3. ``OUT..., typename F<typename IN::Head>::type`` 将通过 ``F`` 转换后的类型，追加到输出列表 ``OUT`` 后面。
   注意，其中的宏 ``TYPE_LIST_APPEND`` 什么都没做，只是为了表明代码意图。

.. Important:

   你应该已经注意到：

   - 将 ``...`` 放到变量 **左侧** 是 **打包** (pack) 语意；
   - 将 ``...`` 放到变量 **右侧** 是 **解包** (unpack) 语意；

   另外，不像函数式语言里的 ``list`` ，只能自然地在头部追加元素，即 ``x:list`` ；如果想往尾部追加，
   则是一个 ``list`` 衔接操作，即 ``list ++ [x]`` 。 ``C++`` 的 ``type list`` 非常自由，
   如果在头部追加，则是 ``X, Ts...`` ，尾部追加，则是 ``Ts..., X`` ，两个 ``type list`` 衔接，
   则是 ``Ts1..., Ts2...`` 。

上述算饭，用 ``agda`` 伪代码表现即为：

.. code-block:: agda

   Transform              : [Set] -> (Set -> Set) -> (Set -> Set) -> [Set]
   Transform []     F OUT = OUT
   Transform (x:xs) F OUT = Transform xs F (xs ++ [F x])

当然这只是内部实现，给用户提供的真正接口是：

.. code-block:: c++

   template<
     template<typename>     typename F,
     template<typename ...> typename RESULT,
     typename                    ... IN>
   using Transform_t =
     typename Transform<
       TypeList < IN...>,          // 将 IN... 保存到 TypeList
       F,
       void                        // 为了SFINAE条件判断
       __EMPTY_OUTPUT_TYPE_LIST___ // 输出列表最初为空
     >::type::template output<RESULT>;

所以，用户真正提供的参数只有三个， ``F`` 转化函数， ``IN`` 输入列表，以及用来回传最终结果回调模版 ``RESULT`` 。 而
宏 ``__EMPTY_OUTPUT_TYPE_LIST___`` 背后什么都没有，正如一个 ``Ts...`` 形式的列表如果为空是，就什么都没有一样，
这样在阅读代码时，很容易忽略这里还有一个空参数。而通过 ``__EMPTY_OUTPUT_TYPE_LIST___`` 则可以起到提示的作用。

``Transform`` 非常有用，比如，我们想给一个类型加上 ``Wrapper`` ，

.. code-block:: c++

   template <typename T> struct Wrapper {...};

   template <typename ... Ts>
   struct Bar {
      // Ts... 里每一个类型都是 Wrapper<T> 的形式。
   };

   template <typename ... Ts>
   struct Foo {
      template <typename T>
      struct AddWrapper { using type = Wrapper<T>; };

      using bar = Transform_t<AddWrapper, Bar, Ts...>;
      // ...
   }

或者，识别出一组类型里，所有继承自某个类的类型：

.. code-block:: c++

   template <typename T, typename = void>
   struct ActionTrait {
      using type = void;
   };

   template <typename T>
   struct ActionTrait<T, std::enabled_if_t<std::is_base_class_v<Action, T>>> {
      using type = T;
   };

   template <typename ... Ts>
   struct Bar {
      // Ts... 里，要么是 void, 要么是Action的子类
   };

   template <typename ... Ts>
   struct Foo {
      using bar = Transform_t<ActionTrait, Bar, Ts...>;
      // ...
   }


Split
+++++++++++++++++++++

现在我们再来实现 ``split`` 。其语意是在第 ``N`` 个位置，将一个输入列表一分为二。

这个需求，又增加了新的困难，``Transform`` 只要求输出一个列表，但这要要求输出两个。而模版的变参列表只允许有一个。怎么办？

首先，在有输出的情况下，用户必然是要传入回调。既然现在有两个输出，那么用户自然就需要两个回调。既然一个模版只允许有一个变参，
那我们就分别两个回调传递个两个变参模版，一个给 ``TypeList<Ts...>``，一个给计算模版。

所以，我需要先改造我们的 ``TypeList<Ts...>`` ，重新定义新的形式：

.. code-block:: c++

   template<typename ... Ts>
   struct TypeList {
     template<template <typename ...> typename RESULT>
     using output = RESULT<>;
   };

   template<typename H, typename ... Ts>
   struct TypeList<H, Ts...> {
     using Head = H;
     using Tail = TypeList<Ts...>;

     template<template <typename ...> typename RESULT>
     using output = RESULT<H, Ts...>;
   };

注意，这与之前的 ``TypeList`` 的唯一差别是多了一个高阶模版 ``output`` ，其用法和语意与我们在 ``Transform`` 一节讨论的一样。

而 ``Split`` 的实现，则关注在另外一个输出列表上：

.. code-block:: c++

   template<
      size_t       N,
      typename     IN,
      typename ... OUT>
   struct Split {
      using type = typename Split<
            N - 1,
            typename IN::Tail,
            __TYPE_LIST_APPEND(OUT..., typename IN::Head)
         >::type;
   };

   template<
      typename     IN,
      typename ... OUT>
   struct Split<0, IN, OUT...> {
      struct type {
         using first  = TypeList<OUT...>;
         using second = IN;
      };
   };

第一个模版处理的是 ``N`` 还没有递减到 ``0`` 的中间过程，所以继续递归。注意，那里有两个递归：一是 ``typename IN::Tail`` ，
代表输入列表也在不断的通过递归抛弃 ``Head`` ；而另一个递归则是 ``Split`` 自身的递归，
``__TYPE_LIST_APPEND(OUT..., typename IN::Head)`` 则是将 ``IN`` 抛弃的 ``Head`` 拿过来，追加到第一个输出列表的
后边。

所以，每一次递归，都像是游标在原始列表上移动，不断把后半部分的第一个元素，变为前半部分的最后一个元素。

而第二个模版则是已经到达了分割点，
需要生成输出结果。因为有两个输出，因而分别被定义为 ``first`` 和 ``second`` 。前一个，
是将生成的 ``OUT...`` 打包传递给 ``RESULT_1`` ，后半部分，则向 ``IN`` 索要；而 ``IN`` 正是我们之前定义
的 ``TypeList`` 。

最终，上述的内部算法，在如下代码处得到应用：

.. code-block:: c++

   template<
      size_t N,
      template<typename ...> typename RESULT_1,
      template<typename ...> typename RESULT_2,
      typename ... IN>
   class Splitter {
      using RawType =
        type_list::Split_t
            < N
            , TypeList<IN...>                 // 将IN...传入，得到输入列表
            __EMPTY_OUTPUT_TYPE_LIST___       // 前半部分最初列表为空
            >;
   public:
      using type = __TL_make_pair(typename RawType::first::template output<RESULT_1>,
                                  typename RawType::second::template output<RESULT_2>);
   };

   template<
      size_t N,
      template<typename ...> typename RESULT_1,
      template<typename ...> typename RESULT_2,
      typename ... IN>
   using Split_t = typename Splitter<N, RESULT_1, RESULT_2, IN...>::type;

``Split_t`` 的输入参数，清晰的反映了用户需要指定的信息: ``N`` 分割的位置；``RESULT_1``, ``RESULT_2`` 分别为分割后两个
部分的回调。``IN`` 则是需要分割的输入列表。

.. Important::

   - **类模版** 的参数列表只允许有一个变参列表；因而，当需要多个变参列表时，则需要通过其它模版相助。


Fold
+++++++++++++++++++++

``fold`` 是 ``list`` 非常重要的一个操作。其语意是遍历整个 ``list`` ，两两计算，最终得到一个结果。

它有两个版本：从左边 ``fold`` ，还是从右边 ``fold`` ，即：

.. code-block::

   (((x[1] op x[2]) op x[3]) op ...)      // 从左边开始fold
   (... op (x[n-2] op (x[n-1] op x[n])))  // 从右边开始fold

而两个版本，都分为 **有初始值** 和 **无初初始值** 两种情况，即：

.. code-block::

   (((init op x[1]) op [x2]) op ...)
   (... op (x[n-1] op (x[n] op init)))

``C++17`` 提供了 ``fold expression`` ，从而让用户不再像过去一样，必须通过类模版的递归演算，来计算一个类型列表相关的值。比如：

.. code-block:: c++

   template <typename ... Ts>
   struct Foo {
      enum { Sum_Of_Size = (0 + ... + sizeof(Ts) };
   };

这里用到的是，有初识值 ``0`` 的从左边开始的，操作为 ``+`` 的 ``fold`` 计算。其结果是列表中所有类型的大小的总和。

从这个简单的例子可以看出，``C++`` 的 ``fold expression`` 不只在做 ``fold`` ，还先做了 ``map`` ，本例中即 ``sizeof`` 。
所以，其实际上是 ``map-reduce`` ：先 ``map`` ，然后将 ``map`` 后的结果进行 ``fold`` 。

当然，对于 ``+`` 这种性质的计算，你也可以用从右边开始的 ``fold`` 。

.. code-block:: c++

   template <typename ... Ts>
   struct Foo {
      enum { Sum_Of_Size = (sizeof(Ts) + ... + 0) };
   };

如果你可以确保，输入的类型列表非空，你甚至不用写初识值，因而更加简洁：

.. code-block:: c++

   template <typename ... Ts>
   struct Foo {
      enum { Sum_Of_Size = (sizeof(Ts) + ... ) };
   };

但如果不能保证列表非空，则必须有初始值，否则，编译就会出错。（本身也的确让 ``fold`` 无法得到一个计算结果）

当然，``fold`` 的能力，不会只是像上述的加法一样简单。比如，我想求所有类型尺寸的最大尺寸：

.. code-block:: c++

   struct MaxSize {
      constexpr MaxSize(size_t size = 0) : size(size) {}
      constexpr operator size_t() const { return size; }
      size_t size = 0;
   };

   constexpr MaxSize operator<<(MaxSize maxSize, size_t size) {
      return std::max(maxSize.size, size);
   }

   template <typename ... Ts>
   struct Foo {
      enum { Max_Size = ( MaxSize{} << ... << sizeof(Ts) ) };
   };

这个例有三个关键点：

1. ``C++`` 的 ``fold expression`` 的操作必须是 ``C++`` 已经存在的二元操作符。几乎所有的二元操作符都可以用于
   ``fold express`` 。如果一个二元操作符的 ``builtin`` 语意不满足你要求，或无法计算你的类型，你可以针对你的类型
   重载某个二元操作符。
2. 为了让重载的二元操作符不要影响其它类型，你必须定义一个自己的类型，在本例中，就是 ``MaxSize`` ；
3. 任何一个可以在被编译时计算使用到的函数必须是 ``constexpr`` 。本例子中，其构造函数，及类型转换函数，
   都必须是 ``constexpr`` 。当然，本例中，``MaxSize`` 可以没有构造函数，那它将是一个 ``聚合`` 。
   那么使用它的地方都必须是 ``聚合`` 语法。比如：

.. code-block:: c++

   struct MaxSize {
      constexpr operator size_t() const { return size; }
      size_t size = 0;
   };

   constexpr MaxSize operator<<(MaxSize maxSize, size_t size) {
      return MaxSize{ std::max(maxSize.size, size) };
   }

   template <typename ... Ts>
   struct Foo {
      enum { Max_Size = ( MaxSize{} << ... << MaxSize{sizeof(Ts)} ) };
   };

这使用起来，麻烦一些，所以我们为 ``MaxSize`` 提供了 ``constexpr`` 构造函数。

如果参与 ``fold`` 演算的类型到值的映射，不像直接调用 ``sizeof`` 这么简单，
也可以使用模版变量来辅助：

.. code-block:: c++

   template <typename ... Ts>
   struct Foo {
      template <typename T>
      constexpr static size_t Size_Of  = std::is_base_of_v<Bar, T> ? sizeof(T) : 0;

      enum { Max_Size = ( MaxSize{} << ... << Size_Of<Ts> ) };
   };

其算法是，只计算 ``Bar`` 子类的最大尺寸，其它类型则不参与计算。

运行时（而不是我们上述编译时例子）也可以使用 ``fold expression`` ：

.. code-block:: c++

   struct Node {
     int value;
     Node* left;
     Node* right;
     Node(int i=0) : value(i), left(nullptr), right(nullptr) {}
     ...
   };

   auto left = &Node::left;
   auto right = &Node::right;
   // traverse tree, using fold expression:
   template<typename T, typename... TP>
   Node* traverse (T np, TP... paths) {
     return (np ->* ... ->* paths);
   }


或者，我们想在输出对象的时候，在后面增加一个空格：

.. code-block:: c++

   template<typename T>
   class AddSpace {
      AddSpace(T const& r): ref(r) {}
      T const& ref;
   };

   auto operator<< (std::ostream& os, AddSpace<T> s) -> std::ostream& {
      return os << s.ref << ' '; // output passed argument and a space
   }


   template<typename... Args>
   auto print (Args... args) {
      ( std::cout << ... << AddSpace(args) ) << '\n'; 
   }


可以看出，``C++17`` 推出的 ``fold expression`` ，极大的简化了程序员对于 **变参** 的计算。



但不幸的是，``fold expression`` 只能计算 **数值** ，而不能用来计算 **类型** （前面例子中与类型有关的计算，也是要把
类型映射到数值）。

所以，我们必须得自己实现一个：

.. code-block:: C++

   template
     < template<typename, typename> typename OP
     , typename                          ... Ts>
   struct FoldR;

   template
     < template<typename, typename> typename OP
     , typename                              ACC
     , typename                          ... Ts>
   struct FoldR<F, ACC, Ts...> {
      using type = ACC; // 列表为空，返回计算结果 ACC
   };

   template
     < template<typename, typename> typename OP
     , typename                              ACC
     , typename                              H
     , typename                          ... Ts>
   struct FoldR<OP, ACC, H, Ts...> {
      using type = typename OP<ACC, typename FoldR<OP, H, Ts...>::type>::type;
   };

这是一个右折叠算法。其中 ``OP`` 即二元操作，``ACC`` 代表 **累计值** ，``Ts...`` 即输入列表。

其算法用伪代码描述，即为：

.. code-block:: agda

   foldr                 : {A B : Set} → (A → B → B) → B → List A → B
   foldr op acc []       =  acc
   foldr op acc (x::xs)  =  x op (foldr op acc xs)

当然，从类型看，这个描述是计算值的，但无关紧要。

注意，``FoldR`` 的主模版里是没有 ``ACC`` 的，这就意味着，主模版没有特别为初始值预留参数。但别担心，这样的实现，同时支持
有初始值和无初始值两种场景：

.. code-block:: c++

   template
     < template <typename, typename> typename OP
     , typename                           ... Ts>
   using FoldR_t = typename details::FoldR<OP, Ts...>::type;

   template
     < template <typename, typename> typename OP
     , typename                               INIT
     , typename                           ... Ts>
   using FoldR_Init_t = FoldR_t<OP, Ts..., INIT>;

也就是说，当你有初始值时，做为 ``右折叠`` ，只需要将初始值追加到类型列表最后即可。

下面是 ``左折叠`` 的实现：

.. code-block:: c++

   template
     < template<typename, typename> typename OP
     , typename                          ... Ts>
   struct FoldL;

   template
     < template<typename, typename> typename OP
     , typename                              ACC
     , typename                          ... Ts>
   struct FoldL<OP, ACC, Ts...> {
      using type = ACC;
   };

   template
     < template<typename, typename> typename OP
     , typename                              ACC
     , typename                              H
     , typename                          ... Ts>
   struct FoldL<OP, ACC, H, Ts...> {
      using type = typename FoldL<OP, typename OP<ACC, H>::type, Ts...>::type;
   };

其算法用 ``Agda`` 代码描述如下：

.. code-block:: agda

   foldr                 : {A B : Set} -> (A -> B -> B) -> B -> List A -> B
   foldr op acc []       =  acc
   foldr op acc (x::xs)  =  foldl op (op acc x) xs

注意， ``左折叠`` 是一个 ``尾递归`` (tail recursion) 算法，因而可以进行优化，但 ``右折叠`` 则不是，因为其必须层层递归，将
右边的结果得到之后，才可以和左边一起进行 ``OP`` 计算，这从递归本质上，无法优化。

同样， ``左折叠`` 主模版也没有 ``ACC`` ，因为只需要在有 ``INIT`` 的情况，将 ``INIT`` 放在列表头即可：

.. code-block:: c++

   template
     < template <typename, typename> typename OP
     , typename                           ... Ts>
   using FoldL_t = typename details::FoldL<OP, Ts...>::type;

   template
     < template <typename, typename> typename OP
     , typename                               INIT
     , typename                           ... Ts>
   using FoldL_Init_t = FoldL_t<OP, INIT, Ts...>;

有了 ``Fold`` ，我们就可以进行这样的计算：

.. code-block:: c++

   template<typename T1, typename T2>
   struct Combine {
      struct type : private T1, private T2 {
        auto createAction(ID id) -> Action* {
           auto action = T1::createAction(id);
           return action == nullptr ? T2::createAction(tid) : action;
      };
   };

   using type = FoldL_t<Combine, Ts...>;

从而将一些列的 ``ActionCreator`` 折叠成一个 ``ActionCreator`` 。

Flatten
++++++++++++++++++

比如，有这样一个结构：

.. code-block:: c++

   Seq<int, Seq<double, Seq<short, float>, char>, long>

我们希望将内部的 ``Seq`` 展开到外部的 ``Seq`` 里，变为：

.. code-block:: c++

   Seq<int, double, short, float, char, long>

这就是经典的 ``list`` 里有 ``list`` ，里面的 ``list`` 里可以再有 ``list`` …… ，无论嵌套有多深，都可以通过
``flatten`` 操作将其展开到最外层的 ``list`` 里。即将一个树状结构转化为一个平面结构。

稍加思考，我们就知道这是一个 ``fold`` 操作，即遍历整个列表，将每一个元素递归性的进行 ``flatten`` ，
然后将得到到每个 ``list`` 不断连接，合成一个 ``list`` 。

我们知道 ``Fold`` 需要一个如下原型的 ``OP`` :

.. code-block:: c++

   template <typename ACC, typename T>
   struct OP;

即，将 ``T`` 和与前面的 ``ACC`` 进行某种计算，得到新的 ``ACC`` 做为结果。

而对于我们的 ``flatten`` 问题，传入的 ``T`` 需要 ``OP`` 将其展开成一个 ``Ts...``
（也可能只是 ``T`` ，如果其不是一个 ``List`` 的话）。

然后将得到的 ``T`` 或者 ``Ts...`` ，追加到 ``ACC`` 所代表的 ``Ts...`` 后面，得到一个新的 ``Ts...`` 。

这就意味着，``ACC`` 自身要么是一个 ``Ts...`` ，要么 ``保存`` 了一个 ``Ts...`` ，否则，上述算法不可能实现。

从 ``template <typename ACC, typename T> struct OP`` 的原型看， ``ACC`` 自身肯定不是 ``Ts...`` ，所以它
只能 ``保存`` 一个 ``Ts...`` ，并且这个 ``Ts..`` 还可以和另外一个 ``Ts...`` 进行合并。

问题是，怎么可能让一个 ``类型`` (原型里 ``ACC`` 是一个 ``typename`` ，代表 ``ACC`` 是 ``类型`` )
保存一个 ``Ts...`` ？我们之前早就讨论过， ``Ts...`` 是不可能直接指代的。

但我们也同样讨论过，模版具有 ``闭包`` 的性质，我们可以利用这个性质，结合 ``高阶模版`` ，就可以保存一个 ``Ts...`` ，并且这个
``Ts...`` 可以和其它的 ``Ts...`` 进行合并。这就是下面的定义：

.. code-block:: c++

   template<typename ... Ts1>
   struct Accumulator {
      template<typename ... Ts2>
      using type = Accumulator<Ts1..., Ts2...>;
   };

外面的是一个 ``Accumulator`` ，是一个 ``高阶模版`` ，其参数用来 ``保存`` 一个 ``Ts1...`` ，
其返回的 ``type``  是另外一个模版，其职责是将其环境中 ``Ts1...`` 和用户新传入的 ``Ts2...`` 进行连接，
得到一个新的 ``Accumulator`` ，这个结构是不是很漂亮？

另外一个新的问题是，我们如何区分一个类型是可展开的？而另外一些类型不可以？很简单，要求可展开的类型都继承这样一个类：

.. code-block:: c++

   struct FlattenableSignature {};

   template<typename ... Ts>
   struct Flattenable : FlattenableSignature {
      template<template<typename ...> typename RESULT>
      using OutputAllTypesTo = RESULT<Ts...>;
   };

其中 ``FlattenableSignature`` 是一个签名类，用于判别，而 ``Flattenable`` 也是高阶模版，
它让外界可以通过 ``OutputAllTypesTo`` ，以回调的方式得到它的 ``Ts...`` 。

另外，注意，无论是 ``FlattenableSignature`` ，还是高阶模版 ``Flattenable`` 都没有任何数据成员，也没有任何
虚函数或虚基类，所以继承它们不会增加任何子类自身的开销。

下面定义我们真正符合 ``Fold`` 要求的 ``ACC`` :

.. code-block:: c++

   template<typename Accumulator, typename T, typename = void>
   struct FlattenAcc {
      using type = typename Accumulator::template type<T>;
   };

   template<typename Accumulator, typename T>
   struct FlattenAcc
      < Accumulator
      , T
      , std::enable_if_t < std::is_base_of_v < CUB_NS::FlattenableSignature, T>>> {
      using type = typename T::template OutputAllTypesTo<Accumulator::template type>;
   };

``FlattenAcc`` 模版的前两个参数，正是 ``Fold`` 的 ``OP`` 原型所要求的两个参数，而第三个是在 ``C++20`` 之前
( ``C++20`` 直接使用 ``concept`` 即可），不得不使用的 ``SFINAE`` 技术，
通过 ``std::is_base_of_v < CUB_NS::FlattenableSignature, T>>`` 来区分两种情况，而不得不额外引入的参数。

第一种情况， ``T`` 不是一个 ``Flattenable`` 的，那就直接将 ``T`` 合并到 ``Accumulator`` 里保存的 ``Ts...`` 里。

第二中情况，``T`` 是一个 ``Flattenable`` 的，则将模版 ``Accumulator::template type`` 当作回调从
``Flattenable`` 的高阶模版 ``OutputAllTypesTo`` 那里拿到其 ``Ts...`` ，而 ``Accumulator::template type``
会将这两个 ``Ts...`` 进行衔接，并返回一个新的 ``Accumulator`` 。

而为了消除掉 ``FlattenAcc`` 那个额外的 ``void`` 参数：

.. code-block:: c++

   template<typename ACC, typename T>
   using FlattenAcc_t = FlattenAcc<ACC, T, void>;

这样我们就我们就可以直接调用 ``FoldL_Init_t`` :

.. code-block:: c++

   using Acc = FoldL_Init_t<FlattenAcc_t, Accumulator<>, Ts...>;


其中， ``OP`` 是 ``FlattenAcc_t`` ，由于初始时，结果列表为空， 所以 ``INIT`` 是 ``Accumulator<>`` 。
而结算的结果，是一个 ``Accumulator<Ts...>`` ，而为了取出其中的 ``Ts...`` ，我们故伎重演，给它增加
一个回调接口：

.. code-block:: C++

   template<typename ... Ts>
   struct Accumulator {
      template<typename ... NewTs>
      using type = Accumulator<Ts..., NewTs...>;

      // 取回 Ts... 的回调接口
      template<template<typename ...> typename RESULT>
      using output = RESULT<Ts...>;
   };


然后，我们就可以将其输出到我们提供的回调模版 ``MyClass`` 上了：

.. code-block:: C++

   template <typename ... Ts>
   struct MyClass {
     // 回调之后，Ts ... 即 Flatten 之后的结果
     // 可以使用 Ts... 继续自己的计算
   };

   // result 是模版 MyClass ，被 Ts... 实例化后的类型
   using result = typename Acc::template output<MyClass>;


pipeline
----------------

``pipeline`` 事实上是函数的 ``compose`` 操作。其语意为：

.. code-block:: haskell

   (.) :: (b->c) -> (a->b) -> (a->c)
   f . g = \x -> f (g x)

即 ``g`` 根据输入 ``x`` ，计算出的结果，做为 ``f`` 的输入，并计算出最终结果。（在 ``Haskell`` 语法里，使用 ``()`` 表示这是
一个中位符。）

而 ``pipeline`` 则是将一连串的函数，依此计算，前一个函数的计算结果，做为后一个函数的输入。对函数式编程而言，
这是一种强大的基本抽象：一个个函数，通过 ``compose`` 组合在一起，完成更为复杂的计算。

但是，并非所有函数都是只有一个输入，所以，如果想让任何具有至少一个参数的函数都能被 ``compose`` ，
首先必须解决如何设置其它输入参数的问题（除了参与 ``pipeline`` 的那个参数）。一个设计良好的函数式编程语言，会支持 ``curry`` 。
事实上，对于 ``haskell`` 这样的语言，其函数天然是 ``curry`` 的。对于一个 ``f :: a -> b -> c -> d`` 的函数，由于箭头是右结合
的，所以其语意是 ``f :: a -> (b -> (c -> d))`` ，即，你给出参数 ``a`` ，求值结果是另外一个类型为 ``b -> (c -> d)`` 的函数；
而你继续给出参数 ``b`` ，则求值结果为类型为 ``c->d`` 的函数。

这就是给编程带来极大的便利，比如：

.. code-block:: haskell

   sum . takeWhile (<10000) . filter odd . map (^2) $ [1..]

首先产生一个无穷列表（ ``$`` 的优先级高于 ``.``  ），然后这个无穷列表被传递给左边的整个 ``compose`` 之后的组合。

从右向左，``map (^2)`` ， ``filter odd`` ， ``takeWhile (<10000)`` ，每一个函数都给定了其它参数。最后，计算 ``sum`` 。

因而，如果想让 ``C++`` 泛型计算支持 ``pipeline`` 首先要解决是 ``curry`` 的问题。

Curry
++++++++++++++++++++++

一个最简单的 ``curry`` 实现如下：

.. code-block:: c++

   template <template <typename ...> F, typename ... ARGS>
   struct Curry {
       template <typename ... MORE>
       using apply = F<ARGS..., MORE...>;
   };

其背后的思想是：给定一个函数 ``F`` ，同时给出其前面的一部分参数，然后返回另外一个函数 ``apply`` ，其参数是 ``MORE`` 。


这样的实现，无法达到 ``haskell`` 每给出一个参数，估值结果还是一个函数的效果。因为这个实现只允许一次给出前面的参数，然后得到一个函数。
如果你想继续给出一部分参数，就必须再次 ``Curry`` 。比如：

.. code-block:: c++

   template <typename T1, typename T2, typename T3>
   struct Foo {...};

   Curry<Foo, int>::apply<double, char>; // Foo<int, double, char>

   Curry<Curry<Foo, int>::apply, double>::apply<char>; // Foo<int, double, char>

注意，我们的 ``Curry`` 实现里，其输入参数 ``F`` ，其参数列表是 ``typename ...`` ，这样的原型可以匹配任意参数列表全部是 ``类型`` 的模版。
比如：

.. code-block::

   template <typename> struct S1;
   template <typename, typename> struct S2;
   template <typename, typename ...> struct S1_N;
   template <typename ...> struct S0_N;

   Curry<S1>   // OK
   Curry<S2>   // OK
   Curry<S1_N> // OK
   Curry<S0_N> // OK

但是，如果你的模版参数里包含有非类型参数，比如 ``int`` 或者 ``模版`` ，则会导致编译失败。比如：

.. code-block::

   template <template <typename> typename> struct S1;
   template <typename, int> struct S2;
   template <auto, typename ...> struct S3;
   template <int> struct S4;

   Curry<S1>   // Fail
   Curry<S2>   // Fail
   Curry<S3>   // Fail
   Curry<S4>   // Fail


接着回到我们的 ``Curry`` 。之前那个实现，不仅过于简单，甚至是不健壮的。比如，我们有如下定义：

.. code-block:: c++

   template<typename T1, typename T2>
   struct Foo {};

   template<typename T1, typename T2>
   using Foo_t = Foo<T1, T2>;


此时，如果我们对 ``Foo_t`` 使用我们的 ``Curry`` ：

.. code-block:: c++

   Curry<Foo_t, int>::apply<double> obj;

将会出现编译错误。

原因是，我们在使用别名模版时，对一个固定参数的 **别名模版** ，在 ``Curry`` 里给其传入的变参。无论是 ``G++`` 还是 ``clang`` 编译器
都不允许这么做。除非将 **别名模版** 也设计为变参。

这种检查发生在语意分析阶段。任何违背这种约束的代码都会被编译器查出。比如：

.. code-block:: c++

   template<typename T1, typename T2>
   using Foo_t = Foo<T1, T2>;

   template <typename ... Ts>
   using type = Foo<Ts...>;  // 错误。因为Foo_t是定长参数别名模版

   template <typename ... Ts>
   struct Class {
      using type = Foo<Ts...>; // 错误。原因同上
   };

不过，这样的限制仅仅是针对 **别名模版** ，对于类模版，则完全没有这类限制。对于任何固定参数的类模版，你总是可以用一个变参包去实例化它。比如：

.. code-block:: c++

   template<typename T1, typename T2> struct Foo {};

   template <typename ... Ts>
   using Foo_t = Foo<Ts...>; // Foo 定义为固定参数，但却可以给它传递一个变参包；

编译器会根据包实际展开之后，再检查是否符合类模版的需要。如果不匹配，则类型替换失败。

对于类模版，正是因为其对变参包实例化时才展开检查的性质。 ``C++`` 的变参模版灵活到了失去接口约束的作用，比如：

.. code-block:: c++

   template <template <typename> F>
   struct Service { ... };

   template <typename ... Ts>
   struct Client1 {...};

   Service<Client1>  c;

这样的接口是满足正常的约束的。因为 ``Service`` 要求任何 ``Client`` 都提供能通过单参数回调的函数。但 ``Client`` 提供了
一个变参，可以支持任意参数数量。这当然满足 ``Service`` 的要求。

但是，对于这种情况：

.. code-block:: c++

   template <template <typename...> F>
   struct Service { ... };

   template <typename T>
   struct Client1 {...};

   Service<Client1>  c;

从设计语意上，``Service`` 要求任何 ``Client`` 都必须提供一个可变参数的函数 ``F`` ，但 ``Client1`` 竟然只提供了单参数的版本。
这很明显违背了契约。 但 ``C++`` 对于这种情况竟然也是允许的。

在 ``C++11`` 提案过程中，本来这种情况是不允许的。但后来发现提供这样的灵活度，可以给其它设计带来很大便利。比如：

.. code-block:: c++

   template<template <typename ...> typename C, typename ... U>
   struct Foo {
        using Container = C<U...>;
   };

   Foo<std::pair, int, double>::Container c; // std::pair<int, double>

所以， 变参模版，可以匹配属于同一类别（比如都是值或者类型）的任意模版。而最终的正确性，则在实例化时再进行检查。


我们之前的 ``Curry`` 实现太简单，并且会因为固定参数的别名模版而导致错误。如果我们想追求可以多批次提供参数，
而不想 ``curry`` 多次；并且要避免别名模版错误，则需要更加复杂的实现：

.. code-block:: c++

   template <template <typename ...> typename F, typename ... ARGS>
   struct Curry {
     template <typename ... MORE>
     using apply = Curry<F, ARGS..., MORE...>;
   };

   template <template <typename ...> typename F, typename ... ARGS>
   requires requires { typename F<ARGS...>; }
   struct Curry<F, ARGS...> {
      using type = F<ARGS...>;
   };

这其中，使用了一个 ``concept`` ，来查看 ``F<ARGS...>`` 是否已经是一个类型（即其参数已经足够），如果是，则直接返回类型；
否则，返回一个函数 ``apply`` ，当调用 ``apply`` 时，如果继续给出一部分参数，但对于 ``F`` 依然不够，则
继续返回一个 ``Curry`` 。

然后，就可以这样使用：

.. code-block:: c++

   Curry<Foo, int>::apply<double>::apply<char>::type; // Foo<int, double, char>
   Curry<Foo, int, double>::apply<char>::type;        // Foo<int, double, char>
   Curry<Foo, int>::apply<double, char>::type;        // Foo<int, double, char>

这个实现，也避免了之前实现的 **别名模版** 问题。你一定会感到奇怪，对于这个版本的第二个特化：

.. code-block:: c++

   template <template <typename ...> typename F, typename ... ARGS>
   requires requires { typename F<ARGS...>; }
   struct Curry<F, ARGS...> {
      using type = F<ARGS...>;
   };

如果传入的 ``F`` 是一个定长参数 **别名模版** ，里面不同样在给它传递变参吗？

这其中的差别在于，对于表达式 ``F<ARGS...>`` ，在模版实例化之前，编译器无从得知 ``F`` 是一个定长参数 **别名模版** 。
因而，在模版的第一阶段检查中（未实例化之前的检查），无论从语法还是语意，这个表达式都没有任何问题。

随后，我们我们给出这样一个表达式： ``Curry<Foo_t, int, double>`` ，
在实例化的过程中， ``F`` 被替换为 ``Foo_t`` ， 而 ``ARGS...`` 则被替换为 ``int, double`` ；此时，虽然编译器
已经知道 ``Foo_t`` 是一个定长参数 **别名模版** ，但用 ``ARGS...`` 此时已经不再是变参，而是非常具体的 ``int, double`` 。
因而，此时编译器只需要检查 ``Foo_t<int, double>`` 是否是一个合法的表达式即可。

而我们之前的版本：

.. code-block:: c++

   template <template <typename ...> F, typename ... ARGS>
   struct Curry {
       template <typename ... MORE>
       using apply = F<ARGS..., MORE...>;
   };

在给出表达式 ``Curry<Foo_t, int, double>`` 之后，编译器同样进入替换阶段。将 ``F`` 替换为 ``Foo_t`` ，将 ``ARGS...`` 替换
为 ``int, double`` ，然后我们就得到了表达式：

.. code-block:: c++

   struct named_mangled_Curry {
       template <typename ... MORE>
       using apply = Foo_t<int, double, MORE...>;
   };

对于 ``apply`` 模版，此时再次进行语意检查，发现定长参数 **别名模版** ``Foo_t`` 需要传递一个变参包 ``MORE...`` ，这当然
是一种语意错误。编译失败。


新版本的 ``Curry`` 避免了 **别名模版** 错误，但却依然有一个未解决的问题。如果用户直接（ ``Curry`` 时）或间接
（ ``apply`` 时）给出了超出 ``Foo_t`` 所需要的参数，则特化版本将永远也不可能被选择，只能选择主模版：

.. code-block:: c++

   template <template <typename ...> typename F, typename ... ARGS>
   struct Curry {
     template <typename ... MORE>
     using apply = Curry<F, ARGS..., MORE...>;
   };

而这个模版，将永远也无法真正调用到 ``F`` ，只能被困在虚幻的 ``Curry`` 世界里打转。

究其原因，是两种写法都没有解决关键的问题， 传入的 ``F`` 究竟有几个参数？

在一个变参模版内部，计算一个变参包里的参数数量是非常简单的： ``sizeof...(Ts)`` 即可。 但是对于传入的、可以
匹配 ``template <typename ...> typename F`` 的模版，其参数个数可以是任意数目，比如：

.. code-block:: c++

   template <typename T> struct C1;                                 // 1个参数
   template <typename T1, typename T2> struct C2;                   // 2个参数
   template <typename T1, typename ... Ts> struct C1s;              // 至少1个参数
   template <typename T1, typename T2, typename ... Ts> struct C2s; // 至少2个参数
   template <typename ... Ts> struct Cs;                            // 任意多个参数

它们都可以匹配 ``F`` ； 并且没有任何直接的办法，站在 ``F`` 的角度求一个传入的模版的参数个数。

或许第一个跳到你脑海里的方法是模版萃取：

.. code-block:: c++

   template<template<typename> typename>
   struct TemplateTrait {
      constexpr static size_t num = 1;
   };

   template<>
   struct TemplateTrait<template<typename, typename > typename> {
     constexpr static size_t num = 2;
   }

或者：

.. code-block:: c++

   template< template<typename> typename >
   struct TemplateTrait {
      constexpr static size_t num = 1;
   };

   template < template< typename, typename > typename C>
   struct TemplateTrait {
     constexpr static size_t num = 2;
   }


很不幸，``C++`` 规定，模版的 **模版参数** 不能用来做特化。而对于 **类模版** ，不同的模版头，不允许存在两个主模版。

而高度灵活的函数模版这时候成了救世主。因为函数的重载非常灵活：两个同名函数可以除了名字一样，其它都不一样。
比如，参数个数，参数类型。如果是模版的话，模版的参数列表也可以完全不同。所以，我们可以定义两个同名函数：

.. code-block:: c++

   template <template<typename> typename>
   auto DeduceArgs() -> Value<1>;

   template <template<typename, typename> typename>
   auto DeduceArgs() -> Value<2>;

然后，

.. code-block:: c++

   template <typename T> struct C1;                   // 1个参数
   template <typename T1, typename T2> struct C2;     // 2个参数

   decltype(DeduceArgs<C1>())    // Value<1>
   decltype(DeduceArgs<C2>())    // Value<2>


So far so good。但我们忘了一种重要的情况：变参。

.. code-block:: c++

   template <typename T1, typename ... Ts> struct C1s;              // 至少1个参数
   template <typename ... Ts> struct Cs;                            // 任意多个参数

   decltype(DeduceArgs<C1s>())    // 二义性
   decltype(DeduceArgs<Cs>())     // 二义性

正如我们之前所讨论的，这两个变参模版均可以匹配上面的两个 ``DeduceTemplate`` 函数。

你或许会想，是否可以补充一个变参版本，让它可以匹配变参场景，比如：

.. code-block:: c++

   template <template<typename> typename>
   auto DeduceArgs() -> Value<1>;

   template <template<typename, typename> typename>
   auto DeduceArgs() -> Value<2>;

   template <template <typename...> typename>
   auto DeduceArgs() -> Variadic; // 专门匹配变参

很不幸，这只会让情况变得更糟。因为变参版本可以匹配一切。有了它，所有的匹配都会出现二义性。

另外，需要特别强调的是，这几个函数都是主模版，不存在特化关系。并且，对于模版的 **模版参数** ，是无法通过特化方式来进行区分的。所以，
我们根本不需要尝试特化方案。

所以，现在核心的问题是：如何让函数模版能够在变参模版万能匹配的情况下，能够区分出定长参数和变参？

下面出场的就是 ``C++`` 社区著名的惯用法 ： ``tag dispatch`` 。

我们先定义两个 ``tag class`` ：

.. code-block:: c++

    struct variadic_tag {};
    struct fixed_tag : variadic_tag {};

你应该已经注意到，它们其中一个继承自另外一个。

然后，我们再定义两个重载函数，来使用这两个 ``tag`` :

.. code-block:: c++

    template<template<typename...> typename F>
    auto DeduceTemplateArgs(variadic_tag) -> Variadic;

    template<template<typename...> typename F>
    auto DeduceTemplateArgs(fixed_tag)    -> decltype(DeduceArgs<F>());

现在，如果我们给出这样的表达式： ``DeduceTemplateArgs<C1>(fixed_tag{})`` ，将会导致所有 **候选函数** 的的类型替换
（将 ``F`` 替换为 ``C1`` ），因而，第 2 个候选函数的返回类型变为 ``decltype<DeduceArgs<C1>()>`` ；而其中的
表达式 ``DeduceArgs<C1>()`` 则会进一步触发 ``DeduceArgs`` 的 **重载决议** (因为有多个候选)；而决议的结果找到了最佳
匹配版本：

.. code-block:: c++

   template <template<typename> typename>
   auto DeduceArgs() -> Value<1>;

而其返回值类型为 ``Value<1>`` ，所以 ``decltype`` 的结果也是 ``Value<1>`` 。

做为最为匹配的版本，``DeduceTemplateArgs<C1>(fixed_tag) -> Value<1>`` 是最终的选择。
因而 ``decltype(DeduceTemplateArgs<C1>(fixed_tag{}))`` 的返回类型正是我们所需要的 ``Value<1>`` 。


如果此时我们提供一个变参模版 ``Cs`` ，那么表达式 ````DeduceTemplateArgs<Cs>(fixed_tag{})`` 同样会触发上述过程；
但 ``DeduceArgs<Cs>()`` 会因为二义性而决议失败，进而导致 ``decltype(DeduceArgs<Cs>())`` 失败，最终
导致 ``DeduceTemplateArgs(fixed_tag)`` 从候选集中被排除出去。

此时，就只剩下 ``DeduceTemplateArgs(variadic_tag)`` 一个版本，但因为 ``fixed_tag`` 与 ``variadic_tag`` 之间的
继承关系，所以这个版本也是匹配的，并且是现在候选集合中唯一的版本。所以，最终推演的结果是 ``Variadic`` ，代表可变参数。

这里特别说明一下 ``fixed_tag`` 与 ``variadic_tag`` ，我们之所以在
表达式 ``DeduceTemplateArgs<Cs>(fixed_tag{})`` 里明确指明 ``fixed_tag`` ，是因为我们希望优先使用第二个版本（在两个
版本都匹配的情况下，``fixed_tag`` 更为匹配）；只有在第二个版本失败的情况下，第一个版本才会得到选择。

在能够得知一个模版的参数个数的情况下，实现一个正确版本的 ``Curry`` 就变为可能。无论你选择上面的那种 ``Curry`` 实现，
都可以结合参数个数信息，给出一个健壮的实现。在次就不再赘述。


Compose
-------------------------------

``Compose`` 的实现就简单很多。如下：

.. code-block:: c++

   template <CallableConcept ... OPs>
   struct Compose;

   template <CallableConcept LAST>
   struct Compose<LAST> : LAST {};

   template <CallableConcept H, CallableConcept ... OPs>
   struct Compose<H, OPs...> {
      template <typename INPUT>
      using apply = typename Compose<OPs...>::template apply<typename H::template apply<INPUT>>;
   };

``CallableConcept`` 要求每一个参与组合的 ``OP`` 都必须提供一个 ``apply`` 函数。之所以产生这样的约束，
因为一则模版参数不能以变参的方式表达传递多个模版，而只能传递类型或值的变参包。二则，一个 ``Curry`` 的结果类型自身
就是一个带有 ``apply`` 函数的类型。

而 ``compose`` 内部的算法，则非常直接，首先让 ``H`` 进行计算 ``typename H::template apply<INPUT>`` ，其输出
做为 ``Compose<OPs...>::template apply`` 的输入。

与 ``haskell`` 版本不同的是，其 ``compose`` 是从右向左，这符合数学函数表达习惯。而我们的实现是从左向右，这符合程序员
对于  ``pipeline`` 的认知。


然后，我们将我们对 ``list`` 的各种操作进行 ``Curry`` ，并用宏让一切看起来更简洁：

.. code-block:: c++

   #define take(n)       Curry<Take, Value<n>>
   #define drop(n)       Curry<Drop, Value<n>>
   #define filter(f)     Curry<Filter, Value<f>>
   #define sort(f)       Curry<Sort, Value<f>>
   #define transform(f)  Curry<Transform, Value<f>>

之所以，有 ``Value`` 就是因为 ``Curry`` 要求一个模版的参数必须都是类型 （因为 ``C++`` 要求一个变参包里必须是同一种 ``kind`` ）。

然后我们就可以在 ``pipeline`` 中直接使用它们：

.. code-block:: c++

   Pipeline<List<1,2,3,4,5,6,7>,
      take(5),
      filter([](int n){ return n % 2 > 0; }),
      transform([](int n) { return n + 10; })>;


延迟估值
----------------

``C++`` 的泛型天然就是延迟估值的，因而你可以构造一个无穷列表：

.. code-block:: c++

   template <typename T, T N, T STEP = 1>
   struct InfiniteValueList {
      constexpr static T Head = N;
      using Tail = InfiniteValueList<T, N + STEP, STEP>;
   };

   template <auto V>
   struct RepeatValueList {
      constexpr static auto Head = V;
      using Tail = RepeatValueList<V>;
   };

你不用担心这样的结构定义会无穷递归下去而导致编译器崩溃。并且你可以安全的写如下算法的代码：

.. code-block:: c++

   Pipeline
     < InfiniteValueList<int, 1, 2>
     , Drop<2>
     , Take<5>>
     // 结果是 5, 7, 9, 11, 13

   Pipeline
     < TypeList<int, double, char>
     , ZipWith<RepeatValueList<5>>>
     // 结果是 [(int, 5), (double, 5), (char, 5)]

Optional
-------------------

``Optional`` 是一个存在非常广泛的语意。比如，指针空与非空，非法值与合法值，存在与不存在 ... 等等；在 ``Haskell`` 语言里，
这种概念被称做 ``Maybe`` 。

而在类型的世界里，则可以将 ``void`` 看作 ``None`` （或 ``Nothing`` )， ``void`` 和其它类型一样，本身也是一个类型，
但其值域为空。也就是说，你无法用它实例化任何数据。

所以，在对类型进行，``transform`` , ``filter`` , 或者 ``fold`` 操作时，你总是可以用 ``void`` 当作 ``None`` 语意。比如：

.. code-block:: c++

   template <typename T, typename = void>
   struct ActionTrait {
      using type = void;
   };

   template <typename T>
   struct ActionTrait<T, std::enabled_if_t<std::is_base_class_v<Action, T>>> {
      using type = T;
   };

其语意是，一个类型如果是 ``Action`` 的子类，返回的则是 ``Maybe<T>`` ，否则返回 ``Nothing`` 。


.. code-block:: c++

   template <typename ... Ts>
   struct Bar {
      // Ts... 里，全是Action的子类
   };

   typename Pipeline
            < TypeList<Ts...>
             , transform(ActionTrait)
             , filter(Maybe)
             >::template exportTo<Bar>;

甚至，你可以将对于 ``void`` 的过滤操作自动内嵌到操作中，比如， ``Transform`` 可以提供一个版本，
自动抛弃掉结果为 ``void`` 的类型；或者，在 ``Fold`` 时，自动跳过是 ``void`` 的类型。但这都是优化的事情，即便不提供，
由于有了 ``Filter`` ，也都可以完成计算。

.. important::

   - ``C++`` 泛型计算，是完全函数式的；
   - ``C++`` 泛型，即可以计算数值，也可以计算类型，而两者都是 ``图灵完备`` 的；
   - ``C++`` 泛型计算是 ``lazy`` 的；
   - ``模式匹配`` 用来进行路径选择（辅助以 ``SFINAE`` 和 ``CONCEPT`` ）， ``递归`` 用来解决 ``循环`` 问题；
   - ``模版`` 是泛型计算的一等公民：对于 ``高阶模版`` 的支持，及 ``闭包`` 性质，可以将其理解为泛型计算时的 ``lambda`` 。


