## 注释

### 多行注释

```c++
/* This is a comment!
 * This is also part of the same comment!
 * Qt Creator adds a star on each line for formatting purposes when we use this
 * type of comment.
Even though we don't have a star at the beginning of this line, it's still part of
our comment!
 * When we hit the end of this line, the star-slash causes our comment to end. */
```

### 单行注释

`//`

### 推荐注释

一般来说，对于任何功能可能无法从名称中立即明确体现的函数，都应该给出概要说明。说明函数的输入参数、预期输出和返回值（如果适用）。

在函数内部，不要为每一行代码都添加注释，而是提供概括性的注释，说明代码*块*的功能。但是：

- 避免在代码中简单地重复那些“显而易见”的内容

- 尽量使用解释某项功能如何/为什么工作的注释，而不是仅仅说明某项功能做了*什么* ，除非你是在以一种让读者更容易理解的方式解释一段代码的行为。

尽量使用动词短语形式的函数名，这样可以起到解释代码功能的作用。（避免使用晦涩难懂的函数名和变量名，以免我们需要在所有出现的地方都添加注释。

注释应尽量简洁。但如果你在编写注释时需要标注复杂的源文件顶部（这类文件通常较长），或者需要对特别复杂的函数进行注释，则情况例外。

一个很好的经验法则：假设五年后你加载了当时完成的作业代码，但你丢失了作业说明。哪些注释能帮助你快速理解每个函数的作用？


另一个经验法则：如果你发现自己很难修复代码中的某个错误，这*可能*表明你找到了一段复杂的代码，如果加上简洁的注释，这段代码会更清晰易懂。

## include

```c++
#include <iostream> //官方库，编译器自带的
```

```c++
#include "xxx.h" //用户自定义的库
```

自定义的库的话，需要放在工作目录下。子目录的话，一种是`#include "xxx/xxx.h"`，另外一种是编译时候告诉编译器`-I`，这里可以看 Makefile 做的笔记

## namespace

比如两个库的函数可能会重名，因此需要使用 `library::function` 的形式

使用 `using namespace std;` 意思就是如果一个函数没有制定名字，那编译器就去指定的namespace去找其

## main

跟c一样，这里还讲了函数的定义

## Cout stream

```c++
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   cout << "Hello, world!" << endl;
   cout << "CS106B is awesome, and so are you!" << endl;

   return 0;
}

```

`endl` 的作用是换行，否则就是连在一起了。

## 变量类型

比c多了`bool`和`string` 应该

不可更改类型

不可重定义值，可以重新赋值，意思就是无需重新声明变量类型

循环

```c++
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   int i = 1;

   while (i < 5)
   {
      cout << i << endl;
      i++;
   }

   return 0;
}
```

C++ 对空格/缩进 不太严格

```c++
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   for (int i = 1; i < 5; i++)
   {
      cout << i << endl;
   }

   return 0;
}
```

```c++
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   string s = "giraffe";
   for (char ch : s)
   {
      cout << ch << endl;
   }

   return 0;
}
```

## if else

```c++
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   int numCupcakes = 5;

   if (numCupcakes == 1)
   {
      cout << "Oh no! Running low!" << endl;
   }
   else if (numCupcakes > 1)
   {
      cout << "Hooray, cupcakes!" << endl;
   }
   else
   {
      cout << "Oh nooOoOoOOoo!" << endl;
   }

   return 0;
}
```

## 布尔运算符



![image-20260709111951717](/redemption-assets/image-20260709111951717.png)



其中 && 的优先级比 ||更高

`a || (b && c)` == `a || b && c`

```c++
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   int numCupcakes = 5;

   if (numCupcakes == 1 || 2)  // 这里预判逻辑应该是是numCupcakes是1/2就执行，但是后面2是恒正值
   {
      cout << "Uh oh! We're running low on cupcakes!" << endl;
   }

   return 0;
}
```



## 作用域

变量仅仅存在于声明他的代码块内部

## void function

不返回任何值的函数

```c++
#include <iostream>
#include "console.h"
using namespace std;

void processCupcakes(int numCupcakes)
{
   if (numCupcakes < 0)
   {
      cout << "Invalid number of cupcakes." << endl;
      return; // 有点像 py 里面的写法，就是直接退出函数执行
   }

   cout << "We reached the last line of the function." << endl;
}

int main()
{
   processCupcakes(-3);
   return 0;
}
```

## **functional prototype**

要么将函数细节放在main函数上面，要么就先定义，写完main函数下面补充细节；**functional prototype**就是一个函数的签名
