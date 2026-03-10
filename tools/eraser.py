#!/usr/bin/env python3
"""
Privacy Eraser CLI - 数字身份守护工具
"""

import os
import sys
import json
import argparse
import hashlib
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

# 配置路径
SCRIPT_DIR = Path(__file__).parent
CASES_DIR = SCRIPT_DIR.parent / "cases"
CASES_FILE = CASES_DIR / "cases.json"

# 确保目录存在
CASES_DIR.mkdir(exist_ok=True)

def load_cases():
    """加载所有案例"""
    if CASES_FILE.exists():
        with open(CASES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"cases": [], "last_scan": None}

def save_cases(data):
    """保存案例"""
    with open(CASES_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_case_id(url):
    """生成案例 ID"""
    return hashlib.md5(url.encode()).hexdigest()[:8]

def detect_platform(url):
    """检测 URL 属于哪个平台"""
    domain = urlparse(url).netloc.lower()
    
    # 按特定性排序，更具体的域名先匹配
    platform_checks = [
        ('wenku.baidu.com', 'baidu_wenku'),
        ('tieba.baidu.com', 'baidu_tieba'),
        ('zhidao.baidu.com', 'baidu_zhidao'),
        ('baike.baidu.com', 'baidu_baike'),
        ('mp.weixin.qq.com', 'wechat'),
        ('weixin110.qq.com', 'wechat'),
        ('xiaohongshu.com', 'xiaohongshu'),
        ('xhslink.com', 'xiaohongshu'),
        ('zhihu.com', 'zhihu'),
        ('weibo.com', 'weibo'),
        ('weibo.cn', 'weibo'),
        ('douyin.com', 'douyin'),
        ('baidu.com', 'baidu'),
        ('google.com', 'google'),
        ('bing.com', 'bing'),
    ]
    
    for pattern, platform in platform_checks:
        if pattern in domain:
            return platform
    return 'unknown'

def get_platform_info(platform):
    """获取平台处理信息"""
    info = {
        'baidu_wenku': {
            'name': '百度文库',
            'method': 'APP举报最快: 右上角"..." → 举报 → 侵犯隐私',
            'time': '48小时',
            'tip': '选"侵犯隐私"比"其他"快',
        },
        'baidu_tieba': {
            'name': '百度贴吧',
            'method': '帖子右下角"举报" → 泄露隐私',
            'time': '24-72小时',
            'tip': '同时@贴吧管理组',
        },
        'baidu_zhidao': {
            'name': '百度知道',
            'method': '回答下方"举报" → 侵犯隐私',
            'time': '48小时',
            'tip': '知道的举报响应较快',
        },
        'baidu_baike': {
            'name': '百度百科',
            'method': '词条页"编辑" → 申请修改，或联系百科客服',
            'time': '3-7天',
            'tip': '百科很难删，建议改为模糊信息',
        },
        'baidu': {
            'name': '百度搜索',
            'method': 'help.baidu.com/webmaster/add → 个人信息保护',
            'time': '3-7天',
            'tip': '删快照前提：原页面必须已删除',
        },
        'zhihu': {
            'name': '知乎',
            'method': 'zhihu.com/terms/complaint → 个人信息保护',
            'time': '3-5天',
            'tip': '附身份证明处理更快',
        },
        'weibo': {
            'name': '微博',
            'method': '举报 + 私信@微博客服（双管齐下）',
            'time': '2-7天',
            'tip': '只举报不私信会很慢',
        },
        'wechat': {
            'name': '微信公众号',
            'method': '文章底部"投诉" → 侵犯隐私，或 weixin110.qq.com',
            'time': '3-7天',
            'tip': '有律师函会更快',
        },
        'xiaohongshu': {
            'name': '小红书',
            'method': '笔记右上角"..." → 举报 → 涉及隐私',
            'time': '24-72小时',
            'tip': '"人身攻击"比"隐私泄露"更快',
        },
        'douyin': {
            'name': '抖音',
            'method': '视频右下角"..." → 举报 → 侵犯隐私',
            'time': '1-7天',
            'tip': '私信博主协商删除是最快路径',
        },
        'google': {
            'name': 'Google',
            'method': 'google.com/webmasters/tools/legal-removal-request',
            'time': '1-2周',
            'tip': '需要翻墙',
        },
    }
    return info.get(platform, {
        'name': '未知平台',
        'method': '联系平台客服或使用通用隐私投诉模板',
        'time': '不确定',
        'tip': '准备好身份证明材料',
    })

def cmd_add(args):
    """添加新案例"""
    url = args.url
    case_id = generate_case_id(url)
    platform = detect_platform(url)
    platform_info = get_platform_info(platform)
    
    data = load_cases()
    
    # 检查是否已存在
    for case in data['cases']:
        if case['id'] == case_id:
            print(f"⚠️  案例已存在: {case_id}")
            print(f"   状态: {case['status']}")
            return
    
    case = {
        'id': case_id,
        'url': url,
        'platform': platform,
        'platform_name': platform_info['name'],
        'description': args.desc or '',
        'status': 'pending',  # pending, reported, following, resolved, failed
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat(),
        'notes': [],
    }
    
    data['cases'].append(case)
    save_cases(data)
    
    print(f"✅ 案例已添加: {case_id}")
    print(f"   平台: {platform_info['name']}")
    print(f"   URL: {url}")
    print()
    print(f"📋 处理方法:")
    print(f"   {platform_info['method']}")
    print(f"   预计时间: {platform_info['time']}")
    print(f"   💡 {platform_info['tip']}")

def cmd_list(args):
    """列出所有案例"""
    data = load_cases()
    
    if not data['cases']:
        print("📭 没有案例")
        return
    
    status_emoji = {
        'pending': '⏳',
        'reported': '📤',
        'following': '👀',
        'resolved': '✅',
        'failed': '❌',
    }
    
    print(f"📋 共 {len(data['cases'])} 个案例\n")
    
    for case in data['cases']:
        emoji = status_emoji.get(case['status'], '❓')
        print(f"{emoji} [{case['id']}] {case['platform_name']}")
        print(f"   {case['url'][:60]}...")
        print(f"   状态: {case['status']} | 创建: {case['created_at'][:10]}")
        print()

def cmd_update(args):
    """更新案例状态"""
    data = load_cases()
    
    for case in data['cases']:
        if case['id'] == args.id:
            old_status = case['status']
            case['status'] = args.status
            case['updated_at'] = datetime.now().isoformat()
            
            if args.note:
                case['notes'].append({
                    'time': datetime.now().isoformat(),
                    'text': args.note
                })
            
            save_cases(data)
            print(f"✅ 案例 {args.id} 状态更新: {old_status} → {args.status}")
            return
    
    print(f"❌ 案例不存在: {args.id}")

def cmd_info(args):
    """显示案例详情"""
    data = load_cases()
    
    for case in data['cases']:
        if case['id'] == args.id:
            platform_info = get_platform_info(case['platform'])
            
            print(f"📋 案例详情: {case['id']}")
            print(f"{'='*50}")
            print(f"URL: {case['url']}")
            print(f"平台: {platform_info['name']}")
            print(f"状态: {case['status']}")
            print(f"创建时间: {case['created_at']}")
            print(f"更新时间: {case['updated_at']}")
            print(f"描述: {case.get('description', '-')}")
            print()
            print(f"📝 处理方法:")
            print(f"   {platform_info['method']}")
            print(f"   预计时间: {platform_info['time']}")
            print(f"   💡 {platform_info['tip']}")
            
            if case.get('notes'):
                print()
                print("📝 备注:")
                for note in case['notes']:
                    print(f"   [{note['time'][:10]}] {note['text']}")
            return
    
    print(f"❌ 案例不存在: {args.id}")

def cmd_scan(args):
    """扫描关键词（需要配合外部搜索）"""
    print("🔍 扫描功能需要配合 web_search 工具使用")
    print()
    print("使用方法:")
    print("  1. AI 调用 web_search 搜索用户姓名")
    print("  2. 分析结果，识别包含个人信息的页面")
    print("  3. 调用 eraser.py add <url> 添加案例")

def main():
    parser = argparse.ArgumentParser(description='Privacy Eraser - 数字身份守护')
    subparsers = parser.add_subparsers(dest='command')
    
    # add 命令
    add_parser = subparsers.add_parser('add', help='添加新案例')
    add_parser.add_argument('url', help='目标 URL')
    add_parser.add_argument('--desc', '-d', help='描述')
    
    # list 命令
    list_parser = subparsers.add_parser('list', help='列出所有案例')
    list_parser.add_argument('--status', '-s', help='按状态筛选')
    
    # update 命令
    update_parser = subparsers.add_parser('update', help='更新案例状态')
    update_parser.add_argument('id', help='案例 ID')
    update_parser.add_argument('status', choices=['pending', 'reported', 'following', 'resolved', 'failed'])
    update_parser.add_argument('--note', '-n', help='添加备注')
    
    # info 命令
    info_parser = subparsers.add_parser('info', help='显示案例详情')
    info_parser.add_argument('id', help='案例 ID')
    
    # scan 命令
    scan_parser = subparsers.add_parser('scan', help='扫描说明')
    
    args = parser.parse_args()
    
    if args.command == 'add':
        cmd_add(args)
    elif args.command == 'list':
        cmd_list(args)
    elif args.command == 'update':
        cmd_update(args)
    elif args.command == 'info':
        cmd_info(args)
    elif args.command == 'scan':
        cmd_scan(args)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
