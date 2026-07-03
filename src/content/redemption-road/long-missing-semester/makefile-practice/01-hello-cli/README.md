# 01 - Hello CLI

## 目标

写一个 Makefile，把 `main.c` 编译成可执行文件 `hello`。

## 源码

- `main.c`: 单文件 C 程序。

## 你要实现的 Makefile 目标

- `make` 或 `make all`: 生成 `hello`。
- `make run`: 运行 `./hello`。
- `make clean`: 删除 `hello`。

## 推荐变量

- `CC = cc`
- `CFLAGS = -Wall -Wextra -Werror`
- `TARGET = hello`

## 手动编译参考

```sh
cc -Wall -Wextra -Werror -o hello main.c
./hello
./hello yifei
```

## 期望输出

```text
hello, make
hello, yifei
```

## 练习点

- 默认目标。
- `target: prerequisites`。
- `clean` 伪目标。
- `-o` 指定输出文件名。
