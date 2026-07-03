可以，给你一份 **Git 常用指令速查表**。你先别背散的，按工作流记：**初始化/连接远程 → 查看状态 → 暂存 → 提交 → 推送/拉取 → 分支 → 撤销**。

------

## 0. 第一次配置 Git

```
git config --global user.name "你的名字"
git config --global user.email "你的GitHub邮箱"
```

查看配置：

```
git config --list
```

------

## 1. 本地项目连接 GitHub 仓库

进入项目目录：

```
cd /path/to/your/project
```

初始化：

```
git init
```

添加文件：

```
git add .
```

提交：

```
git commit -m "Initial commit"
```

改主分支名为 `main`：

```
git branch -M main
```

连接 GitHub 远程仓库：

```
git remote add origin git@github.com:你的用户名/仓库名.git
```

推送：

```
git push -u origin main
```

以后更新就只需要：

```
git add .
git commit -m "update"
git push
```

------

## 2. 查看状态类

查看当前修改状态：

```
git status
```

查看提交历史：

```
git log
```

简洁版提交历史：

```
git log --oneline
```

查看当前分支：

```
git branch
```

查看远程仓库地址：

```
git remote -v
```

------

## 3. 添加与提交

添加全部文件：

```
git add .
```

添加指定文件：

```
git add filename.py
```

提交：

```
git commit -m "这里写你改了什么"
```

修改上一次提交信息：

```
git commit --amend -m "新的提交信息"
```

------

## 4. 推送和拉取

推送到 GitHub：

```
git push
```

第一次推送某个分支：

```
git push -u origin main
```

从远程拉取最新代码：

```
git pull
```

更标准一点：

```
git pull origin main
```

只获取远程更新，但不自动合并：

```
git fetch
```

------

## 5. 克隆别人的仓库

SSH：

```
git clone git@github.com:用户名/仓库名.git
```

HTTPS：

```
git clone https://github.com/用户名/仓库名.git
```

------

## 6. 分支操作

查看分支：

```
git branch
```

创建新分支：

```
git branch dev
```

切换分支：

```
git switch dev
```

创建并切换：

```
git switch -c dev
```

合并分支，比如在 `main` 上合并 `dev`：

```
git switch main
git merge dev
```

删除本地分支：

```
git branch -d dev
```

强制删除：

```
git branch -D dev
```

推送新分支到远程：

```
git push -u origin dev
```

------

## 7. 撤销修改

查看具体改了什么：

```
git diff
```

撤销某个文件的未暂存修改：

```
git restore filename.py
```

撤销所有未暂存修改：

```
git restore .
```

把已经 `git add` 的文件取消暂存：

```
git restore --staged filename.py
```

取消全部暂存：

```
git restore --staged .
```

回退到上一次提交，但保留代码修改：

```
git reset --soft HEAD~1
```

回退到上一次提交，并取消暂存，但保留文件修改：

```
git reset --mixed HEAD~1
```

危险操作：回退到上一次提交，并丢弃修改：

```
git reset --hard HEAD~1
```

这个慎用，真的会把改动干掉。

------

## 8. 远程仓库操作

查看远程：

```
git remote -v
```

添加远程：

```
git remote add origin git@github.com:用户名/仓库名.git
```

修改远程地址：

```
git remote set-url origin git@github.com:用户名/新仓库名.git
```

删除远程：

```
git remote remove origin
```

------

## 9. `.gitignore`

创建：

```
nano .gitignore
```

常见内容：

```
__pycache__/
*.pyc
.env
.venv/
.DS_Store
.vscode/
.idea/

data/
datasets/
outputs/
runs/
checkpoints/
*.pt
*.pth
*.onnx
```

深度学习项目尤其注意：**别把数据集、模型权重、实验输出全传 GitHub**，仓库会炸。

如果某个文件已经被 Git 追踪了，再写进 `.gitignore` 不会自动生效。要取消追踪：

```
git rm --cached filename
```

取消追踪整个目录：

```
git rm -r --cached data/
```

然后：

```
git add .
git commit -m "update gitignore"
```

------

## 10. 临时保存修改：stash

当前代码改了一半，但想先切分支：

```
git stash
```

查看 stash：

```
git stash list
```

恢复最近一次 stash：

```
git stash pop
```

只恢复但不删除 stash：

```
git stash apply
```

------

## 11. 最常用日常流程

你平时基本就是这个：

```
git status
git add .
git commit -m "描述这次修改"
git push
```

如果多人协作，开始写代码前先：

```
git pull
```

完整一点就是：

```
git pull
git status
git add .
git commit -m "update xxx"
git push
```

------

## 12. 你现在最该熟的十个

```
git init
git clone
git status
git add .
git commit -m "message"
git push
git pull
git branch
git switch -c new_branch
git log --oneline
```

一句话记法：

**`add` 是放进暂存区，`commit` 是存进本地仓库，`push` 是传到 GitHub。**

这三步别混：

```
工作区修改 → git add → 暂存区 → git commit → 本地仓库 → git push → GitHub
```
