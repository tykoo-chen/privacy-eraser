---
name: privacy-eraser
description: 数字身份守护。帮用户扫描网络上的个人信息，自动处理删除请求，跟踪案例状态。Triggers: "删我信息", "隐私保护", "网上有我的信息", "清理数字足迹", "privacy", "remove my data"
version: 0.3.0
---

# Privacy Eraser 数字身份守护

**真正能用的隐私保护工具**

```
扫描 → 识别 → 添加案例 → 自动/手动处理 → 跟踪状态 → 定期监控
```

---

## 快速开始

### 1. 用户说"帮我查查网上有没有我的信息"

```bash
# AI 执行步骤:

# 1. 从 USER.md 获取用户姓名
# 假设用户名字是 "张三"

# 2. 搜索 (使用 web_search 工具)
web_search query='"张三"'
web_search query='"张三" 手机 OR 联系方式'
web_search query='"张三" site:wenku.baidu.com'

# 3. 分析结果，找到包含敏感信息的页面

# 4. 对每个发现的页面，添加案例
python3 tools/eraser.py add "https://..." --desc "包含手机号"

# 5. 汇报给用户，询问是否处理
```

### 2. 用户说"帮我删这个 [URL]"

```bash
# AI 执行步骤:

# 1. 添加案例
python3 tools/eraser.py add "https://example.com/page" --desc "用户要求删除"

# 输出会告诉你:
# - 这是哪个平台
# - 最快的处理方法
# - 预计处理时间
# - 平台潜规则/技巧

# 2. 如果有 Mac 节点，可以自动举报
nodes action=status
# 有节点 → 使用浏览器自动化
# 无节点 → 指导用户手动操作

# 3. 更新案例状态
python3 tools/eraser.py update <case_id> reported --note "已在APP内举报"
```

### 3. 用户说"帮我监控隐私"

```bash
# 设置 cron 每周扫描
cron action=add job={
  "name": "privacy-monitor",
  "schedule": {"kind": "cron", "expr": "0 9 * * 1", "tz": "Asia/Shanghai"},
  "payload": {"kind": "systemEvent", "text": "隐私监控: 执行每周扫描，搜索用户姓名，检查是否有新的个人信息泄露"},
  "sessionTarget": "main"
}
```

---

## CLI 工具使用

### eraser.py - 案例管理

```bash
# 添加案例
python3 tools/eraser.py add <url> [--desc "描述"]

# 列出所有案例
python3 tools/eraser.py list

# 更新案例状态
python3 tools/eraser.py update <id> <status> [--note "备注"]
# status: pending | reported | following | resolved | failed

# 查看案例详情
python3 tools/eraser.py info <id>
```

### 案例状态流转

```
pending → reported → following → resolved
                  ↘           ↗
                    → failed
```

---

## 平台处理指南

### 百度文库 (baidu_wenku)
```
✅ 最快: APP → 右上角"..." → 举报 → 侵犯隐私
⏱️ 时间: 48小时
💡 选"侵犯隐私"比"其他"快
```

### 知乎 (zhihu)
```
✅ 最快: zhihu.com/terms/complaint → 个人信息保护
⏱️ 时间: 3-5天
💡 附身份证明更快
```

### 微博 (weibo)
```
✅ 最快: 举报 + 私信@微博客服（双管齐下）
⏱️ 时间: 2-7天
💡 只举报不私信会很慢
```

### 微信公众号 (wechat)
```
✅ 最快: 文章底部"投诉" → 侵犯隐私
✅ 备用: weixin110.qq.com
⏱️ 时间: 3-7天
💡 有律师函会更快
```

### 小红书 (xiaohongshu)
```
✅ 最快: 笔记右上角"..." → 举报 → 涉及隐私
⏱️ 时间: 24-72小时
💡 "人身攻击"比"隐私泄露"更快
```

### 抖音 (douyin)
```
✅ 最快: 私信博主协商删除
✅ 备用: 视频右下角"..." → 举报 → 侵犯隐私
⏱️ 时间: 1-7天
💡 "未经同意拍摄"成功率较高
```

### Google
```
✅ 入口: google.com/webmasters/tools/legal-removal-request
⏱️ 时间: 1-2周
💡 需要翻墙
```

---

## 浏览器自动化 (需要 Mac 节点)

### 检查节点
```
nodes action=status
```

### 使用节点浏览器自动举报
```bash
# 1. 打开目标页面
browser action=navigate target=node profile=chrome targetUrl="<url>"

# 2. 获取页面快照
browser action=snapshot target=node

# 3. 点击举报 (根据平台调整)
browser action=act target=node request={"kind":"click","ref":"举报"}

# 4. 选择类型
browser action=act target=node request={"kind":"click","ref":"侵犯隐私"}

# 5. 提交
browser action=act target=node request={"kind":"click","ref":"提交"}

# 6. 截图存证
browser action=screenshot target=node
```

### 自动化脚本参考
- `tools/automation/zhihu.py` - 知乎举报
- `tools/automation/weibo.py` - 微博举报
- `tools/automation/baidu_wenku.py` - 百度文库举报

---

## 模板文件

| 文件 | 用途 |
|------|------|
| `templates/baidu_removal.md` | 百度系 |
| `templates/zhihu_report.md` | 知乎 |
| `templates/weibo_report.md` | 微博 |
| `templates/weixin_report.md` | 微信公众号 |
| `templates/xiaohongshu_report.md` | 小红书 |
| `templates/douyin_report.md` | 抖音 |
| `templates/google_removal.md` | Google |
| `templates/gdpr_request.md` | GDPR (欧洲) |
| `templates/legal_warning_cn.md` | 律师函模板 |

---

## 优先级判断

| 内容类型 | 紧急度 | 处理方式 |
|---------|--------|---------|
| 手机号/身份证 | 🔴 立即 | 直接举报 |
| 住址/工作单位 | 🟡 24h内 | 举报 |
| 真名+学校 | 🟡 48h内 | 举报或协商 |
| 仅姓名提及 | 🟢 可选 | 看情况 |

---

## 目录结构

```
privacy-eraser/
├── SKILL.md              # 本文档
├── config.example.json   # 配置示例
├── tools/
│   ├── eraser.py         # 案例管理 CLI
│   ├── scanner.py        # 扫描辅助
│   └── automation/       # 浏览器自动化脚本
├── cases/
│   ├── cases.json        # 案例数据库
│   └── screenshots/      # 截图存档
├── templates/            # 投诉模板
└── references/           # 参考资料
```

---

## 参考资料

- `references/platforms.md` - 各平台举报入口汇总
- `references/legal_basis.md` - 法律依据（个保法、网安法等）
