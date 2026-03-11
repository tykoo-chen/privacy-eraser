import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import lockfile from "proper-lockfile";
import type { Case, CasesData, CaseStatus, ScanResult } from "./types";
import { detectPlatform, getPlatformInfo } from "./platforms";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "cases");
const CASES_FILE = path.join(DATA_DIR, "cases.json");
const SCANS_DIR = path.join(DATA_DIR, "scans");

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(SCANS_DIR, { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, "screenshots"), { recursive: true });
}

async function readCasesFile(): Promise<CasesData> {
  try {
    const raw = await fs.readFile(CASES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { cases: [], last_scan: null };
  }
}

async function writeCasesFile(data: CasesData): Promise<void> {
  await ensureDirs();
  // Ensure the file exists for locking
  try {
    await fs.access(CASES_FILE);
  } catch {
    await fs.writeFile(CASES_FILE, JSON.stringify({ cases: [], last_scan: null }, null, 2));
  }
  const release = await lockfile.lock(CASES_FILE, { retries: 3 });
  try {
    await fs.writeFile(CASES_FILE, JSON.stringify(data, null, 2), "utf-8");
  } finally {
    await release();
  }
}

function generateCaseId(url: string): string {
  return crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
}

// --- Cases ---

export async function getCases(filter?: {
  status?: CaseStatus;
  platform?: string;
}): Promise<Case[]> {
  const data = await readCasesFile();
  let cases = data.cases;
  if (filter?.status) {
    cases = cases.filter((c) => c.status === filter.status);
  }
  if (filter?.platform) {
    cases = cases.filter((c) => c.platform === filter.platform);
  }
  return cases;
}

export async function getCase(id: string): Promise<Case | null> {
  const data = await readCasesFile();
  return data.cases.find((c) => c.id === id) ?? null;
}

export async function createCase(input: {
  url: string;
  description?: string;
  risk_level?: "high" | "medium" | "low";
  scan_task_id?: string;
}): Promise<Case> {
  const data = await readCasesFile();
  const id = generateCaseId(input.url);

  // Check duplicate
  const existing = data.cases.find((c) => c.id === id);
  if (existing) return existing;

  const platform = detectPlatform(input.url);
  const platformInfo = getPlatformInfo(platform);
  const now = new Date().toISOString();

  const newCase: Case = {
    id,
    url: input.url,
    platform,
    platform_name: platformInfo.name,
    description: input.description || "",
    status: "pending",
    created_at: now,
    updated_at: now,
    notes: [],
    risk_level: input.risk_level,
    scan_task_id: input.scan_task_id,
  };

  data.cases.push(newCase);
  await writeCasesFile(data);
  return newCase;
}

export async function updateCase(
  id: string,
  updates: { status?: CaseStatus; note?: string; report_task_id?: string }
): Promise<Case | null> {
  const data = await readCasesFile();
  const idx = data.cases.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const c = data.cases[idx];
  const now = new Date().toISOString();

  if (updates.status) c.status = updates.status;
  if (updates.report_task_id) c.report_task_id = updates.report_task_id;
  c.updated_at = now;

  if (updates.note) {
    c.notes.push({ time: now, text: updates.note });
  }

  data.cases[idx] = c;
  await writeCasesFile(data);
  return c;
}

// --- Scan Results ---

export async function saveScanResults(
  taskId: string,
  results: ScanResult[]
): Promise<void> {
  await ensureDirs();
  const filePath = path.join(SCANS_DIR, `${taskId}.json`);
  await fs.writeFile(filePath, JSON.stringify(results, null, 2), "utf-8");
}

export async function getScanResults(taskId: string): Promise<ScanResult[]> {
  try {
    const filePath = path.join(SCANS_DIR, `${taskId}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// --- In-memory task state (for SSE) ---

const taskStates = new Map<string, unknown>();

export function getTaskState<T>(taskId: string): T | undefined {
  return taskStates.get(taskId) as T | undefined;
}

export function setTaskState<T>(taskId: string, state: T): void {
  taskStates.set(taskId, state);
}

export function deleteTaskState(taskId: string): void {
  taskStates.delete(taskId);
}
