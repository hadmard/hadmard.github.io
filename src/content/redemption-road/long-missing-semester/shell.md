# Terminal - Shell

## 配置

### 简介

- **Terminal / 终端**：提供你输入命令、显示结果的“窗口界面”，可以理解为UI
  - Terminal、iTerm2
- **Shell / 命令解释器**：真正解析你输入的命令，并决定怎么执行
  - PowerShell；CMD
  - zsh；bash；fish

### 过程

- Terminal 从用户获取输入，然后传递给 Shell，等待 Shell 处理完后，将结果再传递回用户（显示在屏幕上）
- Shell 从 Terminal 拿到输入指令，解析后交给操作系统执行，然后将结果返回给 Terminal

### 推荐

- Mac 的终端使用iTerm2，可惜没有汉化，太难受了，我还是坚持使用terminal
- shell配置使用oh-my-zsh，主题使用powerlevel10k

## 常用命令

### 文件目录操作

- pwd = 当前目录
  - ～ home；.当前目录；..上一级目录
  - /左偏，unix系统更加开放，自由；\右偏，windows系统更加保守
- ls 
  - -a 所有，包括隐藏
  - -l 详细的信息，修改日期，大小，文件权限之类
- touch mkdir
- cp  复制
  - -i 询问是否覆盖，比较安全
  - -v 显示复制的过程
  - -iv 可以一起使用
  - -r 复制文件夹
  - cp a b ,复制a，命名为b
  - cp a folder_b 把a复制到b路径
- rm  删除
  - -r 删除目录
  - -f 强制删除
- find 
  - find . -name "a.txt" 从.目录中找名字为a.txt的文件
  - find . -name "*.txt" 找所有txt
  - -type 
    - d 文件夹
    - f 文件

### 文件查看

- cat
  - -n 带着行号
  - 也有拼接的作用
- head/tail 输出前/后十行
  -  -n lines,输出前/后lines行
- more/less 
  - 分页器，空格翻页，回车下一行，q退出；less功能比more多，按照前面的配置，cat -n 就是分页器了
- hexdump 十六进制输出
  - -C 并排输出十六进制与 ASCII（实际值）
    - 

![image-20260702134755876](/redemption-assets/image-20260702134755876.png)


  - -n N，输出前N个字节

### 其他

- man：查看命令文档（manual）
- echo：输出字符串（常配合重定向 / 管道使用）
  - echo "Hello Linux”
    - 终端回复如上
  - echo \$USER
    - 回复变量值
  - echo "test" > test.txt
    - 创建文件并且写入，后面的重定向会讲
  - echo "again" >> test.txt
    - 追加在末尾
- whoami：获取当前用户
- whereis/which/whence：查找命令所在位置
- clear：清屏
- chmod：更改文件权限
- ps：显示进程信息
- date：获取当前日期时间
- kill：杀死进程（向进程发送信号）
- grep：搜索文件内容（常配合重定向 / 管道使用）
  - `grep "apple" a.txt`,在a中找含apple
  - -n 显示行号
  - -i 忽略大小写
  - -v 显示不包含apple的行
  - -r 在该目录下的所有目录找
  - -w 严格搜索，包含不行
  - \-E a|b 查找含a或b的行

- diff：比较文件 / 目录内容
  - diff *file1* *file2* > *file3*：将 *file1* 和 *file2* 的差异写入 *file3*
- curl：发送 HTTP 请求
- wget：下载文件

## 重定向

- 标准的管线
  - 0 stdin   标准输入   默认来自键盘
  - 1 stdout  标准输出   默认显示到屏幕
  - 2 stderr  标准错误   默认显示到屏幕
- 但是shell可以更改管线
  - `>`，同`1>`就是更改输出使用的,这个会覆写原文件
    - 如`python main.py > out.txt`，将python的输出写进txt
  - `>>`追加到文件的末尾
  - `<`把文件的内容作为输入
  - `2>`把错误输出写进文件
  - `&>`不管正确还是错误都写进去
- 分析例子
  - `python main.py > all.txt 2>&1`
  - 意思就是1号流写入txt，&1值的是一号流对应的位置，这里就是说2号流去一号流所在的位置

## 管线

### 核心

- `cat a.txt | grep hello`，左边的输出送到右边的输入

## 环境变量

- 两种方式，一个是暂时用，一个是写入配置文件，有点像赋值
