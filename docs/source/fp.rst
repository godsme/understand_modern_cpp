C++编译时元编程（一）
================================

`C++` 编译时元编程，是对 **类型** 和 **值** 的计算。类型自不必说，不存在 ``mutable`` 的可能性；而数值，`C++` 也规定了
必须是常量，即 ``immutable`` 的数值即对象。而任何基于常量的计算，如果其计算能力是图灵完备的，那么其从实际效果上，必然与
函数式编程是等价的。

为了理解 `C++` 编译时元编程的思想，最好有一门函数式编程语言做为引导。最为知名的函数式编程语言 `Haskell` 是一个直觉上最佳的选择。
不幸的是，由于 `C++` 编译时，不仅仅可以操纵 **数值** ，还可以操纵 **类型** ，而这两者高度融合在一个体系中，没有清晰界限。
但 `Haskell` 对于类型和数据区分的非常清楚：其每个数据都有自己的类型，但参与计算的是数据，没有计算类型的能力。
而 `Agda` 的类型系统高了一个层次，在计算层面，数值和类型的边界被消除，拥有同等的计算能力。因而，本文通过 `Agda` 来做为引导，来理解
`C++` 编译时元编程的思想。

我们先来看一段 `Agda` 代码：

.. code-block:: agda
   :linenos:

   data List (A : Set) : Set where
     []   : List A
     _::_ : A -> List A -> List A


这段代码里，``data`` 说明这是在定义一个数据类型，其名字是 ``List`` ， 而这个类型，需要另外一个类型做为输入，即 ``A`` ，而
``A`` 的类型为 ``Set`` ；而被定义的类型： ``List``， 其类型也是 ``Set`` 。

在类型系统理论中，每一个类型都是一个 **集合** ，比如：``bool`` 是一个集合，集合里的元素是其 **值域** ： ``true`` 和 ``false`` 。
而 ``int`` 则是整个整数集合。加法类型，即 `C/C++` 中的 `union` ，其 **值域** 则是 ``union`` 中每种类型 **值域** 的并集
（这就是为何被称做加法类型）；而乘法类型，即 `C/C++` 中的 `struct` ，其 **值域** 则是 ``struct`` 中每个 ``field`` 的
**值域** 相乘 。总之，不难理解，每一个类型都是一个集合。

但所有类型放在一起，也是一个集合。这个集合被称做 ``Set1`` 。之所以被叫做 ``Set1`` ，因为理论上，所有的
``Set1`` 也是一个集合，那个集合被称做 ``Set2`` ，从而可以 ``Set3, ..., SetN, ...'' 无穷的递归上去。

当然，我们现实中的类型系统，到 ``Set1`` 即足够了。所以上面代码中的 ``Set`` ，就是 ``Set1`` ，即所有类型的集合。因而，任何时候
你看到一个符号的类型是 ``Set`` ，那就意味着那个符号是一个类型。

接着看上面的代码。第 2 行和第 3 行，分别定义了两个 ``构造函数`` ：

1. 第一个构造了一个空列表，其类型当然是 ``List A`` ；
2. 第二个构造函数有两个参数： 类型分别为 ``A`` 和 ``List A`` ，
   即把一个 ``A`` 类型的数据追加到列表前面，得到计算结果：一个新的列表。
   这就是 ``A -> List A -> List A`` 的含义。


如果我们把上述代码直接映射到 `C++` ，就是下面的代码：

.. code-block:: c++

   template <typename A>
   struct List {
      List();
      List(A, List<A>);
   };

请花上一点时间，仔细对照这两段代码。它们之间的语意映射关系相当直接和清楚。
这其中，``typename`` 正是 ``Agda`` 中的 ``Set`` 。另外， `C++` 的构造函数的返回值类型正是其构造的类型本身，因而无须描述。

你或许会感叹 `Agda` 可以直接使用符号来定义构造。但那不是本文的重点。

当然，`C++` 只是那么描述，是无法完成一个 ``List`` 真正的职责的。下面给出一个可以工作的实现：

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

这是一段 `Haskell`` 代码，其中 ``a`` 代表这是一种范型参数，其属于 ``Integral`` TypeClass 。 而对应的 `C++` 实现为：

.. code-block:: c++

   template <std::integral auto N>
               constexpr auto fib    = fib<N-1> + fib<N-2>;
   template <> constexpr auto fib<1> = 1;
   template <> constexpr auto fib<0> = 0;

其中 ``std::integral`` 是 `C++20` 引入的 `Concepts` ，它比 `Haskell` 的 `TypeClass` 更为强大。但在本例中，起到的作用
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

  Class   :: {T : Set} -> T -> int -> Set
  Class T I = struct { using type = T; }

即, 模版名字是函数名，其有两个参数，其中 ``T`` 通过花括号里 ``{T : Set} 说明 ``T`` 是一个类型。其参数为 ``T`` 和 ``int``
类型的数值 ``I`` ，函数的求值结果是一个类型：即后面的结构体内容定义。

因而，上面的对于 ``List`` 的定义，转化为类 ``agda`` 语法为：

.. code-block:: agda

  List     :: {T : Set} -> T -> size_t -> Set
  List T N = struct { const T head; const List<T, N-1> tail; }
  List T 0 = struct { }

将类模版理解为函数，将模版特化看作函数调用的模式匹配，这就把对于数值的计算，和对于类型的计算，完全统一在一起。这会极大的拓展对于类型
操作能力的理解。要知道，`C++` 范型对于类型的操作能力是 **图灵完备** 的。不要只是把它当作简单的实例化一个容器那样的基本泛型，否则你
会错过 `C++` 最为强大，也最为精彩的能力。

我们接着实现上面的 ``List`` 。为了让用户可以不要在每次使用 ``List`` 时都要指明类型，我们定义两个类型推演指导，而第2个正是
 `Agda` 例子中的第2个构造。而另外一个构造，则是对只有一个元素情况下的简便写法。至于空列表构造，`C++` 已经帮我们生成了默认构造，
我们无须再写。

.. code-block:: C++
   :linenos:

   template<typename T>
   List(T) -> List<T, 1>;

   template<typename T, size_t N>
   List(T, List<T, N>) -> List<T, N+1>;

然后我们就可以定义 `List` 常量了：

.. code-block:: C++

   template<typename T>
   using Nil_t = List<T, 0>;

   template<typename T>
   constexpr Nil_t<T> Nil{};

   constexpr auto emtpy = Nil<int>;                   // int 型空列表，由于类型无法推演，必须明确指明
   constexpr auto list1 = List{1, List{2, List{3}}};  // 构造 1::2::3::Nil

从中，你可以清晰的看出函数式语言中的 ``List`` 就是这样的递归构造。``agda`` 在构造一个 ``list`` 时，则是如下语法：

.. code-block:: agda

  let emtpy = []
  let list1 = 1 :: 2 :: 3 :: []

明显比我们上面的定义看起来要清晰。当然 `C++` 也可以重载操作符，比如：

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

然后，我们就可以做和 `Agda` 类似的写法：

.. code-block:: C++

  constexpr auto list1 = 1 >>= 2 >>= 3 >>= nil;

之所以选择这个符号，因为 `C++` 只有 ``@=`` (其中 ``@`` 代表 ``+``, ``-`` , ``>>`` 等二元操作符）是右结合的。

另外，你会发现 ``nil`` 没有指明任何类型信息。而不像之前必须指明类型： ``Nil<int>`` 。这是因为，在它所在的
``operator>>=`` 环境里，``List`` 的类型可以从做左边的操作数 ``3`` 获取到。可以回到 ``operator>>=`` 里理解这一点。
如果没有上下文可以推演类型，则仍然必须亲自指明类型。

如果你还想更加简洁，则可以使用变参模版大法：

.. code-block:: C++

  template<auto H, auto ... RESTs>
  constexpr auto makeList                   = makeList<H, RESTs...>;

  template<auto H, auto H1, auto ... RESTs>
  constexpr auto makeList<H, H1, RESTs...>  = H >>= makeList<H1, RESTs...>;

  template<auto H>
  constexpr auto makeList<H>                = List{H};


这是一个完全递归的计算，典型的函数式计算方式。另外，``MakeList`` 从参数上约束了必须至少有一个元素，否则在空列表的情况下，
其类型由于缺乏上下文而无法推导。

现在，用户就可以非常简单的创建列表了：

.. code-block:: c++

   constexpr auto list1 = makeList<1,2,3,4>;


下面我们来看与 `List` 有关的操作。比如最典型的 ``map`` 操作。下面是 `Agda` 的实现：

.. code-block:: agda

   map : {A B : Set} -> (A -> B) -> List A -> List B
   map f [] = []
   map f (x :: xs) = f x :: map f xs

第一行类型声明。其意思是：有两个类型 ``A`` 和 ``B`` ，函数的输入参数有两个 : ``(A->B)`` ，这是从 ``A`` 类型到 ``B`` 类型
的映射函数，``List A`` 是一个元素为 ``A`` 类型的 ``List`` ，函数的求值结果是元素类型为 ``B`` 的 ``List`` 。

`C++` 的实现非常类似：

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

   _++_ : {A : Set} -> List A -> List A -> List A
   [] ++ ys        = ys
   (x :: xs) ++ ys = x :: (xs ++ ys)

这个函数的类型很容易懂，不再赘述。其中新的元素是 ``_++_`` ，这是这个函数的名字，两边的下划线说明这是一个中位操作符。所以其下面
定义函数实现时，也直接使用了中位操作方式。

`C++` 的实现则是重载操作符。但算法一摸一样：

.. code-block:: c++

   template<typename A, size_t N>
   constexpr auto operator+(const Nil_t<A>&, const List<A, N>& rhs) -> List<A, N> {
      return rhs;
   }

   template<typename A, size_t M, size_t N>
   constexpr auto operator+(const List<A, M>& lhs, const List<A, N>& rhs) -> List<A, M + N> {
      return lhs.head >>= (lhs.tail + rhs);
   }

注意，`C++` 的实现里，模版参数多了 ``size`` 参数，因为这是 `C++` 实现的 ``List`` 类型的一部分，但这些参数
都属于自动推演参数，用户永远不需要亲自指定它。

.. Important::

   - `C++` 编译时元编程都是常量语意；
   - **类型** 与 **值** ，在 ``C++`` 编译时元编程的世界里，从概念上没有本质区别。``typename`` 是类型的 ``Set`` 。
   - `C++` 的类模版也是函数语意；其求值结果的类型是 ``Set`` ，即类型；
   - **模式匹配** ，**递归** ，是函数式编程处理条件选择和循环问题的典型手段；同样也是 `C++` 编译时计算的主要手段。

