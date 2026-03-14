"use client";

const skills = [
  { id: "00", name: "Scanner", cn: "全网扫描", desc: "搜索引擎 + 平台定向 + 数据经纪人 + LLM" },
  { id: "01", name: "Self-Edit", cn: "自有修改", desc: "直接修改用户可控的账号信息" },
  { id: "02", name: "Negotiator", cn: "友好协商", desc: "4 种语气梯度私信，先礼后兵" },
  { id: "03", name: "Reporter", cn: "平台举报", desc: "平台举报 + 快照删除 + 监管投诉" },
  { id: "04", name: "SEO Diluter", cn: "信息稀释", desc: "SEO/GEO 双优化，正面内容压制" },
  { id: "05", name: "Legal", cn: "律师函", desc: "律师函模板 + 证据包 + 个保法请求" },
  { id: "06", name: "Monitor", cn: "持续监控", desc: "每周扫描 + 状态追踪 + 新内容预警" },
];

export function ArchitectureTree() {
  return (
    <div>
      {/* Orchestrator header */}
      <div className="border-b-2 border-[var(--ink)] pb-3 mb-8">
        <h2 className="font-[family-name:var(--font-serif)] text-[2rem] tracking-[-0.02em] leading-[1.1]">
          1 Orchestrator + 7 Skills
        </h2>
        <div className="font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.05em] text-[var(--ink-light)] mt-1">
          ACP 协议通信 · MCP 工具调用 · 失败自动升级
        </div>
      </div>

      {/* Skills table */}
      <table className="w-full border-collapse font-[family-name:var(--font-mono)] text-[0.85rem] mb-8">
        <thead>
          <tr className="border-b border-[var(--ink)]">
            <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem] w-[50px]">编号</th>
            <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem] w-[120px]">SKILL</th>
            <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem] w-[100px]">中文</th>
            <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">描述</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s.id} className="border-b border-dotted border-[var(--border-faint)] hover:bg-[#E8E5DF] transition-colors">
              <td className="py-2.5 text-[var(--ink-light)]">{s.id}</td>
              <td className="py-2.5 font-medium text-[0.9rem]">{s.name}</td>
              <td className="py-2.5">{s.cn}</td>
              <td className="py-2.5 text-[var(--ink-light)]">{s.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Feedback loop note */}
      <span className="block text-[0.75rem] text-[var(--ink-light)] border-l-2 border-[var(--border-faint)] pl-2">
        Fig 2.1: Monitor → 发现新内容 → Scanner → 重新执行 → Orchestrator（反馈循环）
      </span>
    </div>
  );
}
