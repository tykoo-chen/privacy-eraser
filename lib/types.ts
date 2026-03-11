export type CaseStatus = "pending" | "reported" | "following" | "resolved" | "failed";

export interface CaseNote {
  time: string;
  text: string;
}

export interface Case {
  id: string;
  url: string;
  platform: string;
  platform_name: string;
  description: string;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
  notes: CaseNote[];
  risk_level?: "high" | "medium" | "low";
  scan_task_id?: string;
  report_task_id?: string;
}

export interface CasesData {
  cases: Case[];
  last_scan: string | null;
}

export interface PlatformInfo {
  name: string;
  method: string;
  time: string;
  tip: string;
}

export interface ScanResult {
  url: string;
  title: string;
  snippet: string;
  sensitive_keywords: string[];
  risk_level: "high" | "medium";
  platform: string;
  platform_name: string;
}

export interface ScanTaskState {
  id: string;
  status: "running" | "completed" | "failed";
  progress: number;
  total: number;
  results: ScanResult[];
  error?: string;
}

export interface ReportTaskState {
  id: string;
  case_id: string;
  status: "running" | "completed" | "failed";
  steps: ReportStep[];
  error?: string;
}

export interface ReportStep {
  step: number;
  action: string;
  status: "running" | "completed" | "failed";
  screenshot_path?: string;
  timestamp: string;
}

export interface TemplateMetadata {
  slug: string;
  name: string;
  platform: string;
  category: "platform" | "legal" | "generic";
  filename: string;
}

export interface AutomationScript {
  platform: string;
  goal: string;
  start_url: string | ((url: string) => string);
  steps: AutomationStepHint[];
  success_indicators: string[];
  form_data: Record<string, string>;
}

export interface AutomationStepHint {
  action: "navigate" | "find_and_click" | "fill" | "screenshot" | "wait";
  target?: string;
  text?: string;
  description: string;
}
