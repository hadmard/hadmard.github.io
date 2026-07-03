# 02 - Multi-File Calculator

## 目标

写一个 Makefile，把多个 `.c` 文件分别编译成 `.o`，再链接成可执行文件 `calc`。

## 源码

- `main.c`: 程序入口。
- `calc.h` / `calc.c`: 加减乘除逻辑。
- `format.h` / `format.c`: 输出格式。

## 你要实现的 Makefile 目标

- `make` 或 `make all`: 生成 `calc`。
- `make run`: 运行 `./calc`。
- `make clean`: 删除 `calc` 和所有 `.o` 文件。

## 推荐变量

- `CC = cc`
- `CFLAGS = -Wall -Wextra -Werror`
- `OBJS = main.o calc.o format.o`
- `TARGET = calc`

## 手动编译参考

```sh
cc -Wall -Wextra -Werror -c main.c
cc -Wall -Wextra -Werror -c calc.c
cc -Wall -Wextra -Werror -c format.c
cc -o calc main.o calc.o format.o
./calc
```

## 期望输出

```text
add(21, 6) = 27
subtract(21, 6) = 15
multiply(21, 6) = 126
divide(21, 6) = 3
```

## 练习点

- 每个 `.c` 文件单独编译。
- 链接多个 `.o` 文件。
- 头文件变化时触发重新编译。
- 用变量减少重复。
- 进阶：把重复的 `.c -> .o` 规则改成模式规则。
