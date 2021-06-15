
初始化
==================

``C++`` 的初始化方式之繁多，估计是所有编程语言之最。 我们先通过一个列表来感受一下：

  1. 默认初始化
  2. 值初始化
  3. 直接初始化
  4. 拷贝初始化
  5. 零初始化
  6. 聚合初始化
  7. 引用初始化
  8. 常量初始化
  9. 数组初始化
  10. 列表初始化


以至于仅仅是初始化，都被专门开发成了一门课程。

但这些看似繁杂的初始化方式，背后有没有一些简单的线索可循？


直接初始化
-----------------------

我们先来看看最为简单的 **直接初始化** 。


我们首先定义一个类 ``Foo`` :


.. code-block:: c++

   struct Foo {
     enum class A {
       NIL,
       ANY,
       ALL
     };

     Foo(int a) : a{a}, b{true} {}
     Foo(int a, bool b) : a{a}, b{b} {}

     auto operator==(Foo const& rhs) const -> bool {
         return a == rhs.a && b == rhs.b;
     }

   private:
     int a;
     bool b;
   };


下面列表中所包含的构造表达式均为 **直接初始化** ：


.. code-block:: c++

   Foo object(1);

   Foo object(2, false);

   Foo object2(object);

   Foo(1) == Foo(1, true);

   new Foo(1, false);

   long long a{10};
   (long long){10} + a;

   char b(10);
   char(20) + b;

   char* p{&b};

   Foo::A e{Foo::A::ANY};


简单说，当初始化参数非空时（至少有一个参数），如果你

  1. 使用 **圆括号** 初始化（构造）一个对象，或者
  2. 用 **圆括号** 或 **花括号** 来初始化一个 `non-class` 类型的数据时（基本类型，指针，枚举等，因而只可能是单参）时，

这就是直接初始化。


这种初始化方式，对于 `non-class` 类型被称作 **直接初始化** 很容易理解。而对于 `class` 类型，**直接初始化** 的含义也很明确，就是直接匹配对应的构造函数。 伴随着匹配的过程：

   1. 参数允许窄向转换 ( `narrowing` )；
   2. 允许隐式转换；


比如:

.. code-block:: c++

   long long a = 10;

   Foo foo(a); // OK

   struct Bar {
     Bar(int value) : value(value) {}
     operator int() { return value; }
   private:
     int value;
   };


   Foo foo(Bar(10)); // Bar to int, OK


除此之外，还有几种表达式也属于 **直接初始化** ：


  1. `static_cast<T>(value)` ;
  2. 使用 **圆括号** 的类成员初始化列表；
  3. `lambda` 的捕获初始化列表




列表初始化
----------------------  


不难看出，除了 `lambda` 的场景，以及用 **花括号** 初始化 `non-class` 类型之外， **直接初始化** 正是石器时代 ( `C++ 11` 之前) 的经典初始化方式。
  
到了摩登时代 ( 自 `C++ 11` 起）， 引入了被称作 `universal` 的统一初始化方式：列表初始化 。 之所以被称作 `universal` ，是因为之前花括号只被用来初始化聚合和数组，现在可以用来初始化一切: 基本类型，枚举，指针，引用，类。


由于列表为空有非常特殊而明确的定义,我们在这里仅仅考虑列表非空的场景。


我们先看看如下表达式：


.. code-block:: c++

   Foo foo{1, true};
   Foo foo{2};

   new Foo{3, false};

   Foo{4} == Foo{4, true};


以及如下表达式：   
   
.. code-block:: c++

   Foo foo = {1, true};
   Foo foo = {2};
  
   Foo foo = Foo{3, false};
   Foo foo = Foo{4};


这两组表达式都被称为列表初始化。唯一的差别是，后者使用了等号，看起来像赋值一样。前者被称为 **列表直接初始化** ，后者则叫做 ** 列表拷贝初始化** 。

虽然后者名字里有 **拷贝** 二字，并不代表其背后真的会进行拷贝操作。仅仅是因为历史的原因，以及为了给出两个名字以区分两种方式。

但事实上，对于 `class` 的场景，两者都是直接匹配并调用类的构造函数，并无根本差异。

其中一点细微的差别是：如果匹配到的构造函数，或者类型转换的 ``operator T`` 被声明为 ``explicit`` ，一旦你使用等号，则必须明确的进行指明：

.. code-block:: c++

   struct Bar {
     explicit Bar(int a) {}
   };


   Bar bar = {10};    // fail
   Bar bar = Bar{10}; // OK
   Bar bar{10};       // OK
 

   struct Thing {
     explicit operator Bar() {  ...  }
   };

   Thing thing;

   Bar bar = thing;      // fail
   Bar bar = Bar{thing}; // OK
   Bar bar{thing};       // OK


对于类来说，而列表初始化（使用花括号），相对于直接初始化（使用圆括号），其差异主要体现在两个方面：

   1. 如果类存在一个单一参数是 ``std::initializer_list<T>`` ，或者第一个参数是 ``std::initializer_list<T>`` ，但后续参数都有默认值，使用
      花括号构造，总是会优先匹配初始化列表版本的构造函数。

   2. 花括号不允许窄向转换。



值初始化
---------------------------


值初始化，简单来说，就是用户不给出任何参数，直接用圆括号或者花括号进行的初始化：

.. code-block:: c++

   int a{};

   Bar bar{};
   Bar bar = Bar();
   Bar bar = Bar{};
   Bar bar = {};
  
   Foo() + Bar();

   new Bar();
   new Bar{};

   
注意，这里面没有 ``Bar bar()`` 的初始化形式。由于这样的形式与函数声明无法区分，因而被明确定义为这是一个名为 ``bar`` ，返回值类型为 ``Bar`` 的函数声明。

  
而在石器时代，为了能够进行值初始化，只能使用 ``Bar bar = Bar();`` 的形式。而这种形式在当时的语意为：等号右侧实例化了一个临时变量，通过
拷贝构造构造了等号左侧的 ``bar`` ，但当时编译器基本上都会将这个不必要的拷贝给优化掉。到了 ``C++ 17`` ，拷贝的语意被彻底终结。更详细的细节
请参照 :ref:`value-object` 。


