# DevOps 环境配置实验报告

## 1. 实验目标

根据以下两篇笔记完成本机命令行环境、Git、GPG、GitHub CLI 和 Neovim 的基础配置，并记录每一项改动的作用，方便之后复习。

- 参考资料：<https://note.tonycrane.cc/devops/system/shell/>
- 参考资料：<https://note.tonycrane.cc/devops/system/git/>

## 2. 实验环境

- 系统：macOS Darwin arm64
- Shell：zsh
- 包管理器：Homebrew，路径为 `/opt/homebrew`
- 用户目录：`~`
- Git 用户名：`yifei`
- Git 邮箱：`yfcccc@zju.edu.cn`

## 3. 实验前状态

实验开始前，本机已经存在以下内容：

- `~/.zshrc` 已经启用 oh-my-zsh。
- `~/.zshrc` 已经设置 `ZSH_THEME="powerlevel10k/powerlevel10k"`。
- `~/.oh-my-zsh` 和 powerlevel10k 主题目录已经存在。
- `~/.gitconfig` 已经配置 Git 用户名和邮箱。
- `~/.gitconfig` 已经配置 Git HTTP/HTTPS 代理为 `http://127.0.0.1:7897`。

实验开始前缺少或未完成的内容：

- `gh`、`gpg`、`nvim`、`bat` 等命令尚未安装或尚不可用。
- oh-my-zsh 插件只有 `git`，没有启用 autosuggestions 和 syntax highlighting。
- Git 尚未启用 GPG 签名。
- GitHub CLI 尚未登录。
- 本机没有可用于 Git commit 签名的 GPG 私钥。

## 4. 备份操作

### 4.1 备份原始 shell/Git 配置

备份目录：

```text
~/Documents/Codex/2026-07-02/https-note-tonycrane-cc-devops-system/work/backups-20260702-105311
```

备份内容：

- `~/.zshrc`
- `~/.gitconfig`
- 如果存在则备份 `~/.gnupg/gpg-agent.conf`

用途：

- 这些文件是登录 shell 和 Git 全局行为的核心配置。
- 先备份可以防止配置写错后无法恢复。

### 4.2 备份 p10k 旧配置

备份目录：

```text
~/Documents/Codex/2026-07-02/https-note-tonycrane-cc-devops-system/work/p10k-reset-20260702-110014
```

备份内容：

- `~/.p10k.zsh`
- `~/.cache/p10k-instant-prompt-yifei.zsh`
- `~/.cache/p10k-instant-prompt-yifei.zsh.zwc`

用途：

- `~/.p10k.zsh` 是 Powerlevel10k 的个人外观配置。
- instant prompt 缓存会影响终端刚打开时显示的提示符效果。
- 重置 p10k 前备份，方便以后恢复旧样式。

## 5. Homebrew 工具安装

执行的主要安装目标：

```zsh
brew install gnupg pinentry-mac gh neovim bat tree-sitter-cli
```

安装内容和用途：

| 工具 | 用途 |
| --- | --- |
| `gnupg` | 提供 `gpg` 命令，用来生成 GPG 密钥、导出公钥、签名 Git commit。 |
| `pinentry-mac` | macOS 图形化密码输入程序，让 GPG 可以通过系统弹窗输入和记住私钥密码。 |
| `gh` | GitHub CLI，用于 GitHub 登录、配置 Git 凭据、上传 GPG 公钥。 |
| `neovim` | 安装新版 `nvim` 编辑器。 |
| `bat` | 替代 `cat`，输出文件时支持语法高亮。 |
| `tree-sitter-cli` | Neovim treesitter parser 编译需要用到的 `tree-sitter` 命令。 |

补充说明：

- Homebrew 还自动安装了这些工具所需的依赖库。
- 自动依赖是包管理器内部需要，不属于手写配置，但会出现在 Homebrew 安装记录里。

验证方式：

```zsh
command -v gpg gh nvim bat tree-sitter
brew list --formula | rg '^(gnupg|pinentry-mac|gh|neovim|bat|tree-sitter-cli)$'
```

## 6. zsh 和 oh-my-zsh 配置

修改文件：

```text
~/.zshrc
```

### 6.1 添加 Homebrew 环境初始化

新增内容：

```zsh
if [[ -x /opt/homebrew/bin/brew ]]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi
```

用途：

- 让新打开的 zsh 自动识别 Homebrew 安装的命令。
- 例如 `gpg`、`gh`、`nvim`、`bat` 都安装在 `/opt/homebrew/bin` 下。
- 如果不初始化，某些新终端可能找不到这些命令。

### 6.2 安装 oh-my-zsh 插件源码

新增目录：

```text
~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
```

用途：

- `zsh-autosuggestions`：根据历史命令给出灰色自动补全建议。
- `zsh-syntax-highlighting`：在输入命令时做语法高亮，例如错误命令会显示成不同颜色。

### 6.3 启用 oh-my-zsh 插件

修改内容：

```zsh
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

用途：

- `git`：oh-my-zsh 自带 Git alias 和提示支持。
- `zsh-autosuggestions`：启用命令历史建议。
- `zsh-syntax-highlighting`：启用命令输入高亮。

注意：

- `zsh-syntax-highlighting` 通常应该放在插件列表靠后位置，这样它能高亮前面插件处理后的命令行。

### 6.4 添加常用 alias

新增内容：

```zsh
alias vim='nvim'
alias ovim='/usr/bin/vim'
alias cat='bat -pp'
alias proxy="export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897 all_proxy=socks5://127.0.0.1:7897"
alias noproxy="unset https_proxy http_proxy all_proxy"
alias sshproxy="sed -i '' 's/# ProxyCommand ssh jump/ProxyCommand ssh jump/g' ~/.ssh/config"
alias sshnoproxy="sed -i '' 's/ProxyCommand ssh jump/# ProxyCommand ssh jump/g' ~/.ssh/config"
alias google='curl -v -I https://www.google.com/'
```

每个 alias 的作用：

| alias | 作用 |
| --- | --- |
| `vim='nvim'` | 输入 `vim` 时实际打开 Neovim。 |
| `ovim='/usr/bin/vim'` | 保留一个打开系统原版 Vim 的快捷方式。 |
| `cat='bat -pp'` | 用 `bat` 替代 `cat`，并用 `-pp` 去掉行号和分页，保留接近 `cat` 的行为。 |
| `proxy` | 一键设置 `http_proxy`、`https_proxy`、`all_proxy` 环境变量。 |
| `noproxy` | 一键取消代理环境变量。 |
| `sshproxy` | 把 `~/.ssh/config` 里注释掉的 `ProxyCommand ssh jump` 打开。 |
| `sshnoproxy` | 把 `~/.ssh/config` 里的 `ProxyCommand ssh jump` 再注释掉。 |
| `google` | 用 `curl` 请求 Google 首页响应头，用于测试代理是否生效。 |

说明：

- 代理端口使用 `7897`，因为你原来的 `~/.gitconfig` 已经在使用这个端口。

### 6.5 添加 GPG_TTY

新增内容：

```zsh
if [[ -t 0 ]]; then
  export GPG_TTY=$(tty)
fi
```

用途：

- 有些终端环境中，GPG 需要知道当前 TTY，才能正确弹出密码输入或完成签名。
- 加上 `[[ -t 0 ]]` 是为了只在真实终端中设置，避免非交互脚本里 `tty` 报错。

### 6.6 初始化 conda

执行过：

```zsh
~/miniconda3/bin/conda init zsh
```

写入内容：

```zsh
# >>> conda initialize >>>
__conda_setup="$('~/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
...
# <<< conda initialize <<<
```

用途：

- 让新开的 zsh 可以直接使用 `conda activate`。
- 不需要每次手动 source conda 的初始化脚本。

### 6.7 zsh 验证

验证命令：

```zsh
zsh -n ~/.zshrc
zsh -ic 'command -v gpg gh nvim bat tree-sitter conda; print -rl -- $plugins; alias vim; alias cat; alias proxy'
```

验证结果：

- `.zshrc` 语法检查通过。
- 新 zsh 中可以找到 `gpg`、`gh`、`nvim`、`bat`、`tree-sitter`、`conda`。
- 插件列表包含 `git`、`zsh-autosuggestions`、`zsh-syntax-highlighting`。
- alias 生效。

## 7. Powerlevel10k 重置

### 7.1 保留主题引用

`~/.zshrc` 中保留：

```zsh
ZSH_THEME="powerlevel10k/powerlevel10k"
```

用途：

- 继续使用 Powerlevel10k 作为 oh-my-zsh 主题。

### 7.2 删除个人 p10k 配置

删除文件：

```text
~/.p10k.zsh
```

用途：

- `~/.p10k.zsh` 是通过 `p10k configure` 生成的个人样式配置。
- 删除后，Powerlevel10k 会回到“还没有个人配置”的状态。
- 下次打开新终端时，可以重新进入配置向导。

### 7.3 删除 instant prompt 缓存

删除文件：

```text
~/.cache/p10k-instant-prompt-yifei.zsh
~/.cache/p10k-instant-prompt-yifei.zsh.zwc
```

用途：

- 避免终端启动瞬间继续显示旧样式缓存。
- 让 p10k reset 更彻底。

### 7.4 保留条件加载逻辑

`~/.zshrc` 中仍保留：

```zsh
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```

用途：

- 现在 `~/.p10k.zsh` 不存在，所以不会加载旧配置。
- 以后重新运行 `p10k configure` 生成新配置后，这一行会自动加载新配置。

## 8. GPG agent 配置

修改文件：

```text
~/.gnupg/gpg-agent.conf
```

写入内容：

```text
pinentry-program /opt/homebrew/bin/pinentry-mac
```

用途：

- 指定 GPG 使用 macOS 图形化 pinentry。
- 之后 Git commit 签名需要私钥密码时，会弹出 macOS 密码输入窗口。
- 配合钥匙串，可以减少反复输入密码的次数。

还执行过：

```zsh
chmod 700 ~/.gnupg
chmod 600 ~/.gnupg/gpg-agent.conf
killall gpg-agent
```

用途：

- `chmod 700 ~/.gnupg`：保护 GPG 目录权限。
- `chmod 600 gpg-agent.conf`：保护 GPG agent 配置文件权限。
- `killall gpg-agent`：重启 agent，让新配置生效。

## 9. Git 全局配置

修改文件：

```text
~/.gitconfig
```

### 9.1 保留原有 Git 用户信息

已有内容：

```ini
[user]
    name = yifei
    email = yfcccc@zju.edu.cn
```

用途：

- Git commit 的作者信息。
- GPG key 也使用同一个姓名和邮箱生成，方便 GitHub 识别签名归属。

### 9.2 设置 GPG 签名密钥

新增内容：

```ini
[user]
    signingkey = CDA01975D6F6AC609A756925D4E0227D08C8399D
```

用途：

- 告诉 Git 使用哪一个 GPG key 来签名 commit。
- 这里使用的是完整指纹，比短 key id 更明确。

### 9.3 设置 GPG 程序路径

新增内容：

```ini
[gpg]
    program = /opt/homebrew/bin/gpg
```

用途：

- 明确使用 Homebrew 安装的 GPG。
- 避免系统路径中找不到 `gpg` 或找到其他版本。

### 9.4 设置默认初始化分支

新增内容：

```ini
[init]
    defaultBranch = master
```

用途：

- 新执行 `git init` 时默认分支名为 `master`。
- 这是参考笔记里的设置。

### 9.5 开启默认 commit 签名

新增内容：

```ini
[commit]
    gpgsign = true
```

用途：

- 以后执行 `git commit` 时默认自动 GPG 签名。
- 不需要每次手动加 `-S`。

### 9.6 配置 GitHub HTTPS 凭据 helper

新增内容：

```ini
[credential "https://github.com"]
    helper =
    helper = !/opt/homebrew/bin/gh auth git-credential
[credential "https://gist.github.com"]
    helper =
    helper = !/opt/homebrew/bin/gh auth git-credential
```

用途：

- 让 Git 在访问 GitHub/Gist HTTPS 仓库时，通过 GitHub CLI 提供认证。
- 之后 clone、pull、push 私有仓库时可以复用 `gh auth login` 的登录状态。

说明：

- 空的 `helper =` 用于清空前面的 credential helper。
- 第二行再指定 `gh auth git-credential` 作为实际 helper。

## 10. GitHub CLI 授权

执行过：

```zsh
gh auth login --web --hostname github.com --git-protocol https --scopes admin:gpg_key
gh auth setup-git
```

授权结果：

- 已登录 GitHub CLI。
- 登录账号：`hadmard`
- Git 协议：HTTPS
- token 权限包含 `admin:gpg_key`，用于上传 GPG 公钥。

用途：

- `gh auth login`：登录 GitHub CLI。
- `--git-protocol https`：让 GitHub 仓库默认使用 HTTPS。
- `--scopes admin:gpg_key`：允许 CLI 上传 GPG 公钥。
- `gh auth setup-git`：把 Git 的 HTTPS 凭据接到 GitHub CLI。

安全说明：

- 实验报告不记录 token 内容。
- GitHub CLI token 保存在系统 keyring 中。

## 11. GPG 密钥生成和上传

### 11.1 生成 GPG 密钥

执行过：

```zsh
gpg --quick-generate-key "yifei <yfcccc@zju.edu.cn>" future-default default 2y
```

生成结果：

```text
pub   ed25519 2026-07-02 [SC] [expires: 2028-07-01]
      CDA01975D6F6AC609A756925D4E0227D08C8399D
uid                      yifei <yfcccc@zju.edu.cn>
sub   cv25519 2026-07-02 [E]
      10D47ABF9A8A84DDC303D19D5A8687A37F2525EF
```

字段含义：

| 字段 | 含义 |
| --- | --- |
| `ed25519` | 主密钥算法，用于签名和认证。 |
| `[SC]` | S 表示 Sign，可签名；C 表示 Certify，可认证其他 key/user id。 |
| `cv25519` | 子密钥算法，用于加密。 |
| `[E]` | Encrypt，用于加密。 |
| `expires: 2028-07-01` | 密钥有效期到 2028-07-01。 |

### 11.2 revocation certificate

GPG 自动生成了吊销证书：

```text
~/.gnupg/openpgp-revocs.d/CDA01975D6F6AC609A756925D4E0227D08C8399D.rev
```

用途：

- 如果私钥泄露或不可用，可以用吊销证书声明该 key 作废。
- 这个文件很重要，应妥善保管，不应公开。

### 11.3 导出公钥

执行过：

```zsh
gpg --armor --export CDA01975D6F6AC609A756925D4E0227D08C8399D > ~/Documents/Codex/2026-07-02/https-note-tonycrane-cc-devops-system/work/gpg/yifei-gpg-public-key.asc
```

用途：

- 生成 ASCII armored 格式的 GPG 公钥。
- 公钥可以上传到 GitHub，用于验证 commit 签名。

### 11.4 上传 GPG 公钥到 GitHub

执行过：

```zsh
gh gpg-key add ~/Documents/Codex/2026-07-02/https-note-tonycrane-cc-devops-system/work/gpg/yifei-gpg-public-key.asc --title "yifei MacBook Air 2026-07-02"
```

用途：

- 把本机生成的 GPG 公钥添加到 GitHub 账号。
- GitHub 之后可以把用对应私钥签名的 commit 显示为 Verified。

验证过：

```zsh
gh gpg-key list
```

结果显示 GitHub 上存在邮箱 `yfcccc@zju.edu.cn` 对应的 key，短 key id 为：

```text
D4E0227D08C8399D
```

## 12. Neovim 配置

### 12.1 安装 Neovim 配置目录

新增目录：

```text
~/.config/nvim
```

来源：

```zsh
git clone https://github.com/TonyCrane/nvim-config.git ~/.config/nvim
```

用途：

- 使用参考笔记中推荐的 Neovim 配置。

### 12.2 安装 packer.nvim

新增目录：

```text
~/.local/share/nvim/site/pack/packer/start/packer.nvim
```

用途：

- `packer.nvim` 是这份 Neovim 配置使用的插件管理器。
- 用来安装 `lualine`、`nvim-tree`、`onedark`、`gitsigns`、`nvim-treesitter` 等插件。

### 12.3 同步 Neovim 插件

执行过：

```zsh
nvim --headless -u NONE -c 'set packpath+=~/.local/share/nvim/site' -c 'lua package.path = package.path .. ";~/.config/nvim/lua/?.lua;~/.config/nvim/lua/?/init.lua"' -c 'luafile ~/.config/nvim/lua/plugins.lua' -c 'autocmd User PackerComplete quitall' -c 'PackerSync'
```

用途：

- 第一次同步插件时，完整加载 `init.vim` 会因为插件尚未安装而报错。
- 所以这里只加载 `plugins.lua` 来执行 `PackerSync`。
- 这样可以先把插件安装好，再正常启动 Neovim。

### 12.4 修复 nvim-treesitter 新版 API 兼容

修改文件：

```text
~/.config/nvim/lua/plugin-config/nvim-treesitter.lua
```

原配置使用旧 API：

```lua
require'nvim-treesitter.configs'.setup {
    ensure_installed = { "c", "lua", "python", "yaml" },
    highlight = {
        enable = true,
    }
}
```

问题：

- 当前安装的新版 `nvim-treesitter` 不再提供旧的 `nvim-treesitter.configs` 模块。
- 直接启动 Neovim 会报 `module 'nvim-treesitter.configs' not found`。

修改后内容：

```lua
vim.opt.foldmethod="expr"
vim.opt.foldexpr="v:lua.vim.treesitter.foldexpr()"
vim.opt.foldenable=false
vim.opt.foldlevel=99

local ok, treesitter = pcall(require, 'nvim-treesitter')
if ok then
    treesitter.setup {}
    vim.api.nvim_create_autocmd('FileType', {
        pattern = { 'c', 'lua', 'python', 'yaml' },
        callback = function()
            pcall(vim.treesitter.start)
        end,
    })
end
```

每处修改的作用：

| 修改 | 作用 |
| --- | --- |
| `foldexpr="v:lua.vim.treesitter.foldexpr()"` | 使用新版 Neovim treesitter fold 表达式。 |
| `pcall(require, 'nvim-treesitter')` | 防止插件未安装时 Neovim 启动直接失败。 |
| `treesitter.setup {}` | 使用新版 `nvim-treesitter` 的 setup API。 |
| `FileType` autocmd | 只在指定文件类型中启动 treesitter 高亮。 |
| `pcall(vim.treesitter.start)` | 即使某个语言 parser 缺失，也不阻塞启动。 |

### 12.5 安装 treesitter parser

执行过：

```zsh
nvim --headless -u NONE -c 'packadd nvim-treesitter' -c 'lua require("nvim-treesitter").install({"c", "lua", "python", "yaml"}):wait(300000)' -c 'quitall'
```

用途：

- 安装 C、Lua、Python、YAML 的 treesitter parser。
- 这些 parser 用于语法高亮和结构化代码分析。

额外安装 `tree-sitter-cli` 的原因：

- 第一次安装 parser 时报错：找不到 `tree-sitter` 命令。
- 因此安装 `tree-sitter-cli` 后重新执行 parser 安装。

### 12.6 Neovim 验证

验证命令：

```zsh
nvim --headless '+quitall'
nvim --headless -c 'checkhealth nvim-treesitter' -c 'quitall'
```

验证结果：

- Neovim 可以 headless 启动。
- `nvim-treesitter` health check 完成。

说明：

- 启动时出现过 `NvimTree system_open has been removed` 的提示。
- 这是 `nvim-tree` 插件配置和新版插件之间的 deprecation 提示，不影响本次基础配置目标。

## 13. Git commit 签名验证

创建了临时验证仓库：

```text
~/Documents/Codex/2026-07-02/https-note-tonycrane-cc-devops-system/work/verify-gpg-sign
```

执行过：

```zsh
git init
git commit --allow-empty -m "verify gpg signing"
git log -1 --show-signature --format=fuller
```

用途：

- 验证 `commit.gpgsign=true` 后，Git commit 是否能正常完成。
- 验证 GPG 私钥、pinentry、Git 配置是否协同工作。

验证结果：

```text
gpg: Good signature from "yifei <yfcccc@zju.edu.cn>" [ultimate]
```

结论：

- 本机 Git commit 默认签名已经可用。
- 对应 GPG key 已上传到 GitHub。

## 14. 最终关键配置摘要

### 14.1 `~/.zshrc`

关键配置：

```zsh
eval "$(/opt/homebrew/bin/brew shellenv)"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
alias vim='nvim'
alias cat='bat -pp'
alias proxy="export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897 all_proxy=socks5://127.0.0.1:7897"
export GPG_TTY=$(tty)
```

实际文件位置：

```text
~/.zshrc
```

### 14.2 `~/.gitconfig`

关键配置：

```ini
[user]
    name = yifei
    email = yfcccc@zju.edu.cn
    signingkey = CDA01975D6F6AC609A756925D4E0227D08C8399D
[gpg]
    program = /opt/homebrew/bin/gpg
[init]
    defaultBranch = master
[commit]
    gpgsign = true
[credential "https://github.com"]
    helper =
    helper = !/opt/homebrew/bin/gh auth git-credential
```

实际文件位置：

```text
~/.gitconfig
```

### 14.3 GPG key

```text
Fingerprint: CDA01975D6F6AC609A756925D4E0227D08C8399D
Short key id: D4E0227D08C8399D
UID: yifei <yfcccc@zju.edu.cn>
Expires: 2028-07-01
```

## 15. 后续常用命令

重新配置 Powerlevel10k：

```zsh
p10k configure
```

查看 GitHub CLI 登录状态：

```zsh
gh auth status
```

查看本机 GPG 私钥：

```zsh
gpg --list-secret-keys --keyid-format=long
```

查看 Git 全局配置：

```zsh
git config --global --list --show-origin
```

测试 commit 签名：

```zsh
git commit --allow-empty -m "test signed commit"
git log -1 --show-signature
```

导出 GPG 公钥：

```zsh
gpg --armor --export CDA01975D6F6AC609A756925D4E0227D08C8399D
```

## 16. 实验结论

本次实验完成了以下目标：

- zsh 能自动加载 Homebrew 环境。
- oh-my-zsh 已启用常用 Git、自动建议、语法高亮插件。
- 常用 alias 已写入 `~/.zshrc`。
- conda 已接入 zsh。
- Powerlevel10k 已重置到未配置状态，可以重新运行 `p10k configure`。
- GPG agent 已配置 `pinentry-mac`。
- Git 已开启默认 GPG commit 签名。
- GitHub CLI 已登录并接管 GitHub HTTPS 凭据。
- GPG 公钥已上传到 GitHub。
- Neovim 已安装配置和插件，并修复 treesitter 新版兼容问题。
- 本地空 commit 签名验证通过。
