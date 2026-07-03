# 03 - Static Library

## 目标

写一个 Makefile，先把 `src/textutil.c` 编译成目标文件，再打包成静态库 `libtext.a`，最后把 `main.c` 和这个库链接成可执行文件 `textdemo`。

## 源码

- `include/textutil.h`: 库的头文件。
- `src/textutil.c`: 库的实现。
- `main.c`: 使用库的主程序。

## 你要实现的 Makefile 目标

- `make` 或 `make all`: 生成 `textdemo`。
- `make libtext.a`: 生成静态库。
- `make run`: 运行 `./textdemo`。
- `make clean`: 删除 `textdemo`、`libtext.a` 和 `.o` 文件。

## 推荐变量

- `CC = cc`
- `AR = ar`
- `CFLAGS = -Wall -Wextra -Werror -Iinclude`
- `LIB = libtext.a`
- `TARGET = textdemo`

## 手动编译参考

```sh
cc -Wall -Wextra -Werror -Iinclude -c src/textutil.c -o textutil.o
ar rcs libtext.a textutil.o
cc -Wall -Wextra -Werror -Iinclude -c main.c -o main.o
cc -o textdemo main.o libtext.a
./textdemo
```

## 期望输出

```text
original: make files can build libraries
upper: MAKE FILES CAN BUILD LIBRARIES
words: 5
starts with "make": yes
```

## 练习点

- `-Iinclude` 让编译器找到头文件。
- `ar rcs` 创建静态库。
- 静态库目标也可以是 Makefile target。
- 链接顺序通常是：需要库的对象文件在前，库文件在后。
