## Git操作

### Overview

- 工作区

- 暂存区 add

- 本地仓库 commit

  ```bash
  git init #最小化流程
  git status
  git add README.md
  git restore --staged README.md #如果不小心添加了可以如此移除
  git commit -m "docs: add readme"
  git log --oneline --graph
  ```



### 基础用法

#### 文件管理

```bash
git add file
git rm file #从版本仓库删除 file
git rm --cached file #本地文件保留，但从 Git 跟踪中移除
git mv old_name new_name #等价于移动文件后再告诉 Git 删除旧名、添加新名
git status
```

- 这里解释一下两个 `rm`
  - 第一个是物理意义的删除这个文件，暂存区和工作区一起删除，下一次commit时候会忽略，再下一次就没这个限制了
  - 第二个是暂存区删除，工作区还留着，但是下一次commit时候会忽略，再下一次就没这个限制了
- `mv` 则是物理上，工作区改名了；然后暂存区如果有这个文件，也对应改名，之前都不变

#### commit

- Angular 风格的 commit message，大意是：

```
type(scope): summary
```

- 常见 type：

```
feat      新功能
fix       修 bug
docs      文档
refactor  重构
test      测试
ci        CI 配置
```

#### 查看历史

```bash
git log
git log --oneline
git log --oneline --graph --all
git show <commit-id>
git diff
git diff --staged
git checkout <commit-id> #每个 commit 都有一个 SHA-1 标识。完整是 40 位十六进制数，但平时只写前几位就够，只要不冲突。
```

#### 分支

 `git branch 新分支的名字 指定的节点，没说就是HEAD`

-f 强制 -d 删除分支



#### rebase

`git rebase 分支`，把HEAD和main不一样的部分移到main分支的最新进度之下

`git rebase -i `



#### HEAD

这里的节点也可以使用 `～x` / `^^^`这样的

^意思是到第几个父提交，～是往上走几步

#### 撤销改动

`git reset 节点*` 将当前的head回撤到节点\*

`git revert HEAD` 在当前节点往后延伸一个节点，所做的操作是撤销更改

#### `.gitignore`

- \* 通配符 **表示中间目录无论有无
  - a/**/b 可以表示 a/b、a/x/b、a/x/y/b
  - ! 取消忽略
    - `git check-ignore -v file`：查看某个文件是否被忽略，以及匹配的规则
