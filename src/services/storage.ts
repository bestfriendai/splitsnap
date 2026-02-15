import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_NAME = 'splitsnap.db';

// Types
export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedTo?: string[];
}

export interface Receipt {
  id: string;
  merchant?: string;
  total: number;
  tax: number;
  items: ReceiptItem[];
  imageUri?: string;
  createdAt: string;
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: string;
}

export interface Split {
  id: string;
  receiptId: string;
  fromUser: string;
  toUser: string;
  amount: number;
  settled: boolean;
  createdAt: string;
}

// Database initialization
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      merchant TEXT,
      total REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      items TEXT DEFAULT '[]',
      imageUri TEXT,
      groupId TEXT,
      createdAt TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      members TEXT DEFAULT '[]',
      createdAt TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS splits (
      id TEXT PRIMARY KEY,
      receiptId TEXT NOT NULL,
      fromUser TEXT NOT NULL,
      toUser TEXT NOT NULL,
      amount REAL NOT NULL,
      settled INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (receiptId) REFERENCES receipts(id)
    );
  `);
  
  return db;
}

// Receipt operations
export async function saveReceipt(receipt: Receipt): Promise<void> {
  const db = await initDatabase();
  
  await db.runAsync(
    `INSERT OR REPLACE INTO receipts (id, merchant, total, tax, items, imageUri, groupId, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      receipt.id,
      receipt.merchant || '',
      receipt.total || 0,
      receipt.tax || 0,
      JSON.stringify(receipt.items || []),
      receipt.imageUri || '',
      receipt.groupId || '',
      receipt.createdAt,
    ]
  );
}

export async function loadReceipts(): Promise<Receipt[]> {
  const db = await initDatabase();
  
  const results = await db.getAllAsync<{
    id: string;
    merchant: string;
    total: number;
    tax: number;
    items: string;
    imageUri: string;
    groupId: string;
    createdAt: string;
  }>('SELECT * FROM receipts ORDER BY createdAt DESC');
  
  return results.map((row) => ({
    id: row.id,
    merchant: row.merchant,
    total: row.total,
    tax: row.tax,
    items: JSON.parse(row.items || '[]'),
    imageUri: row.imageUri,
    groupId: row.groupId,
    createdAt: row.createdAt,
  }));
}

export async function getReceipt(id: string): Promise<Receipt | null> {
  const db = await initDatabase();
  
  const result = await db.getFirstAsync<{
    id: string;
    merchant: string;
    total: number;
    tax: number;
    items: string;
    imageUri: string;
    groupId: string;
    createdAt: string;
  }>('SELECT * FROM receipts WHERE id = ?', [id]);
  
  if (!result) return null;
  
  return {
    id: result.id,
    merchant: result.merchant,
    total: result.total,
    tax: result.tax,
    items: JSON.parse(result.items || '[]'),
    imageUri: result.imageUri,
    groupId: result.groupId,
    createdAt: result.createdAt,
  };
}

export async function deleteReceipt(id: string): Promise<void> {
  const db = await initDatabase();
  await db.runAsync('DELETE FROM receipts WHERE id = ?', [id]);
  await db.runAsync('DELETE FROM splits WHERE receiptId = ?', [id]);
}

// Group operations
export async function saveGroup(group: Group): Promise<void> {
  const db = await initDatabase();
  
  await db.runAsync(
    `INSERT OR REPLACE INTO groups (id, name, members, createdAt)
     VALUES (?, ?, ?, ?)`,
    [group.id, group.name, JSON.stringify(group.members || []), group.createdAt]
  );
}

export async function loadGroups(): Promise<Group[]> {
  const db = await initDatabase();
  
  const results = await db.getAllAsync<{
    id: string;
    name: string;
    members: string;
    createdAt: string;
  }>('SELECT * FROM groups ORDER BY createdAt DESC');
  
  return results.map((row) => ({
    id: row.id,
    name: row.name,
    members: JSON.parse(row.members || '[]'),
    createdAt: row.createdAt,
  }));
}

export async function getGroup(id: string): Promise<Group | null> {
  const db = await initDatabase();
  
  const result = await db.getFirstAsync<{
    id: string;
    name: string;
    members: string;
    createdAt: string;
  }>('SELECT * FROM groups WHERE id = ?', [id]);
  
  if (!result) return null;
  
  return {
    id: result.id,
    name: result.name,
    members: JSON.parse(result.members || '[]'),
    createdAt: result.createdAt,
  };
}

// Split operations
export async function saveSplit(split: Split): Promise<void> {
  const db = await initDatabase();
  
  await db.runAsync(
    `INSERT OR REPLACE INTO splits (id, receiptId, fromUser, toUser, amount, settled, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [split.id, split.receiptId, split.fromUser, split.toUser, split.amount, split.settled ? 1 : 0, split.createdAt]
  );
}

export async function loadSplits(receiptId?: string): Promise<Split[]> {
  const db = await initDatabase();
  
  const query = receiptId 
    ? 'SELECT * FROM splits WHERE receiptId = ? ORDER BY createdAt DESC'
    : 'SELECT * FROM splits ORDER BY createdAt DESC';
  const params = receiptId ? [receiptId] : [];
  
  const results = await db.getAllAsync<{
    id: string;
    receiptId: string;
    fromUser: string;
    toUser: string;
    amount: number;
    settled: number;
    createdAt: string;
  }>(query, params);
  
  return results.map((row) => ({
    id: row.id,
    receiptId: row.receiptId,
    fromUser: row.fromUser,
    toUser: row.toUser,
    amount: row.amount,
    settled: row.settled === 1,
    createdAt: row.createdAt,
  }));
}

export async function settleSplit(id: string): Promise<void> {
  const db = await initDatabase();
  await db.runAsync('UPDATE splits SET settled = 1 WHERE id = ?', [id]);
}

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Onboarding flag
const ONBOARDING_KEY = '@splitsnap_onboarding_complete';

export async function getOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

// Premium status
const PREMIUM_KEY = '@splitsnap_premium';

export async function getPremiumStatus(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PREMIUM_KEY);
  return value === 'true';
}

export async function setPremiumStatus(premium: boolean): Promise<void> {
  await AsyncStorage.setItem(PREMIUM_KEY, premium.toString());
}
