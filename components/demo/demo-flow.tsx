"use client";

import { useState, useEffect } from "react";

type Step = "scanning" | "results" | "strategy" | "executing" | "done";

interface ScanResult {
  id: number;
  level: "red" | "yellow" | "green" | "grey";
  platform: string;
  title: string;
  url: string;
  detail: string;
  assignedSkill?: string;
  selfEditable?: boolean;
}

function generateResults(name: string): ScanResult[] {
  return [
    { id: 1, level: "red", platform: "百度文库", title: `${name}的个人简历`, url: "wenku.baidu.com/view/abc123", detail: "包含手机号 138****1234、家庭住址", assignedSkill: "Negotiate" },
    { id: 2, level: "red", platform: "知乎", title: `${name}的微信号被泄露`, url: "zhihu.com/answer/987654", detail: "某回答中贴出了完整微信号", assignedSkill: "Report" },
    { id: 3, level: "red", platform: "某论坛", title: `${name}手机号曝光`, url: "forum.example.com/t/45678", detail: "帖子标题直接包含手机号", assignedSkill: "Report" },
    { id: 4, level: "yellow", platform: "微博", title: `关于${name}的负面评价`, url: "weibo.com/status/112233", detail: "不实评价，172 条转发", assignedSkill: "Negotiate" },
    { id: 5, level: "yellow", platform: "脉脉", title: `${name}的旧职位信息`, url: "maimai.cn/profile/xxx", detail: "显示 3 年前的职位，已过时", assignedSkill: "Self-Edit", selfEditable: true },
    { id: 6, level: "yellow", platform: "LinkedIn", title: `${name}过时的教育经历`, url: "linkedin.com/in/xxx", detail: "还显示本科信息，已读研", assignedSkill: "Self-Edit", selfEditable: true },
    { id: 7, level: "green", platform: "公司官网", title: `${name} - 团队介绍`, url: "company.com/team", detail: "正面职业介绍" },
    { id: 8, level: "green", platform: "GitHub", title: `${name}的开源项目`, url: "github.com/username", detail: "技术贡献" },
    { id: 9, level: "grey", platform: "百度", title: `同名${name}的新闻`, url: "baidu.com/s?q=...", detail: "确认为同名他人" },
  ];
}

const levelLabel: Record<string, string> = { red: "需紧急处理", yellow: "建议处理", green: "正面保留", grey: "无关" };
const riskColor: Record<string, string> = { red: "text-[var(--redact)] font-medium", yellow: "text-[var(--ink)]", green: "text-[var(--ink-light)]", grey: "text-[var(--border-faint)]" };
const riskIdx: Record<string, string> = { red: "0.9+", yellow: "0.5–0.8", green: "0.1", grey: "0.0" };

export function DemoFlow({ userName, onReset }: { userName: string; onReset: () => void }) {
  const [step, setStep] = useState<Step>("scanning");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [executionLog, setExecutionLog] = useState<{ text: string; skill: string }[]>([]);
  const [execIdx, setExecIdx] = useState(0);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const allResults = generateResults(userName);

  // Initialize checked items (red + yellow)
  useEffect(() => {
    const initial = new Set(allResults.filter(r => r.level === "red" || r.level === "yellow").map(r => r.id));
    setChecked(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  // Scan animation
  useEffect(() => {
    if (step !== "scanning") return;
    const queries = [
      `web_search "${userName}"`,
      `web_search "${userName}" 手机 OR 联系方式`,
      `web_search "${userName}" 简历 OR resume`,
      `web_search "${userName}" site:zhihu.com`,
      `web_search "${userName}" site:weibo.com`,
      `web_search "${userName}" site:wenku.baidu.com`,
      `web_search "${userName}" site:maimai.cn`,
      `检查 LinkedIn / GitHub...`,
      `分析结果，标记风险等级...`,
    ];
    let i = 0;
    const t = setInterval(() => {
      if (i < queries.length) {
        setScanLog(p => [...p, queries[i]]);
        setScanProgress(Math.round(((i + 1) / queries.length) * 100));
        i++;
      } else { clearInterval(t); setTimeout(() => setStep("results"), 400); }
    }, 400);
    return () => clearInterval(t);
  }, [step, userName]);

  // Execute animation
  const execSteps = [
    { text: `直接修改 脉脉 过时职位信息（自有账号）`, skill: "Self-Edit" },
    { text: `直接更新 LinkedIn 教育经历（自有账号）`, skill: "Self-Edit" },
    { text: `向百度文库上传者发送友好私信`, skill: "Negotiate" },
    { text: `向知乎提交隐私举报：微信号泄露`, skill: "Report" },
    { text: `向论坛管理员举报：手机号曝光`, skill: "Report" },
    { text: `向微博博主发送私信：请求删除不实评价`, skill: "Negotiate" },
    { text: `制定 SEO 稀释策略（并行启动）`, skill: "SEO Dilute" },
    { text: `提交百度快照删除申请`, skill: "Report" },
    { text: `设置每周自动监控扫描`, skill: "Monitor" },
    { text: `第一轮完成：直接改 2 项，联系 2 人，举报 3 条`, skill: "完成" },
  ];

  useEffect(() => {
    if (step !== "executing") return;
    const steps = [...execSteps];
    let i = 0, cancelled = false;
    setExecutionLog([]);
    setExecIdx(0);
    const t = setInterval(() => {
      if (cancelled) return;
      if (i < steps.length) {
        const current = steps[i];
        if (current) {
          setExecutionLog(p => [...p, current]);
          setExecIdx(i + 1);
        }
        i++;
      } else { clearInterval(t); if (!cancelled) setTimeout(() => setStep("done"), 600); }
    }, 500);
    return () => { cancelled = true; clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const toggleCheck = (id: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const stepLabels = ["扫描中", "结果审查", "策略分配", "执行中", "完成"];
  const stepKeys: Step[] = ["scanning", "results", "strategy", "executing", "done"];
  const curIdx = stepKeys.indexOf(step);

  return (
    <div className="grid grid-cols-[240px_1fr] gap-16 max-md:grid-cols-1 max-md:gap-6">
      {/* Left ledger */}
      <aside>
        <header className="border-b-2 border-[var(--ink)] pb-3 mb-6">
          <h1 className="font-[family-name:var(--font-serif)] text-[2rem] leading-[1.1] tracking-[-0.02em]">
            隐私扫描
          </h1>
          <div className="font-[family-name:var(--font-mono)] text-[0.7rem] uppercase tracking-[0.05em] text-[var(--ink-light)] mt-1.5">
            目标: {userName} // 模拟演示
          </div>
        </header>

        {/* Progress index */}
        <ul className="font-[family-name:var(--font-mono)] text-[0.85rem] space-y-2">
          {stepLabels.map((label, i) => (
            <li key={label} className={`flex items-baseline ${i === curIdx ? "font-medium" : "text-[var(--ink-light)]"}`}>
              <span className="w-[30px] shrink-0">{String(i + 1).padStart(2, "0")}.</span>
              <span className={i === curIdx ? "" : ""}>{label}</span>
              <span className="flex-1 border-b border-dotted border-[var(--border-faint)] mx-2 relative top-[-3px]" />
              <span className="text-[0.75rem]">{i < curIdx ? "✓" : i === curIdx ? "●" : "○"}</span>
            </li>
          ))}
        </ul>

        <button onClick={onReset} className="mt-8 font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)] hover:text-[var(--ink)] border-b border-dotted border-[var(--border-faint)] hover:border-[var(--ink)] transition-colors cursor-pointer">
          ← 返回首页
        </button>
      </aside>

      {/* Right examination area */}
      <section>
        {/* SCANNING */}
        {step === "scanning" && (
          <div>
            <header className="flex justify-between items-end border-b border-[var(--ink)] pb-2 mb-6">
              <h2 className="font-[family-name:var(--font-mono)] text-[1.3rem] uppercase tracking-[-0.01em]">正在扫描</h2>
              <span className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)]">{scanProgress}%</span>
            </header>
            <div className="w-full h-[3px] bg-[var(--border-faint)] mb-6">
              <div className="h-full bg-[var(--ink)] transition-all duration-300" style={{ width: `${scanProgress}%` }} />
            </div>
            <div className="border border-[var(--border-faint)] p-4 font-[family-name:var(--font-mono)] text-[0.8rem] space-y-1.5 max-h-[300px] overflow-y-auto">
              {scanLog.map((l, i) => (
                <div key={i} className="flex gap-2 text-[var(--ink-light)]">
                  <span className="text-[var(--ink)] shrink-0">❯</span>
                  <span>{l}</span>
                </div>
              ))}
              {scanProgress < 100 && <div className="text-[var(--ink)] animate-pulse">▋</div>}
            </div>
          </div>
        )}

        {/* RESULTS — evidence table */}
        {step === "results" && (
          <div>
            <header className="flex justify-between items-end border-b border-[var(--ink)] pb-2 mb-6">
              <h2 className="font-[family-name:var(--font-mono)] text-[1.3rem] uppercase tracking-[-0.01em]">扫描结果</h2>
              <span className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)]">
                共 {allResults.length} 条 / 已选 {checked.size} 条
              </span>
            </header>

            <table className="w-full border-collapse font-[family-name:var(--font-mono)] text-[0.8rem] mb-6">
              <thead>
                <tr className="border-b border-[var(--ink)]">
                  <th className="text-center py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] w-[40px] text-[0.7rem]">选</th>
                  <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">来源</th>
                  <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">内容</th>
                  <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">详情</th>
                  <th className="text-right py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem] w-[60px]">风险</th>
                </tr>
              </thead>
              <tbody>
                {allResults.map(item => (
                  <tr key={item.id} className="border-b border-dotted border-[var(--border-faint)] hover:bg-[#E8E5DF] transition-colors">
                    <td className="py-2.5 text-center">
                      <label className="cursor-pointer select-none font-[family-name:var(--font-mono)]" onClick={() => toggleCheck(item.id)}>
                        {checked.has(item.id) ? "[X]" : "[ ]"}
                      </label>
                    </td>
                    <td className="py-2.5 text-[0.85rem]">{item.platform}</td>
                    <td className="py-2.5 text-[0.85rem]">{item.title}</td>
                    <td className="py-2.5 text-[var(--ink-light)] text-[0.8rem]">{item.detail}</td>
                    <td className={`py-2.5 text-right ${riskColor[item.level]}`}>{riskIdx[item.level]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center border-t border-[var(--ink)] pt-4">
              <div className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)]">
                已选待处理: {checked.size} 条
              </div>
              <button
                onClick={() => setStep("strategy")}
                className="bg-[var(--ink)] text-[var(--paper)] font-[family-name:var(--font-mono)] text-[0.85rem] uppercase tracking-[0.1em] px-6 py-2.5 hover:bg-[var(--redact)] transition-colors cursor-pointer"
              >
                确认处理 →
              </button>
            </div>
            <span className="block text-[0.7rem] text-[var(--ink-light)] mt-2 text-right">操作不可逆，请确认选择</span>
          </div>
        )}

        {/* STRATEGY */}
        {step === "strategy" && (
          <div>
            <header className="flex justify-between items-end border-b border-[var(--ink)] pb-2 mb-6">
              <h2 className="font-[family-name:var(--font-mono)] text-[1.3rem] uppercase tracking-[-0.01em]">策略分配</h2>
              <span className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)]">
                类型 × 来源 → 手段
              </span>
            </header>

            <table className="w-full border-collapse font-[family-name:var(--font-mono)] text-[0.8rem] mb-6">
              <thead>
                <tr className="border-b border-[var(--ink)]">
                  <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">内容</th>
                  <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">详情</th>
                  <th className="text-right py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem] w-[100px]">分配手段</th>
                </tr>
              </thead>
              <tbody>
                {allResults.filter(r => checked.has(r.id)).map(item => (
                  <tr key={item.id} className="border-b border-dotted border-[var(--border-faint)] hover:bg-[#E8E5DF] transition-colors">
                    <td className="py-2.5 text-[0.85rem]">{item.title}</td>
                    <td className="py-2.5 text-[var(--ink-light)] text-[0.8rem]">{item.detail}</td>
                    <td className="py-2.5 text-right font-medium">{item.assignedSkill || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border border-[var(--border-faint)] p-4 mb-6">
              <div className="font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.05em] text-[var(--ink-light)] mb-3">执行计划摘要</div>
              <div className="text-[0.9rem] space-y-1.5 leading-[1.5]">
                <p>· <strong>Self-Edit</strong> 直接修改 2 项自有账号内容（脉脉、LinkedIn）</p>
                <p>· <strong>Negotiate</strong> 私信 2 位发布者（百度文库、微博博主）</p>
                <p>· <strong>Report</strong> 提交 3 条举报（知乎、论坛、快照删除）</p>
                <p>· <strong>SEO Dilute</strong> 并行制定正面内容策略</p>
                <p className="text-[var(--ink-light)] text-[0.85rem]">48h 协商无果 → 自动升级 Report → 7天无果 → 律师函</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-[var(--ink)] pt-4">
              <div className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)]">
                待执行: {checked.size} 项操作
              </div>
              <button
                onClick={() => setStep("executing")}
                className="bg-[var(--ink)] text-[var(--paper)] font-[family-name:var(--font-mono)] text-[0.85rem] uppercase tracking-[0.1em] px-6 py-2.5 hover:bg-[var(--redact)] transition-colors cursor-pointer"
              >
                开始执行 →
              </button>
            </div>
          </div>
        )}

        {/* EXECUTING */}
        {step === "executing" && (
          <div>
            <header className="flex justify-between items-end border-b border-[var(--ink)] pb-2 mb-6">
              <h2 className="font-[family-name:var(--font-mono)] text-[1.3rem] uppercase tracking-[-0.01em]">执行中</h2>
              <span className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)]">
                {execIdx}/{execSteps.length}
              </span>
            </header>
            <div className="w-full h-[3px] bg-[var(--border-faint)] mb-6">
              <div className="h-full bg-[var(--ink)] transition-all duration-300" style={{ width: `${(execIdx / execSteps.length) * 100}%` }} />
            </div>
            <table className="w-full border-collapse font-[family-name:var(--font-mono)] text-[0.8rem]">
              <thead>
                <tr className="border-b border-[var(--ink)]">
                  <th className="text-center py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] w-[30px] text-[0.7rem]">#</th>
                  <th className="text-left py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem]">操作</th>
                  <th className="text-right py-2 font-normal text-[var(--ink-light)] uppercase tracking-[0.05em] text-[0.7rem] w-[100px]">手段</th>
                </tr>
              </thead>
              <tbody>
                {executionLog.filter(Boolean).map((l, i) => (
                  <tr key={i} className="border-b border-dotted border-[var(--border-faint)]">
                    <td className="py-2 text-center text-[var(--ink-light)]">{String(i + 1).padStart(2, "0")}</td>
                    <td className="py-2 text-[0.85rem]">{l.text}</td>
                    <td className="py-2 text-right text-[var(--ink-light)]">{l.skill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {execIdx < execSteps.length && (
              <div className="mt-4 font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)] animate-pulse">
                ▋ 执行中...
              </div>
            )}
          </div>
        )}

        {/* DONE */}
        {step === "done" && (
          <div>
            <header className="flex justify-between items-end border-b-2 border-[var(--ink)] pb-2 mb-6">
              <h2 className="font-[family-name:var(--font-serif)] text-[2rem] tracking-[-0.02em]">第一轮完成</h2>
              <span className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)]">
                处理完毕
              </span>
            </header>

            <p className="text-[1rem] leading-[1.6] text-[var(--ink-light)] mb-8 max-w-[500px]">
              直接修改 2 项，联系 2 位发布者，提交 3 条举报，SEO 策略已启动。Agent 将持续跟进并自动升级。
            </p>

            {/* Stats */}
            <div className="font-[family-name:var(--font-mono)] text-[0.85rem] mb-8">
              <div className="flex items-baseline border-b border-dotted border-[var(--ink)] py-2">
                <span className="w-[120px] shrink-0">直接修改</span>
                <span className="flex-1 border-b border-dotted border-[var(--border-faint)] mx-3 relative top-[-3px]" />
                <span className="font-medium text-[1.1rem]">2 项</span>
              </div>
              <div className="flex items-baseline border-b border-dotted border-[var(--ink)] py-2">
                <span className="w-[120px] shrink-0">已联系</span>
                <span className="flex-1 border-b border-dotted border-[var(--border-faint)] mx-3 relative top-[-3px]" />
                <span className="font-medium text-[1.1rem]">2 人</span>
              </div>
              <div className="flex items-baseline border-b border-dotted border-[var(--ink)] py-2">
                <span className="w-[120px] shrink-0">已举报</span>
                <span className="flex-1 border-b border-dotted border-[var(--border-faint)] mx-3 relative top-[-3px]" />
                <span className="font-medium text-[1.1rem]">3 条</span>
              </div>
              <div className="flex items-baseline border-b border-dotted border-[var(--ink)] py-2">
                <span className="w-[120px] shrink-0">SEO 策略</span>
                <span className="flex-1 border-b border-dotted border-[var(--border-faint)] mx-3 relative top-[-3px]" />
                <span className="font-medium text-[1.1rem]">已启动</span>
              </div>
              <div className="flex items-baseline py-2">
                <span className="w-[120px] shrink-0">持续监控</span>
                <span className="flex-1 border-b border-dotted border-[var(--border-faint)] mx-3 relative top-[-3px]" />
                <span className="font-medium text-[1.1rem]">ON</span>
              </div>
            </div>

            {/* Escalation timeline */}
            <div className="border border-[var(--border-faint)] p-4 mb-8">
              <div className="font-[family-name:var(--font-mono)] text-[0.75rem] uppercase tracking-[0.05em] text-[var(--ink-light)] mb-3">自动升级时间线</div>
              {[
                { d: "48h", t: "检查协商结果，未回复自动转举报" },
                { d: "72h", t: "微博负面帖，协商失败启动 SEO 稀释" },
                { d: "7 天", t: "检查举报结果" },
                { d: "14 天", t: "向网信办提交投诉" },
                { d: "21 天", t: "投诉无果建议律师函" },
                { d: "30 天", t: "全面评估，效果报告" },
              ].map((item, i) => (
                <div key={i} className="flex items-baseline border-b border-dotted border-[var(--border-faint)] py-2 last:border-b-0">
                  <span className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)] w-[60px] shrink-0">{item.d}</span>
                  <span className="text-[0.85rem]">{item.t}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 border-t border-[var(--ink)] pt-4">
              <button onClick={onReset} className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)] hover:text-[var(--ink)] border-b border-dotted border-[var(--border-faint)] hover:border-[var(--ink)] transition-colors cursor-pointer">
                ← 返回首页
              </button>
              <button
                onClick={() => { setStep("scanning"); setScanProgress(0); setScanLog([]); setExecutionLog([]); setExecIdx(0); }}
                className="font-[family-name:var(--font-mono)] text-[0.8rem] text-[var(--ink-light)] hover:text-[var(--ink)] border-b border-dotted border-[var(--border-faint)] hover:border-[var(--ink)] transition-colors cursor-pointer"
              >
                重新演示 →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
