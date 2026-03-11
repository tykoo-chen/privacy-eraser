import fs from "fs/promises";
import path from "path";
import type { TemplateMetadata } from "./types";

const TEMPLATES_DIR = path.join(process.cwd(), "templates");

const TEMPLATE_META: Record<string, Omit<TemplateMetadata, "slug" | "filename">> = {
  zhihu_report: { name: "知乎隐私投诉", platform: "zhihu", category: "platform" },
  weibo_report: { name: "微博隐私投诉", platform: "weibo", category: "platform" },
  weixin_report: { name: "微信公众号投诉", platform: "wechat", category: "platform" },
  xiaohongshu_report: { name: "小红书隐私投诉", platform: "xiaohongshu", category: "platform" },
  douyin_report: { name: "抖音隐私投诉", platform: "douyin", category: "platform" },
  baidu_removal: { name: "百度快照删除", platform: "baidu", category: "platform" },
  google_removal: { name: "Google 内容移除", platform: "google", category: "platform" },
  gdpr_request: { name: "GDPR 数据删除请求", platform: "general", category: "legal" },
  dmca_takedown: { name: "DMCA 侵权下架", platform: "general", category: "legal" },
  legal_warning_cn: { name: "律师函（中文）", platform: "general", category: "legal" },
  cyberspace_report: { name: "网信办举报", platform: "general", category: "legal" },
  generic_privacy: { name: "通用隐私投诉", platform: "general", category: "generic" },
};

export async function listTemplates(): Promise<TemplateMetadata[]> {
  const templates: TemplateMetadata[] = [];
  for (const [slug, meta] of Object.entries(TEMPLATE_META)) {
    templates.push({
      slug,
      filename: `${slug}.md`,
      ...meta,
    });
  }
  return templates;
}

export async function getTemplate(
  slug: string,
  variables?: Record<string, string>
): Promise<{ metadata: TemplateMetadata; content: string } | null> {
  const meta = TEMPLATE_META[slug];
  if (!meta) return null;

  const filePath = path.join(TEMPLATES_DIR, `${slug}.md`);
  try {
    let content = await fs.readFile(filePath, "utf-8");

    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        content = content.replaceAll(`[${key}]`, value);
      }
    }

    return {
      metadata: { slug, filename: `${slug}.md`, ...meta },
      content,
    };
  } catch {
    return null;
  }
}
