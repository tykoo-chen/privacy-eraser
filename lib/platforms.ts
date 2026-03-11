import type { PlatformInfo } from "./types";

const PLATFORM_CHECKS: [string, string][] = [
  ["wenku.baidu.com", "baidu_wenku"],
  ["tieba.baidu.com", "baidu_tieba"],
  ["zhidao.baidu.com", "baidu_zhidao"],
  ["baike.baidu.com", "baidu_baike"],
  ["mp.weixin.qq.com", "wechat"],
  ["weixin110.qq.com", "wechat"],
  ["xiaohongshu.com", "xiaohongshu"],
  ["xhslink.com", "xiaohongshu"],
  ["zhihu.com", "zhihu"],
  ["weibo.com", "weibo"],
  ["weibo.cn", "weibo"],
  ["douyin.com", "douyin"],
  ["baidu.com", "baidu"],
  ["google.com", "google"],
  ["bing.com", "bing"],
];

const PLATFORM_INFO: Record<string, PlatformInfo> = {
  baidu_wenku: {
    name: "百度文库",
    method: 'APP举报最快: 右上角"..." → 举报 → 侵犯隐私',
    time: "48小时",
    tip: '选"侵犯隐私"比"其他"快',
  },
  baidu_tieba: {
    name: "百度贴吧",
    method: '帖子右下角"举报" → 泄露隐私',
    time: "24-72小时",
    tip: "同时@贴吧管理组",
  },
  baidu_zhidao: {
    name: "百度知道",
    method: '回答下方"举报" → 侵犯隐私',
    time: "48小时",
    tip: "知道的举报响应较快",
  },
  baidu_baike: {
    name: "百度百科",
    method: '词条页"编辑" → 申请修改，或联系百科客服',
    time: "3-7天",
    tip: "百科很难删，建议改为模糊信息",
  },
  baidu: {
    name: "百度搜索",
    method: "help.baidu.com/webmaster/add → 个人信息保护",
    time: "3-7天",
    tip: "删快照前提：原页面必须已删除",
  },
  zhihu: {
    name: "知乎",
    method: "zhihu.com/terms/complaint → 个人信息保护",
    time: "3-5天",
    tip: "附身份证明处理更快",
  },
  weibo: {
    name: "微博",
    method: "举报 + 私信@微博客服（双管齐下）",
    time: "2-7天",
    tip: "只举报不私信会很慢",
  },
  wechat: {
    name: "微信公众号",
    method: '文章底部"投诉" → 侵犯隐私，或 weixin110.qq.com',
    time: "3-7天",
    tip: "有律师函会更快",
  },
  xiaohongshu: {
    name: "小红书",
    method: '笔记右上角"..." → 举报 → 涉及隐私',
    time: "24-72小时",
    tip: '"人身攻击"比"隐私泄露"更快',
  },
  douyin: {
    name: "抖音",
    method: '视频右下角"..." → 举报 → 侵犯隐私',
    time: "1-7天",
    tip: "私信博主协商删除是最快路径",
  },
  google: {
    name: "Google",
    method: "google.com/webmasters/tools/legal-removal-request",
    time: "1-2周",
    tip: "需要翻墙",
  },
  bing: {
    name: "Bing",
    method: "bing.com/webmasters/contentremoval",
    time: "1-2周",
    tip: "需提交具体 URL",
  },
};

export function detectPlatform(url: string): string {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    for (const [pattern, platform] of PLATFORM_CHECKS) {
      if (domain.includes(pattern)) {
        return platform;
      }
    }
  } catch {
    // invalid URL
  }
  return "unknown";
}

export function getPlatformInfo(platform: string): PlatformInfo {
  return (
    PLATFORM_INFO[platform] ?? {
      name: "未知平台",
      method: "联系平台客服或使用通用隐私投诉模板",
      time: "不确定",
      tip: "准备好身份证明材料",
    }
  );
}

export function getAllPlatforms(): Record<string, PlatformInfo> {
  return { ...PLATFORM_INFO };
}
