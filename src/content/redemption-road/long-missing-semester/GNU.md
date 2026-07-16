# GNU make

## cc

cc 指的是C compiler，有clang，也有gcc，下面介绍cc这个命令的详情

### 参数

- 无参数，e.g. cc main.c
  - 会自动编译并且链接生成a.out

- -o

  - -o 实则就是重命名，将a.out 重命名为-o后的内容

- -c

  - 仅仅编译成目标文件.o 不链接

- -E

  - 做预处理，会展开#include，#define之类的

- -s 　

  - 编译到汇编语言

- -Wall

  - 打开常用警告

- -Werror

  - 只要有警告就错误

- -g

  - 打开调试信息

- -O

  - 优化等级

  - `-O0   不优化，适合调试`
    -O1   轻度优化
    -O2   常用优化
    -O3   更激进优化，不一定总是更快
    -Os   优化体积

- -I
  - 制定头文件的搜索目录,可以叠加
  - 注意这里只是告诉编译去哪里找头文件，并不知道源码的位置

### 子目录

- C语言中的`#include`表示预处理，先去某些目录里面找include的内容，然后复制展开到.c中（也就是.i文件，预处理文件）

  - `#include "add.h"`

    - 双引号是自己项目的头文件，头文件是函数声明的文件，具体实现是在同名.c文件中

    - ```
      1. 编译器自己的默认目录
      2. cc -I 指定的目录
      3. 系统默认头文件目录
      ```

  - `#include <stdio.h>`

    - 尖括号通常用于系统库、标准库、第三方库的头文件。

    - ```
      1. cc -I 指定的目录
      2. 编译器自己的默认目录
      3. 系统默认头文件目录
      ```

  - 系统默认头文件目录

    - 例如 Linux 上常见位置有：

    ```
    /usr/include
    /usr/local/include
    ```

    - GCC/Clang 自己也有一些内置头文件目录，比如：

    ```
    /usr/lib/gcc/...
    /usr/lib/clang/...
    ```

    - macOS 上更特殊，很多头文件在 SDK 目录里，例如类似：

    ```
    /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include
    ```





## 编译/链接/库

主线：

```
.c 源文件
   ↓ 预处理
.i 预处理文件
   ↓ 编译
.s 汇编文件
   ↓ 汇编
.o 目标文件
   ↓ 链接
可执行文件
```

### 1. 编译是“每个文件单独翻译”

比如你有：

```
main.c
foo.c
bar.c
```

编译器先分别翻译成机器码碎片：

```
main.c → main.o
foo.c  → foo.o
bar.c  → bar.o
```

这些 `.o` 文件还不是完整软件，只是一块块零件。

这里允许文件包含未定义的函数，但是一般不允许包含未定义的函数（至少从现代的c编译器来看）

------

### 2. 链接是“把零件拼成完整程序”

比如 `main.c` 里写了：

```
foo();
```

但 `foo()` 的真正实现写在 `foo.c` 里。

编译 `main.c` 的时候，编译器只知道：

```
哦，main 需要一个叫 foo 的函数。
```

但它还不知道 `foo` 的机器码在哪里。

链接阶段就负责把它们拼起来：

```
main.o + foo.o + bar.o + 一堆库
  ↓
可执行程序
```

所以链接就是：

**把你自己写的代码 + 别人写好的库，合成一个能运行的程序。**

------

### 3. 静态库 `.a`：直接打包进程序

Linux 上静态库一般长这样：

```
libblas.a
libmpi.a
```

如果你链接静态库，链接器会把用到的库代码直接塞进你的可执行文件里。

结果：

```
你的程序 = 你的代码 + BLAS代码 + MPI代码的一部分
```

优点：程序比较独立，拷到别处也更可能能跑。

缺点：文件大；库更新了，你的程序不会自动更新，得重新编译。

你可以理解成：

**静态链接 = 把参考书内容复印进你的作业里。**

------

### 4. 动态库 `.so`：程序运行时再去找

Linux 上动态库一般长这样：

```
libblas.so
libmpi.so
```

如果你链接动态库，可执行文件里面不会塞完整库代码，而是写一张表：

```
我运行的时候需要 libblas.so
我运行的时候需要 libmpi.so
```

等你真正运行程序时，系统再去找这些 `.so` 文件。

优点：程序小；多个程序可以共享同一个库；库升级方便。

缺点：运行时找不到库就炸。

你可以理解成：

**动态链接 = 作业里写“见某本参考书第几页”，运行时必须能找到那本书。**

## Makefile

### preview

rule like：⬇️

```makefile
target ... : prerequisites ...
    recipe
    ...
    ...
```

```makefile
edit : main.o kbd.o command.o display.o \
        insert.o search.o files.o utils.o
    cc -o edit main.o kbd.o command.o display.o \
        insert.o search.o files.o utils.o

main.o : main.c defs.h
    cc -c main.c
kbd.o : kbd.c defs.h command.h
    cc -c kbd.c
command.o : command.c defs.h command.h
    cc -c command.c
display.o : display.c defs.h buffer.h
    cc -c display.c
insert.o : insert.c defs.h buffer.h
    cc -c insert.c
search.o : search.c defs.h buffer.h
    cc -c search.c
files.o : files.c defs.h buffer.h command.h
    cc -c files.c
utils.o : utils.c defs.h
    cc -c utils.c
clean :
    rm edit main.o kbd.o command.o display.o \
        insert.o search.o files.o utils.o
```

例如此，基本流程是

输入make，没有后置，因此看第一个块，其target是edit

prerequisites中如果有一个以上的文件比target文件要新的话，recipe所定义的命令就会被执行。

这里的新值得是修改日期，每次编译完，这个make会自动同步源文件，头文件的修改日期，这样如果更新了源文件和头文件，下次meke就会去做

此时没有，因此触发下面的命令

```
我要生成 edit
↓
edit 依赖 main.o kbd.o command.o ...
↓
先检查这些依赖文件有没有、需不需要更新
↓
如果 main.o 没有，就先找 main.o 的生成规则
↓
执行 cc -c main.c，生成 main.o
↓
其他 .o 同理
↓
所有 .o 都生成完了
↓
最后才执行 cc -o edit main.o kbd.o ...
```

### 变量

```makefile
objects = main.o kbd.o command.o display.o \
    insert.o search.o files.o utils.o

edit : $(objects)
    cc -o edit $(objects)
main.o : main.c defs.h
    cc -c main.c
kbd.o : kbd.c defs.h command.h
    cc -c kbd.c
command.o : command.c defs.h command.h
    cc -c command.c
display.o : display.c defs.h buffer.h
    cc -c display.c
insert.o : insert.c defs.h buffer.h
    cc -c insert.c
search.o : search.c defs.h buffer.h
    cc -c search.c
files.o : files.c defs.h buffer.h command.h
    cc -c files.c
utils.o : utils.c defs.h
    cc -c utils.c
clean :
    rm edit $(objects)
```

### 自动推导

```
cc -c a.c
```

上述的结果是a.o，因此我们在写依赖关系的时候可以省去同名者

### 伪目标

```makefile
.PHONY : clean
clean :
		- rm edit $(object)
```

`.PHONY` 意思是伪目标，防止文件需要编译一个叫clean的可执行文件

clean一般放在文件末尾

### Makefile的包含

1. 显式规则：依赖关系

2. 隐式规则：如自动推导

3. 变量

4. 指令

   1. 类似include，引用另一个Makefile或者shell文件

      ```
      bar = ciallo.makefile bish bash
      include foo.make *.mk $(bar)
      ```

   2. 条件语句

      ```makefile
      ifeq ($(DEBUG), 1)
      CFLAGS = -g -Wall
      else
      CFLAGS = -O2
      endif
      ```

      如果debug代表的变量等于1，那么执行方式是打开调试信息和警告

      如果不是，那么就是正常执行

   3. define

      ```makefile
      #define PRINT_INFO
				echo "building..."
              echo "done"
      endef
      ```

      就是def呗

5. 注释，使用#，转义\

### .d

```makefile
CC = cc
CPPFLAGS = -Iinclude
CFLAGS = -Wall -g -MMD -MP

SRC = main.c add.c
OBJ = $(SRC:.c=.o)
DEP = $(OBJ:.o=.d)

main: $(OBJ)
	$(CC) $(OBJ) -o main

%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

-include $(DEP)
```

- `-MMD` 编译时顺便生成 .d 依赖文件

- `-MP` 给头文件生成空规则，避免头文件删除后 make 报奇怪错误

- `OBJ = $(SRC:.c=.o)`

  - 字面意思

- ```makefile
  %.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
  ```

  - 规则表⬇️，因此这里就是说从所有依赖那里生成目标

    ```
    $@   当前目标
    $<   第一个依赖
    $^   所有依赖
    针对某一个规则而言
    ```

- `-include main.d add.d`
  - makefile读取这个补充的依赖关系

### 额外的注意

- 主规则的依赖和下面的配方的目标要一样
  - 然后这个主规则的依赖需要标明具体的目录

```makefile
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -pedantic

SOURCES = $(wildcard *.cpp)
PROGRAMS = $(SOURCES:.cpp=)

.PHONY: all clean run

all: $(PROGRAMS)

%: %.cpp
	$(CXX) $(CXXFLAGS) $< -o $@

clean:
	rm -f $(PROGRAMS)


```



```makefile
$(wildcard *.cpp) #Wildcard 表示按照通配符来查找文件
```

```makefile
PROGRAMS = $(SOURCES:.cpp=) #表示把.cpp替换为空
```
