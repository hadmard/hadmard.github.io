# Lab 1 简单集群搭建实验报告

## 一、AI Agent 使用情况

主要使用的平台是 Claude Code，版本为 `Claude Code v2.1.153`，模型服务提供方为 DeepSeek，模型为 `deepseek-v4-pro`。在后期整理报告格式时，也使用了 OpenAI Codex 桌面端辅助核对截图、提炼命令输出和补齐报告结构。

AI Agent 的具体作用主要有三类：第一，辅助我理解一些基础概念；第二，辅助定位报错，例如 HPL 一开始提示的报错；第三，整理实验记录，把截图中的关键信息转写成报告文字。实际的虚拟机配置、命令执行、截图验证和错误修复都是我在本地通过 SSH 完成的。

## 二、实验环境与集群概况

本实验在 macOS 宿主机上的 VMware Fusion 虚拟机中完成。由于直接使用虚拟机终端不方便，我主要在 macOS 终端中通过 SSH 连接各个虚拟机，并配置了免密登录、反向代理、`hostname` 与 IP 地址映射。四台虚拟机位于同一个 `172.16.1.0/24` 虚拟网络中，节点之间可以通过主机名互相访问。

| 节点 | 角色 | IP 地址 | 操作系统 | CPU/内存配置 |
| --- | --- | --- | --- | --- |
| `master` | 控制节点、NFS 服务器、Slurm 控制节点 | `172.16.1.132` | Debian GNU/Linux 13.5 (trixie), aarch64 | 2 vCPU, 2GB 内存 |
| `node01` | 计算节点、NFS 客户端、Slurm 计算节点 | `172.16.1.133` | Debian GNU/Linux 13.5 (trixie), aarch64 | 2 vCPU, 2GB 内存 |
| `node02` | 计算节点、NFS 客户端、Slurm 计算节点 | `172.16.1.134` | Debian GNU/Linux 13.5 (trixie), aarch64 | 2 vCPU, 2 GB 内存 |
| `node03` | 计算节点、NFS 客户端、Slurm 计算节点 | `172.16.1.135` | Debian GNU/Linux 13.5 (trixie), aarch64 | 2vCPU,2GB 内存 |

共享目录为 `/scratch`。在 `master` 上通过 NFS 导出，`node01`、`node02`、`node03` 均挂载 `master:/scratch`，这样 HPL 可执行文件、输入文件和 Slurm 输出文件可以放在同一个目录下。Slurm 分区为 `debug`，包含 `node01` 到 `node03` 三个计算节点，总计 6 个 CPU，配置中的内存总量为 5400 MB。

主要软件版本如下：

| 软件 | 版本或说明 |
| --- | --- |
| OpenMPI | 5.0.3，安装到 `/usr/local` |
| BLAS | Netlib BLAS 3.12.0，生成 `blas_LINUX.a` |
| CBLAS | 使用课程仓库中的 CBLAS 源码，生成 `cblas_LINUX.a` |
| HPL | HPL 2.3，生成 `xhpl` |
| Slurm | 24.11.5 |
| MUNGE | 0.5.16 |
| NFS | `nfs-kernel-server` / `nfs-common` 2.8.3 |

## 三、软件编译

本部分在 `master` 节点完成。源码主要放在 `/home/yifei/hpc101-lab1/src`，包括 `openmpi-5.0.3`、`BLAS-3.12.0`、`CBLAS` 和 `hpl-2.3`。整体流程是先编译并安装 OpenMPI，再编译 BLAS 和 CBLAS，最后在 HPL 的 `Make.Linux_PII_FBLAS` 中配置 MPI、BLAS、CBLAS 的路径并编译出 `xhpl`。

### 1. OpenMPI

我下载并编译了 OpenMPI 5.0.3，安装位置为 `/usr/local`。编译安装完成后执行 `ompi_info --all`，截图中可以看到 `Open MPI: 5.0.3`、`Prefix: /usr/local`、`Configured architecture: aarch64-unknown-linux-gnu` 等信息，说明 OpenMPI 已经正确安装。



![OpenMPI ompi_info 输出](/redemption-assets/image-20260607201627519.png)



### 2. BLAS 与 CBLAS

随后编译 Netlib BLAS 3.12.0。编译结束后在 `BLAS-3.12.0` 目录中出现了 `blas_LINUX.a`，说明 BLAS 静态库生成成功。



![BLAS 编译后生成 blas_LINUX.a](/redemption-assets/image-20260607201959525.png)



CBLAS 使用课程仓库中提供的源码。配置 `Makefile.in` 时需要把 `BLLIB` 指向刚刚生成的 `blas_LINUX.a`。编译完成后进入 `CBLAS/lib`，可以看到生成的 `cblas_LINUX.a`。



![CBLAS 编译后生成 cblas_LINUX.a](/redemption-assets/image-20260607203930120.png)



### 3. HPL

HPL 使用 2.3 版本源码。编译时我以 `setup/Make.Linux_PII_FBLAS` 为模板，修改其中的 `TOPdir`、`MPdir`、`MPlib`、`LAdir`、`LAlib` 和 `LINKER` 等路径，使其分别指向 HPL 顶层目录、OpenMPI 安装目录、MPI 动态库以及 BLAS/CBLAS 静态库。编译结束后，在 `hpl-2.3/bin/Linux_PII_FBLAS` 中生成了 `HPL.dat` 和 `xhpl`。



![HPL 编译后生成 HPL.dat 和 xhpl](/redemption-assets/image-20260607211556784.png)



这一部分最容易混淆的是“编译”和“链接”的区别。BLAS 和 CBLAS 生成的是库文件，HPL 本身最终需要把 MPI 通信库和线性代数库都链接进去，才能得到可运行的 `xhpl`。

## 四、NFS 配置与验证

为了让所有计算节点都能访问同一份 HPL 可执行文件、输入文件和输出文件，我在 `master` 节点上配置 NFS，将 `/scratch` 作为共享目录。`/etc/exports` 中与本实验相关的配置如下：

```text
/scratch *(rw,async,no_subtree_check,no_root_squash)
```

截图中也可以看到 `/scratch` 被配置为可读写共享目录。



![master 节点 /etc/exports 配置](/redemption-assets/image-20260607213712518.png)



在计算节点侧，`node01`、`node02`、`node03` 均挂载了 `master:/scratch`。为了验证读写是否真正共享，我在 `node03` 的 `/scratch` 中执行 `sudo touch node03.md` 创建测试文件。



![node03 在 /scratch 中创建文件](/redemption-assets/image-20260607213924199.png)



随后回到 `master` 节点执行 `ls /scratch`，能够看到同一个 `node03.md` 文件，说明 NFS 服务端和客户端之间的读写共享已经生效。



![master 节点看到 node03 创建的文件](/redemption-assets/image-20260607213951710.png)



## 五、Slurm 配置与验证

Slurm 集群使用 `master` 作为控制节点，`node01`、`node02`、`node03` 作为计算节点。`slurm.conf` 中的核心配置如下：

```text
ClusterName=cluster
SlurmctldHost=master(172.16.1.132)
NodeName=node01 NodeAddr=172.16.1.133 CPUs=2 RealMemory=1800 State=UNKNOWN
NodeName=node02 NodeAddr=172.16.1.134 CPUs=2 RealMemory=1800 State=UNKNOWN
NodeName=node03 NodeAddr=172.16.1.135 CPUs=2 RealMemory=1800 State=UNKNOWN
PartitionName=debug Nodes=node0[1-3] Default=YES MaxTime=INFINITE State=UP
```

使用 `sinfo` 查看节点状态时，`debug` 分区处于 `up` 状态，三个节点均为 `idle`，说明 Slurm 控制节点和计算节点已经正常通信。



![sinfo 显示 debug 分区三个节点 idle](/redemption-assets/image-20260607222612419.png)



我先用一个简单的 hostname 作业验证 Slurm 是否能够跨节点启动任务。命令 `srun -N3 -n3 hostname` 返回了三个计算节点的主机名，说明 Slurm 可以在三个节点上各启动一个任务。



![srun hostname 跨节点测试](/redemption-assets/image-20260607223756948.png)



用于测试的 `slurm.sh` 内容如下：

```bash
#!/bin/bash
#SBATCH -J homework_of_yifei
#SBATCH -N 3
#SBATCH -n 3
#SBATCH -o /scratch/slurm-%j.out
#SBATCH -e /scratch/slurm-%j.err

echo "Job started at $(date)"
echo "Running hosts:"
srun hostname
echo "Job finished at $(date)"
```



![Slurm hostname 测试脚本](/redemption-assets/image-20260607223251125.png)



提交脚本后，Slurm 返回 `Submitted batch job 12`，并在 `/scratch` 中生成对应的 `slurm-12.out` 与 `slurm-12.err`。输出文件中记录了 `node01`、`node02`、`node03`，进一步验证了批处理作业可以正常运行。



![sbatch slurm.sh 提交成功](/redemption-assets/image-20260607225606913.png)



## 六、HPL 作业提交与性能结果

在完成 HPL 编译、NFS 共享目录和 Slurm 配置后，我将 `xhpl` 与 `HPL.dat` 放到 `/scratch/mpl` 下，保证所有计算节点都能通过 NFS 访问同一份文件。最终使用的 Slurm 作业脚本为 `/scratch/slurm1.sh`：

```bash
#!/bin/bash
#SBATCH -J hpl
#SBATCH -p debug
#SBATCH --ntasks-per-node=1
#SBATCH -N 3
#SBATCH -n 3
#SBATCH -o /scratch/hpl-%j.out
#SBATCH -e /scratch/hpl-%j.err

cd /scratch/mpl
srun --mpi=pmix hostname
srun --mpi=pmix ./xhpl

echo "finished"
```

`HPL.dat` 中本次测试的关键参数如下：

| 参数 | 值 | 说明 |
| --- | --- | --- |
| `N` | `1000` | 矩阵规模 |
| `NB` | `128` | 分块大小 |
| `P` | `1` | MPI 进程网格行数 |
| `Q` | `3` | MPI 进程网格列数 |

Slurm 脚本中申请了 `-N 3`、`-n 3`，即总共启动 3 个任务；HPL 中 `P * Q = 1 * 3 = 3`，正好等于 Slurm 实际启动的 MPI 进程数。如果这两个值不一致，HPL 就无法按输入文件中的进程网格运行。

第一次运行时我遇到了报错。错误文件中显示：

```text
HPL ERROR from process # 0, on line 419 of function HPL_pdinfo:
>>> Need at least 3 processes for these tests <<<
```

原因是作业脚本中最初直接使用 `srun ./xhpl`，没有明确指定 MPI 插件，Slurm 没有按 HPL 需要的 MPI 方式启动任务。修改为 `srun --mpi=pmix ./xhpl` 后，三个 MPI 进程能够正常参与计算。



![HPL 初次运行报错](/redemption-assets/image-20260608001419828.png)



修改后作业成功运行，输出文件为 `/scratch/hpl-20.out`。输出开头先打印三个节点名，说明任务分布到了 `node03`、`node01`、`node02` 三个节点；随后 HPL 显示使用 `N=1000`、`NB=128`、`P=1`、`Q=3` 进行测试。



![HPL 成功运行输出](/redemption-assets/image-20260608001740770.png)



最终 HPL 共完成 18 组测试，18 组均通过 residual check，没有失败或跳过的测试。部分性能结果如下：

```text
T/V                N    NB     P     Q               Time                 Gflops
WR00L2L2        1000   128     1     3               0.09             7.1651e+00
WR00L2L4        1000   128     1     3               0.09             7.8603e+00
WR00L2C4        1000   128     1     3               0.08             7.9551e+00
WR00R2L4        1000   128     1     3               0.10             6.4320e+00

Finished     18 tests with the following results:
             18 tests completed and passed residual checks,
              0 tests completed and failed residual checks,
              0 tests skipped because of illegal input values.
```

本次最高性能为 `7.9551e+00 Gflops`。由于本实验运行在资源较小的虚拟机中，并且使用的是教学用的 Netlib BLAS，性能绝对值并不是重点；更重要的是完成了从源码编译、NFS 共享、Slurm 调度到 HPL 多节点运行的完整流程。

## 七、提交附件说明

见 `./attachments/` 目录中

| 文件 | 内容 |
| --- | --- |
| `attachments/slurm1.sh` | HPL 的 Slurm 作业脚本 |
| `attachments/hpl-20.out` | HPL 成功运行的完整输出 |
| `attachments/hpl-19.err` | HPL 初次运行失败时的错误输出 |
| `attachments/HPL.dat` | HPL 输入参数文件 |
| `attachments/slurm.sh`、`attachments/slurm-12.out` | Slurm hostname 测试脚本与输出 |
| `attachments/slurm.conf`、`attachments/exports` | Slurm 和 NFS 的完整配置 |
