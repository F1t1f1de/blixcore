import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export interface Lead {
  id?: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  created_at?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted';
}

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = process.env.DATABASE_PATH || './leads.db';
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private async init() {
    return new Promise<void>((resolve, reject) => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT,
          phone TEXT,
          message TEXT,
          status TEXT DEFAULT 'new',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async createLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO leads (name, email, company, phone, message, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [lead.name, lead.email, lead.company || '', lead.phone || '', lead.message || '', lead.status || 'new'],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async getLeads(): Promise<Lead[]> {
    const all = promisify(this.db.all.bind(this.db));
    
    return await all(`
      SELECT * FROM leads 
      ORDER BY created_at DESC
    `) as Lead[];
  }

  async updateLeadStatus(id: number, status: Lead['status']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE leads SET status = ? WHERE id = ?`,
        [status, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getLeadStats(): Promise<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
  }> {
    const get = promisify(this.db.get.bind(this.db));
    
    const [total, newLeads, contacted, qualified, converted] = await Promise.all([
      get(`SELECT COUNT(*) as count FROM leads`),
      get(`SELECT COUNT(*) as count FROM leads WHERE status = 'new'`),
      get(`SELECT COUNT(*) as count FROM leads WHERE status = 'contacted'`),
      get(`SELECT COUNT(*) as count FROM leads WHERE status = 'qualified'`),
      get(`SELECT COUNT(*) as count FROM leads WHERE status = 'converted'`)
    ]);
    
    return {
      total: (total as { count: number })?.count || 0,
      new: (newLeads as { count: number })?.count || 0,
      contacted: (contacted as { count: number })?.count || 0,
      qualified: (qualified as { count: number })?.count || 0,
      converted: (converted as { count: number })?.count || 0
    };
  }
}

export const database = new Database();