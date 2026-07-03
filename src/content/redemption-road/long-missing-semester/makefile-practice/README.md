# Makefile Practice Projects

这些小项目是给你练 Makefile 用的：源码是完整的，但每个目录都故意没有 Makefile。

建议顺序：

1. `01-hello-cli`: 练最基本的目标、命令、变量和 `clean`。
2. `02-multi-file-calc`: 练 `.c -> .o -> executable`、头文件依赖和增量编译。
3. `03-static-library`: 练 `ar rcs`、静态库和链接顺序。
4. `04-debug-release-test`: 练目录结构、`debug`、`release`、`test`、`run`、自动变量和条件变量。

通用要求：

- recipe 行必须以 tab 开头。
- 先写最笨的版本，再逐步引入变量、自动变量和模式规则。
- 推荐编译选项：`-Wall -Wextra -Werror`。
- 每次改完 Makefile 后试试 `make clean && make`。
- 不要急着一次写完，Makefile 很适合一层一层长出来。

你可以先用 README 里的手动 `cc` 命令确认程序怎么编译，再把这些命令抽象成 Makefile 规则。
