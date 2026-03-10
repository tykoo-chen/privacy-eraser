#!/usr/bin/env python3
"""
知乎自动举报脚本

使用方法 (由 AI 调用):
1. browser action=navigate targetUrl="<知乎URL>"
2. browser action=snapshot
3. 根据页面类型执行对应操作
"""

ZHIHU_REPORT_STEPS = """
## 知乎举报流程

### 回答页面
1. 找到回答底部的 "举报" 按钮
2. 点击后选择 "侵犯个人隐私"
3. 填写说明
4. 提交

### 自动化步骤 (AI 执行):
```
# 1. 打开页面
browser action=navigate targetUrl="{url}"

# 2. 获取页面快照
browser action=snapshot

# 3. 点击举报按钮 (通常在回答底部)
browser action=act request={{"kind":"click","ref":"举报"}}

# 4. 选择举报原因
browser action=act request={{"kind":"click","ref":"侵犯个人隐私"}}

# 5. 填写说明
browser action=act request={{"kind":"fill","ref":"举报说明","text":"该内容包含本人真实姓名/联系方式等个人信息，未经本人授权公开，请予删除。"}}

# 6. 提交
browser action=act request={{"kind":"click","ref":"提交"}}

# 7. 截图存证
browser action=screenshot
```

### 更快方式
直接使用知乎官方隐私投诉通道:
https://www.zhihu.com/terms/complaint

选择 "个人信息保护" 类型，填写被投诉内容 URL
"""

def get_report_steps(url):
    return ZHIHU_REPORT_STEPS.format(url=url)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        print(get_report_steps(sys.argv[1]))
    else:
        print(ZHIHU_REPORT_STEPS)
