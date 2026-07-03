# 04 - Debug, Release, and Test

## 目标

写一个更像真实项目的 Makefile：源码在 `src/`，头文件在 `include/`，测试在 `tests/`。

## 源码

- `include/student.h`: 成绩统计接口。
- `src/student.c`: 成绩统计实现。
- `src/main.c`: 主程序。
- `tests/test_student.c`: 简单测试程序。

## 你要实现的 Makefile 目标

- `make` 或 `make all`: 默认生成调试版或普通版 `gradebook`，你自己决定。
- `make debug`: 使用 `-g -O0 -DDEBUG` 生成 `gradebook`。
- `make release`: 使用 `-O2` 生成 `gradebook`。
- `make run`: 运行 `./gradebook`。
- `make test`: 生成并运行测试程序 `student_test`。
- `make clean`: 删除可执行文件和 `.o` 文件。

## 推荐变量

- `CC = cc`
- `CPPFLAGS = -Iinclude`
- `WARNINGS = -Wall -Wextra -Werror`
- `DEBUG_FLAGS = -g -O0 -DDEBUG`
- `RELEASE_FLAGS = -O2`
- `TARGET = gradebook`
- `TEST_TARGET = student_test`

## 手动编译参考

```sh
cc -Iinclude -Wall -Wextra -Werror -g -O0 -DDEBUG -c src/student.c -o student.o
cc -Iinclude -Wall -Wextra -Werror -g -O0 -DDEBUG -c src/main.c -o main.o
cc -o gradebook main.o student.o
./gradebook

cc -Iinclude -Wall -Wextra -Werror -c tests/test_student.c -o test_student.o
cc -o student_test test_student.o student.o
./student_test
```

## 期望主程序输出

```text
[debug] loaded 4 students
average: 86.25
top: Mia 99
passing: 3
```

如果不是 debug 编译，第一行 `[debug] loaded 4 students` 不应该出现。

## 期望测试输出

```text
student tests passed
```

## 练习点

- `CPPFLAGS` 和 `CFLAGS` 分工。
- `debug` / `release` 目标设置不同编译选项。
- `test` 目标既构建又运行。
- 测试程序不应该链接 `src/main.o`。
- 进阶：把 `.o` 文件放到 `build/` 目录，并用 `mkdir -p` 创建目录。
- 进阶：使用自动变量 `$@`、`$<`、`$^`。
