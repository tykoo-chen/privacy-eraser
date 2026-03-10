#!/usr/bin/env python3
"""
微博自动举报脚本
"""

WEIBO_REPORT_STEPS = """
## 微博举报流程

### 单条微博
1. 点击微博右上角 "..."
2. 选择 "举报"
3. 选择 "泄露个人隐私"
4. 提交

### 自动化步骤 (AI 执行):
```
# 1. 打开微博详情页
browser action=navigate targetUrl="{url}"

# 2. 获取快照
browser action=snapshot

# 3. 点击更多菜单
browser action=act request={{"kind":"click","ref":"更多"}}
# 或者
browser action=act request={{"kind":"click","ref":"..."}}

# 4. 点击举报
browser action=act request={{"kind":"click","ref":"举报"}}

# 5. 选择举报类型
browser action=act request={{"kind":"click","ref":"泄露个人隐私"}}

# 6. 提交
browser action=act request={{"kind":"click","ref":"提交"}}

# 7. 截图
browser action=screenshot
```

### 加速处理
举报后立即私信 @微博客服:
"您好，我刚举报了一条泄露我个人隐私的微博（链接：{url}），请尽快处理，谢谢！"
"""

def get_report_steps(url):
    return WEIBO_REPORT_STEPS.format(url=url)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        print(get_report_steps(sys.argv[1]))
    else:
        print(WEIBO_REPORT_STEPS)
