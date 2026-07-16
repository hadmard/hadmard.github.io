## 传递函数

### 按值

```c++
#include <iostream>
#include "console.h"
using namespace std;

void foo(int n)
{
   n++;
}

int main()
{
   int n = 3;
   foo(n);
   cout << n << endl; //输出3

   return 0;
}

```

这里main函数块和foo函数块分别自己新建了一个n变量，两者互不影响

```c++
#include <iostream>
#include "console.h"
using namespace std;

void foo(int &n)
{
   n++;
}

int main()
{
   int n = 3;
   foo(n);
   cout << n << endl; //输出4

   return 0;
}

```

这里的foo函数传入的是main函数内的n，所以改变的也是其

### ASCII字符

char的底层是int，因此可以使用int的比较运算符和算术运算符，也可以使用 int(ch) 将其转换为对应的

```c++
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   for (char ch = 'a'; ch <= 'z'; ch++)
   {
      cout << ch << " (" << int(ch) << ")" << endl;
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
   for (char ch = 'a'; ch <= 'z'; ch++)
   {
      cout << ch << " (" << int(ch) - ('a' - 1) << ")" << endl; //最好如此，不要写 -96
   }

   return 0;
}
```

### 字符串

#### 本质

字符串因此就是字符数组，因为char底层就是int，因此可以如此认为

C++ 中的字符串必须用双引号括起来，而不能用单引号。单引号仅用于单个字符。

字符串也是一个对象，其的数据结构是一个字符数组，也包含很多很多的函数，可以使用 `.` 来使用

#### 成员函数

| Member Function 成员函数                | Description 描述                                             |
| --------------------------------------- | ------------------------------------------------------------ |
| s.append(str)                           | 在字符串末尾添加文本                                         |
| s.compare(str)                          | 根据相对顺序返回-1、0或1。                                   |
| s.erase(index, length)                  | 从给定索引处开始删除字符串中的文本                           |
| s.find(str) s.rfind(str)                | 返回字符串 str 的起始位置在当前字符串中的第一个或最后一个索引（如果未找到，则返回 string::npos ）。 |
| s.insert(index, str)                    | 将文本添加到字符串的指定索引处                               |
| s.length() s.size()                     | 返回字符串中的字符数                                         |
| s.replace(index, len, str)              | 将指定索引处的 len 个字符替换为新文本                        |
| s.substr(start, length) s.substr(start) | 返回一个从起始位置 （包含起始位置）开始，长度为下一个 length 字符的新字符串；如果省略 length 参数，则获取字符串末尾到末尾为止的所有字符。 |

#### strlib.h

| Function Name 函数名称                                       | Description 描述                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| endsWith(str, suffix) startsWith(str, prefix)                | returns true if the given string begins or ends with the given prefix/suffix text 如果给定的字符串以给定的前缀/后缀文本开头或结尾，则返回 true。 |
| integerToString(int) realToString(double) stringToInteger(str) stringToReal(str) | returns a conversion between numbers and strings 返回数字和字符串之间的转换结果。 |
| equalsIgnoreCase(s1, s2)                                     | returns true if s1 and s2 have same chars, ignoring case 如果 s1 和 s2 具有相同的字符（忽略大小写），则返回 true。 |
| toLowerCase(str) toUpperCase(str)                            | returns an upper/lowercase version of a string (pass-by-value!) 返回字符串的大写/小写版本（按值传递！） |
| trim(str) 修剪(字符串)                                       | returns string with surrounding whitespace removed 返回一个已去除周围空格的字符串。 |

#### 修改字符串内容

python内的字符串是不可修改滴，but this diverges in cpp.

```cpp
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   string s = "hello";
   cout << s << endl;

   // This changes the character at index 0. I read "s[0]" out loud as "s-sub-zero."
   s[0] = 'Y';
   cout << s << endl;

   // We can concatenate a single character to a string using the + operator. We know
   // the w below is just a character (not a string) because it's in single quotes.
   s += 'w';
   cout << s << endl;

   // We can also concatenate an entire string.
   s += " squashes";
   cout << s << endl;

   return 0;
}

```

```python
result = ",".join([str(number) for number in numbers]) #这是python
```

#### 遍历字符串

```cpp
#include <iostream>
#include "console.h"
using namespace std;

int main()
{
   string s = "hello";

   // We can loop through a string using a for-loop.
   for (int i = 0; i < s.length(); i++)
   {
      cout << i << ": " << s[i] << endl;
   }

   cout << endl;
   for (char ch : s)   //有点像 python 中的 for i in list；
   {
      cout << ch << endl;
   }

   return 0;
}
```

#### cctype

| Member Function 成员函数 | Description 描述                                             |
| ------------------------ | ------------------------------------------------------------ |
| isalnum(ch)              | checks if a character is alphanumeric 检查字符是否为字母数字字符 |
| isalpha(ch)              | checks if a character is alphabetic 检查字符是否为字母       |
| islower(ch)              | checks if a character is a lowercase alphabetic character 检查字符是否为小写字母 |
| isupper(ch)              | checks if a character is an uppercase alphabetic character 检查字符是否为大写字母 |
| isdigit(ch)              | checks if a character is a digit 检查字符是否为数字          |
| isxdigit(ch)             | checks if a character is a hexadecimal character 检查字符是否为十六进制字符 |
| iscntrl(ch)              | checks if a character is a control character 检查角色是否为控制角色 |
| isgraph(ch)              | checks if a character is a graphical (i.e., visible) character 检查字符是否为图形字符（即可见字符）。 |
| isspace(ch)              | checks if a character is a space character (typically tab or space) 检查字符是否为空格字符（通常是制表符或空格） |
| isblank(ch)              | checks if a character is a blank character 检查字符是否为空白字符 |
| isprint(ch)              | checks if a character is a printing character according to locale 检查字符是否为区域设置中的可打印字符 |
| ispunct(ch)              | checks if a character is punctuation (visible non-alnum/non-space) 检查字符是否为标点符号（可见的非字母/非空格） |
| toupper(ch) 上标(ch)     | converts a character to uppercase (pass-by-value!) 将字符转换为大写（按值传递！） |
| tolower(ch) 降低(ch)     | converts a character to lowercase (pass-by-value!) 将字符转换为小写（按值传递！） |

#### 两种风格

C 语言风格

直接写 `“xyz”`

C++ 语言风格

`std::string s = "abc";`

`string s = "hello" + " there";` 这个操作就不行，因为C里面不能直接加字符串，只要有一个是C++风格才可以，如`string s = (string)"hello + " there"` / `string s = string("hello") + " there"` / `string s = std::string{"hello"} + " there"`

#### 初始化

`int a =3.14` 截掉小数部分

`int a(3.14)` 同上

`int a{3.14}` 大括号是更现代化的初始化操作，这样子的话，会编译失败，防止数据丢失
