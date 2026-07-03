# Lab 0 Linux 快速入门实验记录

本实验主要用于熟悉 Linux 虚拟机、命令行、SSH、Git 以及 AI Coding Agent 的基本使用。实验环境为 macOS 宿主机上的 VMware Fusion 虚拟机，虚拟机系统为 Debian GNU/Linux 13。

## Task 1.1 Debian ISO 哈希校验

我下载的是 Debian 13.5.0 arm64 镜像，并先在镜像站的 `SHA256SUMS` 文件中查找对应条目。截图中可以看到该镜像的 SHA256 值为：

```text
6f015e644a0e7f597adcf00761973efb567fee01daa64bee45ec79736e991596
```



![SHA256SUMS 中的 Debian 镜像哈希值](/redemption-assets/image-20260601200102198.png)



随后在 macOS 终端使用 `shasum -a 256 debian-13.5.0-arm64-DVD-1.iso` 对本地 ISO 文件计算哈希值，得到的结果与镜像站完全一致，说明下载文件未损坏。



![本地 Debian ISO 哈希校验结果](/redemption-assets/image-20260601200126170.png)



## Task 2.1 nano 编辑器

根据任务要求，我在终端中使用 `nano` 创建并编辑了一个文本文件。截图中能看到 GNU nano 8.4 的编辑界面，以及写入的测试内容。这一步主要是熟悉终端文本编辑器的基本输入和保存流程。



![使用 nano 编辑文本文件](/redemption-assets/image-20260601195824655.png)



## Task 3.2 网络连通性与 SSH

在从宿主机访问虚拟机之前，我先通过 `ping 172.16.1.131` 验证网络连通性。截图中可以看到 ICMP 请求持续收到回复，延迟稳定在 1 ms 以内，说明宿主机和虚拟机处于可通信的虚拟网络中。



![宿主机 ping 虚拟机 IP](/redemption-assets/image-20260601193431759.png)



随后使用 `ssh yifei@172.16.1.131` 登录虚拟机。首次连接时需要确认主机指纹，确认后该主机会被加入 `known_hosts`。登录成功后终端显示 Debian GNU/Linux 系统信息，说明 SSH server 已正常工作。



![首次 SSH 登录 Debian 虚拟机](/redemption-assets/image-20260601193754216.png)



## Task 5.2 Git SSH 连接验证

我生成并配置了 GitLab 使用的 SSH 公钥，然后通过 `ssh -T git@git.zju.edu.cn` 验证连接。截图中出现 `Welcome to GitLab`，说明本地 SSH key 已经能够被 ZJU GitLab 正确识别。



![ZJU GitLab SSH key 验证成功](/redemption-assets/image-20260601195403686.png)



## Task 6.1 AI Agent 安装与首次对话

我安装并启动了 Claude Code 客户端，截图中显示版本为 `Claude Code v2.1.153`。当时配置的模型服务为 DeepSeek，模型为 `deepseek-v4-pro`。首次对话中我询问了模型身份，Agent 返回了对应模型和服务提供方信息。



![Claude Code 首次对话与模型信息](/redemption-assets/image-20260601200604027.png)



本次 Lab0 中 AI Agent 的作用主要是辅助理解命令行概念、解释 SSH/Git 报错含义，以及帮助检查实验记录的表达是否清楚；实际命令执行和截图验证仍由我在本地环境中完成。
