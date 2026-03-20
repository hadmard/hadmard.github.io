# CC98 投资记录爬虫

## 1. 文件用途

这个目录用于抓取 CC98 主题楼层，并把楼层内容落为本地投资记录。

当前实现是独立脚本，不接入现有 Astro 站点，也不改仓库原有业务代码。

## 2. 当前约束

我已经确认目标主题的数据来自 `https://api.cc98.org`，不是静态 HTML。

这意味着当前主题所在版面需要 CC98 登录授权。  
当前脚本已经支持两种授权方式：

- 直接传入 token
- 直接传入用户名和密码，由脚本自动换取 access token

也就是说，现在不需要你手动先提 token 了。

## 3. 脚本能力

脚本文件：

- `crawl-cc98-topic.mjs`

输出内容：

- `output/topic-<id>/raw/topic.json`
- `output/topic-<id>/raw/posts.json`
- `output/topic-<id>/records/investment-summary.json`
- `output/topic-<id>/records/investment-record.md`
- `output/topic-<id>/records/investment-record.csv`

其中：

- `raw/` 保存原始响应，方便复核
- `records/` 保存整理后的投资记录

## 4. 使用方式

### 4.1 通过环境变量传 token

```powershell
$env:CC98_AUTH_TOKEN = "Bearer 你的token"
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic https://www.cc98.org/topic/6450962
```

### 4.2 通过命令行参数传 token

```powershell
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs `
  --topic https://www.cc98.org/topic/6450962 `
  --token "Bearer 你的token"
```

### 4.3 直接用用户名和密码登录

```powershell
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs `
  --topic 6450962 `
  --username "你的用户名" `
  --password "你的密码"
```

也支持环境变量：

```powershell
$env:CC98_USERNAME = "你的用户名"
$env:CC98_PASSWORD = "你的密码"
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic 6450962
```

说明：

- 脚本会按当前 CC98 网页端的 OpenID 密码登录流程换取 access token
- 不会把用户名和密码写进输出文件

### 4.4 自定义输出目录

```powershell
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs `
  --topic 6450962 `
  --token "Bearer 你的token" `
  --out-dir custom/cc98-investment-crawler/output/my-investment-record
```

## 5. 输出整理规则

当前整理方式偏保守，目的是先保真：

- 保留原始 JSON
- 对正文做轻量清洗，去掉大部分 UBB/HTML 包装
- 按楼层顺序输出 Markdown
- 同步导出 CSV，方便后续你再筛选、标注、二次加工

这轮没有做“自动识别买卖观点、收益率、标的名称”的激进抽取，原因是：

- 目标主题内容目前尚未实际拉到，不能盲目假设格式
- 先保留完整原文，后续再做结构化提炼风险更低

## 6. 后续建议

如果你愿意继续，我下一步可以直接帮你做两件事之一：

1. 你给我一个可用的 CC98 token，我直接把这个主题真正抓下来并生成本地投资记录。
2. 你要是希望记录更像“交易日志”，我可以在现有脚本上继续加关键词提取、观点摘要和时间线整理。
