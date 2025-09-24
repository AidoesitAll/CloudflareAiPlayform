import { DurableObject } from 'cloudflare:workers';
import type { Env } from './core-utils';
import type { ReportItem } from './types';
export class ReportingAgent extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  async addReport(item: Omit<ReportItem, 'id'>): Promise<void> {
    const reportId = crypto.randomUUID();
    const newReport: ReportItem = {
      id: reportId,
      ...item,
    };
    // We use the reportId as the key for easy retrieval if needed.
    await this.ctx.storage.put(reportId, newReport);
    console.log(`New content report stored: ${reportId}`);
  }
  async listReports(): Promise<ReportItem[]> {
    const reportsMap = await this.ctx.storage.list<ReportItem>();
    const reports: ReportItem[] = [];
    for (const report of reportsMap.values()) {
      reports.push(report);
    }
    // Sort by timestamp, newest first
    return reports.sort((a, b) => b.timestamp - a.timestamp);
  }
}