#### TLP 线程级并行

将任务拆成多个线程，同时运行

OS 负责：创建线程，调度线程，决定线程跑在哪个 CPU core上面，处理中断，同步等



#### DLP 数据级并行

让一个指令可以同时处理多个元素



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

kernel	内核拥有最高权限，使用 CPU 提供的 ISA 来控制硬件资源

指令集	指令集是 CPU 能听得懂的语言



##### Trap 控制流被“陷入”内核处理
