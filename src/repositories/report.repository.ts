import { db } from '../config/db';
import { reports } from '../models/schema';
import { eq } from 'drizzle-orm';

type ReportInput = {
  userId: number;
  number: number;
  time: Date;
  type: string;
  reason?: string;
};

export class ReportRepository {
  async create(report: ReportInput) {
    const [createdReport] = await db.insert(reports).values(report).returning();
    return createdReport;
  }

  async findByUserId(userId: number) {
    return db.select().from(reports).where(eq(reports.userId, userId));
  }

  async findById(id: number) {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async update(id: number, data: Partial<ReportInput>) {
    const [updatedReport] = await db
      .update(reports)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }

  async delete(id: number) {
    await db.delete(reports).where(eq(reports.id, id));
    return true;
  }
}