（ **关键概念！** ）将一项任务分解成若干个各自完成单一目的的组成函数称为**函数分解** ，这可以提高代码的可读性和可维护性。



## Testing

测试驱动开发通常是：

1. 先想清楚函数应该做什么
2. 先写测试
3. 再写函数
4. 运行测试
5. 根据失败信息修改函数
6. 直到所有测试通过



### SimpleTest

比如这里的 Stanford 提供了一个测试用的库

```cpp
#include <iostream>
#include "console.h"
#include "SimpleTest.h"
#include "strlib.h"
using namespace std;

string extractAlpha(string s)
{
   string result;

   for (int i = 0; i < s.length(); i++)
   {
      if (isalpha(s[i]))
      {
         result += s[i];
      }
   }
   return result;
}

bool isValidPassword(string username, string password)
{
   string alphaPortion = extractAlpha(password);
   return !stringContains(toLowerCase(alphaPortion), toLowerCase(username));
}

STUDENT_TEST("注释")   //👇写函数与输入，与预期的输出，不一致会输出false
{											//还有一个函数 PROVIDED_TEST 是教学提供的
   EXPECT_EQUAL(extractAlpha("sean"), "sean");
   EXPECT_EQUAL(extractAlpha("sean11"), "sean");
   EXPECT_EQUAL(extractAlpha("1sean"), "sean");
   EXPECT_EQUAL(extractAlpha("s1ean"), "sean");
   EXPECT_EQUAL(extractAlpha("s1e1a1n"), "sean");
   EXPECT_EQUAL(extractAlpha("s9e$a***&n"), "sean");
   EXPECT_EQUAL(extractAlpha(""), "");
   EXPECT_EQUAL(extractAlpha("9$&"), "");
}

int main()
{
   runSimpleTests(ALL_TESTS); //这里是运行所有的测试

   string username = "Sean";
   string password = "s1e1a1n1'1s1p1a1s1s1w1o1r1d";

   if (isValidPassword(username, password))
   {
      cout << "Hooray!" << endl;
   }
   else
   {
      cout << "Oh no! Bad password." << endl;
   }

   return 0;
}
```

###  橡皮鸭测试法

橡皮鸭调试法是：

> 把代码一行一行解释给一个不会编程的对象听，例如桌上的橡皮鸭。

比如你对橡皮鸭解释：

```
我先建立一个空字符串 result。

然后遍历输入字符串的每个字符。

如果当前字符是字母，就把它加入 result。

如果不是字母，就跳过。

最后返回 result。
```

很多时候，说到某一步，你会突然发现哪一步出错了

有点像是费曼学习法



## ADT

抽象的意思是把细节隐藏，告诉使用者可以执行哪些操作

### Vector

part of ADT

Vector 是一个列表，有序。但是不同于py，这里的需要所有的元素都是同质。Vector 的底层是一个数组，它的内部的元素是以连续块的形式存储

需要 `#include <vector>`

### Grid

向量的向量

行优先，因为每个向量是内存连续的，而每一行是一个向量

```cpp
#include <iostream>
#include "console.h"
#include "grid.h"
using namespace std;

int main()
{
   Grid<int> g(2, 3);

   // Just random values. :)
   g[0][0] = 41;
   g[0][1] = 53;
   g[0][2] = 98;
   g[1][0] = 18;
   g[1][1] = 21;
   g[1][2] = 16;

   // Option #1: For-Each Loop
   cout << "Grid for-each loop:" << endl;
   for (int i : g)
   {
      cout << i << endl;
   }
   cout << endl;

   // Option #2: Nested for loops.
   cout << "Grid nested loops:" << endl;
   for (int row = 0; row < g.numRows(); row++)
   {
      for (int col = 0; col < g.numCols(); col++)
      {
         cout << g[row][col] << endl;
      }
   }
   cout << endl;

   // Option #3: Iterate over grid locations.
   cout << "Grid locations:" << endl;
   for (GridLocation loc : g.locations())
   {
      cout << loc << " -> " << g[loc] << endl;
   }
   cout << endl;

   // Option #4: Just dump directly to cout.
   cout << "Grid contents:" << endl;
   cout << g << endl << endl;

   // Example of manual specification of GridLocation.
   GridLocation myLoc(0, 1);
   cout << g[myLoc] << endl;

   return 0;
}
```
