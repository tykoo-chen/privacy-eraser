#!/usr/bin/env python3
"""
Privacy Scanner - 隐私信息扫描器

用于搜索网上的个人信息泄露
配合 OpenClaw 的 web_search 工具使用
"""

import json
import sys
from datetime import datetime

def generate_search_queries(name, extras=None):
    """生成搜索查询"""
    queries = [
        f'"{name}"',  # 精确匹配姓名
        f'"{name}" 手机',
        f'"{name}" 联系方式',
        f'"{name}" 简历',
        f'"{name}" site:wenku.baidu.com',
        f'"{name}" site:zhihu.com',
        f'"{name}" site:weibo.com',
    ]
    
    if extras:
        for extra in extras:
            queries.append(f'"{name}" "{extra}"')
    
    return queries

def analyze_result(result, name):
    """分析搜索结果是否包含敏感信息"""
    title = result.get('title', '').lower()
    snippet = result.get('snippet', '').lower()
    url = result.get('url', '')
    
    # 敏感关键词
    sensitive_keywords = [
        '手机', '电话', '联系方式', '微信', 'qq',
        '地址', '住址', '公司', '单位',
        '身份证', '简历', '个人信息',
        '泄露', '曝光',
    ]
    
    name_lower = name.lower()
    content = title + ' ' + snippet
    
    # 检查是否包含姓名
    if name_lower not in content:
        return None
    
    # 检查敏感词
    found_keywords = []
    for kw in sensitive_keywords:
        if kw in content:
            found_keywords.append(kw)
    
    if found_keywords:
        return {
            'url': url,
            'title': result.get('title'),
            'snippet': result.get('snippet'),
            'sensitive_keywords': found_keywords,
            'risk_level': 'high' if len(found_keywords) >= 2 else 'medium',
        }
    
    return None

def format_scan_report(results, name):
    """格式化扫描报告"""
    if not results:
        return f"✅ 未发现包含 {name} 敏感信息的页面"
    
    report = f"⚠️ 发现 {len(results)} 个可能包含敏感信息的页面:\n\n"
    
    for i, r in enumerate(results, 1):
        risk_emoji = '🔴' if r['risk_level'] == 'high' else '🟡'
        report += f"{risk_emoji} {i}. {r['title']}\n"
        report += f"   URL: {r['url']}\n"
        report += f"   敏感词: {', '.join(r['sensitive_keywords'])}\n"
        report += f"   摘要: {r['snippet'][:100]}...\n\n"
    
    report += "\n建议: 使用 eraser.py add <url> 添加案例并处理"
    return report

# AI 调用示例
AI_USAGE = """
## 扫描使用方法 (AI 执行)

### 1. 获取用户信息
```
从 USER.md 读取用户姓名和其他可识别信息
```

### 2. 执行搜索
```
# 百度搜索 (国内推荐)
web_search query='"用户姓名"' 

# 添加敏感词搜索
web_search query='"用户姓名" 手机'
web_search query='"用户姓名" site:wenku.baidu.com'
```

### 3. 分析结果
```python
# 分析每个结果
for result in search_results:
    analysis = analyze_result(result, "用户姓名")
    if analysis:
        print(analysis)
```

### 4. 添加案例
```bash
python3 tools/eraser.py add "<发现的URL>" --desc "扫描发现"
```

### 5. 处理案例
按照平台指引处理，或使用浏览器自动化
"""

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--help':
        print(AI_USAGE)
    else:
        print("Privacy Scanner")
        print("使用 --help 查看 AI 调用方法")
