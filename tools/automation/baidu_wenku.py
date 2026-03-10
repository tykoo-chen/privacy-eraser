#!/usr/bin/env python3
"""
百度文库自动举报脚本
"""

BAIDU_WENKU_STEPS = """
## 百度文库举报流程

### 方法1: 移动端 (最快)
1. 打开百度文库 APP
2. 搜索或打开文档
3. 点击右上角 "..."
4. 选择 "举报"
5. 选择 "侵犯隐私"
6. 提交

### 方法2: PC端
1. 打开文档页面
2. 滚动到页面底部
3. 找到 "版权说明" 区域
4. 点击 "举报"

### 自动化步骤 (AI 执行):
```
# 1. 打开文档
browser action=navigate targetUrl="{url}"

# 2. 滚动到底部
browser action=act request={{"kind":"evaluate","fn":"window.scrollTo(0, document.body.scrollHeight)"}}

# 3. 获取快照
browser action=snapshot

# 4. 找到并点击举报按钮 (通常在底部)
browser action=act request={{"kind":"click","ref":"举报"}}

# 5. 选择举报类型
browser action=act request={{"kind":"click","ref":"侵犯隐私"}}

# 6. 填写说明
browser action=act request={{"kind":"fill","ref":"举报说明","text":"该文档包含本人真实姓名、联系方式等个人信息，未经本人授权公开发布，请予删除。"}}

# 7. 提交
browser action=act request={{"kind":"click","ref":"提交"}}

# 8. 截图存证
browser action=screenshot
```

### 注意事项
- PC 端举报入口不明显，APP 更方便
- 选择 "侵犯隐私" 而不是 "其他"
- 保留截图作为证据
"""

def get_report_steps(url):
    return BAIDU_WENKU_STEPS.format(url=url)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        print(get_report_steps(sys.argv[1]))
    else:
        print(BAIDU_WENKU_STEPS)
