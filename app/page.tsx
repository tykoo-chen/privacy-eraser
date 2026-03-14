"use client";

import { useState } from "react";
import { DemoFlow } from "@/components/demo/demo-flow";

const skills = [
  { id: "00", name: "自有修改", en: "Self-Edit", desc: "直接改" },
  { id: "01", name: "友好协商", en: "Negotiate", desc: "发私信" },
  { id: "02", name: "平台举报", en: "Report", desc: "提举报" },
  { id: "03", name: "快照删除", en: "Cache Del", desc: "删快照" },
  { id: "04", name: "信息稀释", en: "SEO Dilute", desc: "压排名" },
  { id: "05", name: "律师函", en: "Legal", desc: "发律函" },
];

const routes = [
  { situation: "自有账号", skill: "Self-Edit", desc: "直接修改" },
  { situation: "隐私泄露·有发布者", skill: "Negotiate", desc: "先礼后兵" },
  { situation: "匿名·严重泄露", skill: "Report", desc: "直接举报" },
  { situation: "负面评价·删不掉", skill: "SEO Dilute", desc: "信息稀释" },
  { situation: "真实·但过时", skill: "Negotiate", desc: "请求更新" },
  { situation: "数据经纪商", skill: "Report", desc: "Opt-out" },
];

const timeline = [
  { day: "Day 0", action: "首轮执行", detail: "自有账号直接改 · 私信发布者 · 匿名内容举报 · SEO 并行启动" },
  { day: "Day 2", action: "检查协商", detail: "私信无回复 → 发正式函（引用个保法）" },
  { day: "Day 5", action: "升级举报", detail: "正式函仍无回复 → 平台举报" },
  { day: "Day 7", action: "检查结果", detail: "跟踪所有举报处理状态" },
  { day: "Day 14", action: "监管投诉", detail: "举报未处理 → 网信办 / 12377.cn" },
  { day: "Day 21", action: "律师函", detail: "投诉无果 → 律师函" },
  { day: "Day 30", action: "效果报告", detail: "全面评估 + 复盘" },
];

export default function HomePage() {
  const [demoName, setDemoName] = useState("");
  const [activeName, setActiveName] = useState("");

  if (activeName) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <DemoFlow userName={activeName} onReset={() => setActiveName("")} />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8">
      {/* Hero — big serif title */}
      <section className="py-20 border-b border-[var(--border-faint)]">
        <div className="max-w-[700px]">
          <h1 className="font-[family-name:var(--font-serif)] text-[4rem] leading-[1.05] tracking-[-0.02em] font-normal mb-6">
            你的个人<br />公关 Agent
          </h1>
          <p className="text-[1.1rem] leading-[1.6] text-[var(--ink-light)] mb-8 max-w-[480px]">
            像明星经纪人一样管理你的数字身份。扫描全网 → 策略分配 → 自动执行 → 持续监控。先礼后兵，全自动。
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (demoName.trim()) setActiveName(demoName.trim()); }}
            className="flex items-center gap-4"
          >
            <input
              value={demoName}
              onChange={(e) => setDemoName(e.target.value)}
              placeholder="输入你的名字"
              className="font-[family-name:var(--font-mono)] text-[1rem] bg-transparent border-b-2 border-[var(--ink)] px-1 py-2 w-[280px] outline-none placeholder:text-[var(--border-faint)]"
            />
            <button
              type="submit"
              className="bg-[var(--ink)] text-[var(--paper)] font-[family-name:var(--font-mono)] text-[0.9rem] uppercase tracking-[0.1em] px-6 py-2.5 hover:bg-[var(--redact)] transition-colors cursor-pointer"
            >
              开始扫描
            </button>
          </form>
          <p className="font-[family-name:var(--font-mono)] text-[0.7rem] text-[var(--border-faint)] mt-3 tracking-[0.02em]">
            模拟演示，不进行真实搜索
          </p>
        </div>
      </section>

      {/* 六个手段 — index list style */}
      <section className="py-16 border-b border-[var(--border-faint)]">
        <div className="grid grid-cols-[280px_1fr] gap-16 max-md:grid-cols-1 max-md:gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-[2.2rem] tracking-[-0.02em] leading-[1.1] mb-4">
              六个手段
            </h2>
            <p className="text-[0.95rem] text-[var(--ink-light)] leading-[1.5]">
              从温和到强硬，失败自动升级。SEO 稀释从 Day 0 并行。
            </p>
          </div>
          <div>
            <ul className="font-[family-name:var(--font-mono)] text-[0.95rem]">
              {skills.map((s) => (
                <li key={s.id} className="flex items-baseline border-b border-dotted border-[var(--ink)] py-3 first:pt-0 last:border-b-0">
                  <span className="text-[var(--ink-light)] w-[50px] shrink-0">手段{s.id[1]}</span>
                  <span className="font-medium text-[1.1rem] w-[120px] shrink-0">{s.name}</span>
                  <span className="flex-1 border-b border-dotted border-[var(--border-faint)] mx-3 relative top-[-4px]" />
                  <span className="text-[var(--ink-light)] text-[0.85rem] w-[80px] text-right shrink-0">{s.en}</span>
                  <span className="text-[var(--ink-light)] text-[0.85rem] w-[60px] text-right shrink-0">{s.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 策略路由 — table */}
      <section className="py-16 border-b border-[var(--border-faint)]">
        <div className="grid grid-cols-[280px_1fr] gap-16 max-md:grid-cols-1 max-md:gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-[2.2rem] tracking-[-0.02em] leading-[1.1] mb-4">
              策略路由
            </h2>
            <p className="text-[0.95rem] text-[var(--ink-light)] leading-[1.5]">
              内容类型 × 来源 → 自动分配到对应手段。
            </p>
            <span className="block text-[0.75rem] text-[var(--ink-light)] mt-4 border-l-2 border-[var(--border-faint)] pl-2">
              Fig 1.2: 策略决策树路由规则
            </span>
          </div>
          <table className="font-[family-name:var(--font-mono)] text-[0.9rem] w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--ink)]">
                <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.75rem]">情况</th>
                <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.75rem]">手段</th>
                <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.75rem]">策略</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r, i) => (
                <tr key={i} className="border-b border-dotted border-[var(--border-faint)] hover:bg-[#E8E5DF] transition-colors">
                  <td className="py-3 text-[0.95rem]">{r.situation}</td>
                  <td className="py-3 font-medium">{r.skill}</td>
                  <td className="py-3 text-[var(--ink-light)]">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 升级时间线 */}
      <section className="py-16 border-b border-[var(--border-faint)]">
        <div className="grid grid-cols-[280px_1fr] gap-16 max-md:grid-cols-1 max-md:gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-[2.2rem] tracking-[-0.02em] leading-[1.1] mb-4">
              先礼后兵
            </h2>
            <p className="text-[0.95rem] text-[var(--ink-light)] leading-[1.5]">
              30 天升级时间线。每一步失败自动切换到更强手段。
            </p>
          </div>
          <div>
            {timeline.map((t, i) => (
              <div key={i} className="flex items-baseline border-b border-dotted border-[var(--border-faint)] py-3 last:border-b-0">
                <span className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)] w-[70px] shrink-0">{t.day}</span>
                <span className="font-[family-name:var(--font-mono)] text-[1rem] font-medium w-[100px] shrink-0">{t.action}</span>
                <span className="text-[0.9rem] text-[var(--ink-light)]">{t.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 能做 / 不能做 */}
      <section className="py-16 mb-12">
        <div className="grid grid-cols-[280px_1fr] gap-16 max-md:grid-cols-1 max-md:gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-[2.2rem] tracking-[-0.02em] leading-[1.1]">
              能力边界
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-12 max-md:grid-cols-1">
            <div>
              <h3 className="font-[family-name:var(--font-mono)] text-[0.8rem] uppercase tracking-[0.05em] border-b border-[var(--ink)] pb-2 mb-4">现在能做</h3>
              <ul className="space-y-2.5 text-[0.95rem]">
                {["全网搜索 + 风险分类", "自有账号直接编辑/删除", "生成 4 种语气的私信模板", "浏览器自动操作（私信/举报）", "百度/Google/Bing 快照删除", "策略决策树自动路由", "失败自动升级（协商→举报→律师函）", "律师函模板 + 证据包组装"].map((t) => (
                  <li key={t} className="flex items-baseline gap-2"><span className="text-[var(--ink-light)]">·</span>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-mono)] text-[0.8rem] uppercase tracking-[0.05em] border-b border-[var(--redact)] pb-2 mb-4 text-[var(--redact)]">还不能做</h3>
              <ul className="space-y-2.5 text-[0.95rem] text-[var(--ink-light)]">
                {["自动登录平台（需用户配合）", "绕过验证码", "保证 100% 删除成功", "代替律师出具法律意见", "替用户在平台发文（SEO）", "数据经纪人全自动清理", "跨境法律强制执行"].map((t) => (
                  <li key={t} className="flex items-baseline gap-2"><span>·</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
