import { detectPlatform, getPlatformInfo } from "./platforms";
import type { ScanResult } from "./types";

const SENSITIVE_KEYWORDS = [
  "手机", "电话", "联系方式", "微信", "qq",
  "地址", "住址", "公司", "单位",
  "身份证", "简历", "个人信息",
  "泄露", "曝光",
];

export function generateSearchQueries(
  name: string,
  extras?: string[]
): string[] {
  const queries = [
    `"${name}"`,
    `"${name}" 手机`,
    `"${name}" 联系方式`,
    `"${name}" 简历`,
    `"${name}" site:wenku.baidu.com`,
    `"${name}" site:zhihu.com`,
    `"${name}" site:weibo.com`,
  ];

  if (extras) {
    for (const extra of extras) {
      queries.push(`"${name}" "${extra}"`);
    }
  }

  return queries;
}

export function analyzeResult(
  result: { title?: string; snippet?: string; url?: string },
  name: string
): ScanResult | null {
  const title = result.title ?? "";
  const snippet = result.snippet ?? "";
  const url = result.url ?? "";
  const content = (title + " " + snippet).toLowerCase();
  const nameLower = name.toLowerCase();

  if (!content.includes(nameLower)) return null;

  const foundKeywords = SENSITIVE_KEYWORDS.filter((kw) =>
    content.includes(kw)
  );

  if (foundKeywords.length === 0) return null;

  const platform = detectPlatform(url);
  const platformInfo = getPlatformInfo(platform);

  return {
    url,
    title,
    snippet,
    sensitive_keywords: foundKeywords,
    risk_level: foundKeywords.length >= 2 ? "high" : "medium",
    platform,
    platform_name: platformInfo.name,
  };
}
