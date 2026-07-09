#### TLP 线程级并行

将任务拆成多个线程，同时运行

OS 负责：创建线程，调度线程，决定线程跑在哪个 CPU core上面，处理中断，同步等



#### DLP 数据级并行

让一个指令可以同时处理多个元素



#### 抽象

不用研究细节，提供便利性的接口



#### 从问题到执行



![image-20260709091919638](/redemption-assets/image-20260709091919638.png)



高级语言（c/…）编译成汇编语言，再通过汇编器汇编成为机器码，CPU 通过 ISA decode然后执行

微架构做的事情是：**把 ISA 规定的抽象指令，变成 CPU 内部真实可执行的硬件流程。**比如说用几个ALU



#### CPU 理解



![image-20260707200924206](/redemption-assets/image-20260707200924206.png)



##### program counter 程序计数器，PC

存储的是下一个要执行的指令的地址



##### current instruction 当前指令

不解释



##### register 寄存器

临时存数据，数量少但是速度很快



![image-20260707201201932](/redemption-assets/image-20260707201201932.png)





##### ALU arithmetic logic unit  算数逻辑单元

做基础计算的部件，CPU的计算器



##### control unit 控制单元

看current instruction，然后决定

是否读register，让ALU做加减法？结果写回哪个register？PC是顺序往后走还是跳转，是否访问内存 ,…



##### 三个概念

OS	OS 负责：创建线程，调度线程，决定线程跑在哪个 CPU core上面，处理中断，同步等

kernel	内核拥有最高权限，使用 CPU 提供的 ISA 来控制硬件资源，Windows 为NT，Macos 为XNU，Linux 为其本身

指令集	指令集是 CPU 能听得懂的语言，汇编出来的机器码通过 ISA 解码为 CPU 能执行的语言

**OS 是一整套系统软件；kernel 是这套系统软件里最核心、权限最高的那部分。**

```ASN.1
操作系统 OS
├── Kernel 内核            ← 最核心，直接管理硬件
├── 系统调用接口 syscall   ← 应用程序请求内核服务的入口
├── 系统库 / runtime       ← libc、Foundation、Win32 API 等
├── 系统服务 daemon/service ← 网络、登录、蓝牙、打印、时间同步等
├── 文件管理器 / Shell / GUI ← Finder、Explorer、桌面环境
└── 普通系统工具           ← ls、cp、设置、终端等
```



#### Cache line

CPU 从内存搬数据的最小单位是一个Cache line，例如64 byte；但是两个变量可能在同一个 Cache line里面，比如两个 int(4 byte per)

假如这时候两个程序同时要写入这个变量的值，那么就会出现两个线程抢同一个 Cache line 的情况，called false

sharing

避免方式是使用 alignas(64) ，在定义数据结构时候使用一个64-byte 对齐的数据结构，这样子可以保证不在同一个 Cache line 里面



#### byte？MiB?

bit 位 简写 b

Byte 字节 简写 B

KiB = kibibyte，二进制千字节

MiB = mebibyte，二进制兆字节

GiB = gibibyte，二进制吉字节









#### Trap 控制流被“陷入”内核处理

##### Interrupt

外部来的，CPU 本来在处理数据，结果突然有外部进程打断其

###### system call

一些有特权的操作

##### Exception

当前指令执行时出问题，或者当前指令主动请求 kernel 服务。
