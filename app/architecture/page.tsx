"use client";

import { ArchitectureTree } from "@/components/demo/architecture-tree";

const protocols = [
  { layer: "用户层", proto: "Telegram Bot API", conn: "用户 → Agent", usage: "用户通过 Telegram 发消息触发" },
  { layer: "工具层", proto: "MCP", conn: "Agent → 工具", usage: "Agent 调用 browser、web_search、cron" },
  { layer: "Agent 层", proto: "ACP", conn: "Agent → Agent", usage: "Orchestrator 调度 Scanner / Negotiator / Reporter" },
  { layer: "知识层", proto: "SKILL.md", conn: "指令 → Agent", usage: "每个 Skill 有独立 SKILL.md 定义行为" },
];

export default function ArchitecturePage() {
  return (
    <div className="max-w-[1200px] mx-auto px-8">
      {/* Header */}
      <section className="py-16 border-b border-[var(--border-faint)]">
        <div className="max-w-[700px]">
          <h1 className="font-[family-name:var(--font-serif)] text-[3.5rem] leading-[1.05] tracking-[-0.02em] font-normal mb-4">
            系统架构
          </h1>
          <p className="text-[1rem] text-[var(--ink-light)] leading-[1.6]">
            一个 Orchestrator 协调七个专业 Skill，ACP 协议通信，MCP 工具调用。
          </p>
        </div>
      </section>

      {/* Architecture Tree */}
      <section className="py-16 border-b border-[var(--border-faint)]">
        <ArchitectureTree />
      </section>

      {/* Execution Logic — side by side */}
      <section className="py-16 border-b border-[var(--border-faint)]">
        <div className="grid grid-cols-[280px_1fr] gap-16 max-md:grid-cols-1 max-md:gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-[2.2rem] tracking-[-0.02em] leading-[1.1] mb-4">
              执行逻辑
            </h2>
            <p className="text-[0.95rem] text-[var(--ink-light)] leading-[1.5]">
              Skill 模式与 Agent 模式的对比。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
            {/* Skill mode */}
            <div className="border border-[var(--border-faint)] p-4">
              <div className="font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.05em] text-[var(--ink-light)] mb-3">Skill 模式</div>
              <pre className="font-[family-name:var(--font-mono)] text-[0.7rem] leading-relaxed text-[var(--ink-light)] whitespace-pre overflow-x-auto">
{`用户输入
│
▼
Orchestrator
│
├→ Scanner（第一步）
│  返回分类结果
│
├→ 策略路由引擎
│  ├ 自有账号 → Self-Edit
│  ├ 有发布者 → Negotiate
│  ├ 匿名严重 → Report
│  └ 删不掉   → SEO Dilute
│
├→ 时间升级引擎
│  Day 0 → Day 30
│
└→ Monitor ↻ Scanner
   反馈循环`}
              </pre>
              <span className="block text-[0.7rem] text-[var(--ink-light)] mt-3 border-l-2 border-[var(--border-faint)] pl-2">
                每个 Skill 独立、可复用，有自己的 SKILL.md
              </span>
            </div>

            {/* Agent mode */}
            <div className="border border-[var(--border-faint)] p-4">
              <div className="font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.05em] text-[var(--ink-light)] mb-3">Agent 模式</div>
              <pre className="font-[family-name:var(--font-mono)] text-[0.7rem] leading-relaxed text-[var(--ink-light)] whitespace-pre overflow-x-auto">
{`用户消息 (Telegram)
│
▼
主 Agent (LLM)
MCP Tools:
├ web_search
├ browser
├ file_system
└ cron
│
├→ 搜索子 Agent
├→ 分析子 Agent
├→ 执行子 Agent
│  ├ 浏览器A → 私信
│  ├ 浏览器B → 举报
│  └ 浏览器C → 删快照
│
└→ 监控子 Agent
   cron 定时任务`}
              </pre>
              <span className="block text-[0.7rem] text-[var(--ink-light)] mt-3 border-l-2 border-[var(--border-faint)] pl-2">
                主 Agent 直接用 MCP 工具，子 Agent 是内部分工
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol table */}
      <section className="py-16 border-b border-[var(--border-faint)]">
        <div className="grid grid-cols-[280px_1fr] gap-16 max-md:grid-cols-1 max-md:gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-[2.2rem] tracking-[-0.02em] leading-[1.1] mb-4">
              四层协议
            </h2>
          </div>
          <table className="font-[family-name:var(--font-mono)] text-[0.85rem] w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--ink)]">
                <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">层级</th>
                <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">协议</th>
                <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">连接</th>
                <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">在本系统中</th>
              </tr>
            </thead>
            <tbody>
              {protocols.map((p, i) => (
                <tr key={i} className="border-b border-dotted border-[var(--border-faint)] hover:bg-[#E8E5DF] transition-colors">
                  <td className="py-2.5">{p.layer}</td>
                  <td className="py-2.5 font-medium">{p.proto}</td>
                  <td className="py-2.5 text-[var(--ink-light)]">{p.conn}</td>
                  <td className="py-2.5 text-[var(--ink-light)]">{p.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Escalation chain */}
      <section className="py-16 mb-12">
        <div className="grid grid-cols-[280px_1fr] gap-16 max-md:grid-cols-1 max-md:gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-[2.2rem] tracking-[-0.02em] leading-[1.1] mb-4">
              升级链
            </h2>
            <p className="text-[0.95rem] text-[var(--ink-light)] leading-[1.5]">
              先礼后兵。每一步失败自动切换到更强手段。
            </p>
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[0.9rem]">
            {[
              { n: "手段0", name: "Self-Edit", desc: "直接修改自有账号" },
              { n: "手段1", name: "Negotiate", desc: "友好私信 → 正式函" },
              { n: "手段2", name: "Report", desc: "平台举报 + 快照删除" },
              { n: "手段3", name: "Cache Del", desc: "搜索引擎快照清除" },
              { n: "手段4", name: "SEO Dilute", desc: "正面内容压制（并行）" },
              { n: "手段5", name: "Legal", desc: "律师函 + 证据包" },
            ].map((s, i, arr) => (
              <div key={s.n}>
                <div className="flex items-baseline border-b border-dotted border-[var(--ink)] py-3">
                  <span className="text-[var(--ink-light)] w-[60px] shrink-0">{s.n}</span>
                  <span className="font-medium w-[120px] shrink-0">{s.name}</span>
                  <span className="flex-1 border-b border-dotted border-[var(--border-faint)] mx-3 relative top-[-3px]" />
                  <span className="text-[var(--ink-light)] text-[0.85rem]">{s.desc}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-[0.75rem] text-[var(--ink-light)] py-1 pl-[60px]">↓ 失败</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
