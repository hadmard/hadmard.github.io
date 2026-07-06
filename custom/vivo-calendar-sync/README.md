# vivo 日程同步说明

这个目录记录本站如何读取 Mac 本地的 vivo 办公套件 / PC 套件日历同步数据。

当前只做本地只读访问，不会修改 vivo 的数据库，也不会把本地数据库文件提交到仓库。

## 数据库位置

本机同步库路径：

```text
/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db
```

这个文件是 SQLite 数据库。可以用系统自带的 `sqlite3` 读取：

```bash
sqlite3 "/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db" ".tables"
```

已确认存在的关键表：

```text
Calendar
Events
Instances
Reminders
ExtendedProperties
```

## 访问方式

建议脚本读取时先复制一份临时快照，避免 vivo 套件正在同步时数据库锁定：

```bash
mkdir -p custom/vivo-calendar-sync/tmp
cp "/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db" \
  custom/vivo-calendar-sync/tmp/CalendarSync.snapshot.db
```

之后读取快照：

```bash
sqlite3 custom/vivo-calendar-sync/tmp/CalendarSync.snapshot.db ".schema Events"
```

`tmp/` 目录后续应加入忽略规则，不提交。

## 表结构理解

### Calendar

日历源信息。颜色和来源通常从这里判断。

常用字段：

```text
_id          日历源 id
displayName 日历显示名
color        日历颜色
visible      是否显示
```

当前校对到的来源示例：

```text
1  Local calendar
2  vivo work
```

截图里的棕色点大多来自 `Local calendar`，红色点大多来自 `vivo work`。

### Events

日程主体信息。每条日程的标题、开始结束时间、地点、备注等在这里。

常用字段：

```text
_id          事件 id
calendar_id 归属日历源
title        标题
dtStart      开始时间，毫秒时间戳
dtEnd        结束时间，毫秒时间戳
allDay       是否全天 / 跨天
location     地点
description 备注
deleted      是否删除
```

### Instances

日程实例。普通日程通常和 `Events` 一一对应；如果以后有重复日程，应优先按 `Instances` 展开。

常用字段：

```text
event_id     对应 Events._id
begin        实例开始时间，毫秒时间戳
end          实例结束时间，毫秒时间戳
startDay     日序号
startMinute  当天分钟数
```

## 查询示例

查询 2026 年 7 月日程：

```bash
sqlite3 -header -column "/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db" "
SELECT
  e._id,
  e.title,
  c.displayName AS calendar,
  datetime(i.begin / 1000, 'unixepoch', 'localtime') AS begin_time,
  datetime(i.end / 1000, 'unixepoch', 'localtime') AS end_time,
  e.allDay,
  e.location
FROM Instances i
JOIN Events e ON e._id = i.event_id
LEFT JOIN Calendar c ON c._id = e.calendar_id
WHERE i.begin BETWEEN strftime('%s', '2026-07-01 00:00:00') * 1000
                  AND strftime('%s', '2026-08-01 00:00:00') * 1000
  AND (e.deleted IS NULL OR e.deleted = 0)
ORDER BY i.begin, e._id;
"
```

查询结果里的时间已经按本机时区转成本地时间。

## 和截图校对的结论

2026 年 7 月 5 日到 7 月 25 日截图中的日程，已和本地数据库校对一致。

数据库能补全截图里的省略标题：

```text
集群软硬件以...        -> 集群软硬件以及运维
HPC中的计算...         -> HPC中的计算机系统一 / HPC中的计算机系统二
向量化并行计...        -> 向量化并行计算基础
OpenMP/MPI ...         -> OpenMP/MPI 并行计算基础
性能分析技术...        -> 性能分析技术基础 Profiling
机器学习高级...        -> 机器学习高级话题
```

截图中的 `小暑`、`大暑` 没在 `Events` 或 `Instances` 中查到。它们更像 vivo 日历 UI 自动叠加的节气 / 农历显示层，不是同步到本地库的普通事件。

## 当前网站接入方式

GitHub Pages 是静态站点，线上页面不能直接读取这台 Mac 的本地 SQLite。

当前流程：

1. 本地脚本读取 `CalendarSync.db`。
2. 复制临时快照到 `custom/vivo-calendar-sync/tmp/CalendarSync.snapshot.db`。
3. 导出安全的 JSON：

   ```text
   custom/vivo-calendar-sync/output/schedule-records.json
   ```

4. `src/data/database.ts` 注册这个数据源。
5. `/schedule/` 和 `/en/schedule/` 页面读取 JSON。
6. 运行 `pnpm run build`，把生成后的 `docs/` 一起提交并推送。

这样网站展示的是已经导出的静态数据，本地 vivo 数据库不会暴露到线上。

## 刷新命令

默认读取本机 vivo 同步库，并导出 2026-07-05 到 2026-07-26 的日程：

```bash
pnpm run sync:schedule
```

也可以手动指定数据库、范围和输出路径：

```bash
node custom/vivo-calendar-sync/sync-vivo-calendar.mjs \
  --db "/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db" \
  --start 2026-07-05 \
  --end 2026-07-26 \
  --out custom/vivo-calendar-sync/output/schedule-records.json
```

## 课程时间规则

按你确认的规则，课程统一展示为：

```text
上午课程：08:30-11:30
下午课程：14:00-17:00
课时：3 小时
```

如果数据库里某些课程是 1 小时占位，例如 `08:30-09:30` 或 `14:00-15:00`，导出 JSON 会把展示时间修正为 3 小时，同时在每条记录的 `source` 字段里保留原始开始 / 结束时间。

## 隐私注意

日程里可能包含地点、联系人、饭局、家教安排、旅行计划等私人信息。

接入网站前建议先决定：

```text
是否展示地点
是否展示备注
是否脱敏联系人
是否只展示未来 / 当前月份
是否隐藏私人日程源 Local calendar
```

默认实现应只读数据库，并且只导出明确允许公开的字段。
