export interface Memory {
  id?: number;
  type: "short" | "long" | "vector";
  content: string;
  importance: number;
  timestamp: number;
  embedding?: number[];
}

export interface Conversation {
  id?: number;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface InMemoryStorage {
  memories: Memory[];
  conversations: Conversation[];
  nextMemoryId: number;
  nextConversationId: number;
}

let Database: any = null;
let join: any = null;
let homedir: any = null;

if (typeof window === "undefined") {
  Database = require("better-sqlite3");
  join = require("path").join;
  homedir = require("os").homedir;
}

export class MemoryService {
  private db: any;
  private inMemoryStorage: InMemoryStorage | null;
  private isBrowser: boolean;

  constructor(dbPath?: string) {
    this.isBrowser = typeof window !== "undefined";

    if (this.isBrowser) {
      this.db = null;
      this.inMemoryStorage = {
        memories: [],
        conversations: [],
        nextMemoryId: 1,
        nextConversationId: 1,
      };
    } else if (Database && join && homedir) {
      const defaultPath = join(homedir(), ".ai-desktop-maid", "memories.db");
      const path = dbPath || defaultPath;
      this.db = new Database(path);
      this.inMemoryStorage = null;
      this.initDatabase();
    } else {
      this.db = null;
      this.inMemoryStorage = {
        memories: [],
        conversations: [],
        nextMemoryId: 1,
        nextConversationId: 1,
      };
    }
  }

  private initDatabase(): void {
    if (this.db) {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS memories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          content TEXT NOT NULL,
          importance INTEGER DEFAULT 1,
          timestamp INTEGER NOT NULL,
          embedding BLOB
        );

        CREATE TABLE IF NOT EXISTS conversations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_memories_timestamp ON memories(timestamp);
        CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
        CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp);
      `);
    }
  }

  addMemory(memory: Memory): number {
    if (this.isBrowser && this.inMemoryStorage) {
      const newMemory = {
        ...memory,
        id: this.inMemoryStorage.nextMemoryId++,
      };
      this.inMemoryStorage.memories.push(newMemory);
      return newMemory.id;
    }

    if (this.db) {
      const stmt = this.db.prepare(`
        INSERT INTO memories (type, content, importance, timestamp, embedding)
        VALUES (?, ?, ?, ?, ?)
      `);

      const embeddingBuffer = memory.embedding
        ? new Float32Array(memory.embedding).buffer
        : null;

      const result = stmt.run(
        memory.type,
        memory.content,
        memory.importance,
        memory.timestamp,
        embeddingBuffer,
      );

      return result.lastInsertRowid as number;
    }

    return 0;
  }

  getMemories(limit: number = 20, offset: number = 0): Memory[] {
    if (this.isBrowser && this.inMemoryStorage) {
      return this.inMemoryStorage.memories
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(offset, offset + limit);
    }

    if (this.db) {
      const stmt = this.db.prepare(`
        SELECT * FROM memories
        ORDER BY timestamp DESC
        LIMIT ? OFFSET ?
      `);

      const rows = stmt.all(limit, offset) as any[];

      return rows.map((row) => ({
        id: row.id,
        type: row.type,
        content: row.content,
        importance: row.importance,
        timestamp: row.timestamp,
        embedding: row.embedding
          ? Array.from(new Float32Array(row.embedding))
          : undefined,
      }));
    }

    return [];
  }

  getMemoriesByType(
    type: "short" | "long" | "vector",
    limit: number = 20,
  ): Memory[] {
    if (this.isBrowser && this.inMemoryStorage) {
      return this.inMemoryStorage.memories
        .filter((memory) => memory.type === type)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    }

    if (this.db) {
      const stmt = this.db.prepare(`
        SELECT * FROM memories
        WHERE type = ?
        ORDER BY timestamp DESC
        LIMIT ?
      `);

      const rows = stmt.all(type, limit) as any[];

      return rows.map((row) => ({
        id: row.id,
        type: row.type,
        content: row.content,
        importance: row.importance,
        timestamp: row.timestamp,
        embedding: row.embedding
          ? Array.from(new Float32Array(row.embedding))
          : undefined,
      }));
    }

    return [];
  }

  addConversation(conversation: Conversation): number {
    if (this.isBrowser && this.inMemoryStorage) {
      const newConversation = {
        ...conversation,
        id: this.inMemoryStorage.nextConversationId++,
      };
      this.inMemoryStorage.conversations.push(newConversation);
      return newConversation.id;
    }

    if (this.db) {
      const stmt = this.db.prepare(`
        INSERT INTO conversations (role, content, timestamp)
        VALUES (?, ?, ?)
      `);

      const result = stmt.run(
        conversation.role,
        conversation.content,
        conversation.timestamp,
      );

      return result.lastInsertRowid as number;
    }

    return 0;
  }

  getRecentConversations(limit: number = 20): Conversation[] {
    if (this.isBrowser && this.inMemoryStorage) {
      return this.inMemoryStorage.conversations
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    }

    if (this.db) {
      const stmt = this.db.prepare(`
        SELECT * FROM conversations
        ORDER BY timestamp DESC
        LIMIT ?
      `);

      const rows = stmt.all(limit) as any[];

      return rows.map((row) => ({
        id: row.id,
        role: row.role,
        content: row.content,
        timestamp: row.timestamp,
      }));
    }

    return [];
  }

  searchMemories(query: string, limit: number = 5): Memory[] {
    if (this.isBrowser && this.inMemoryStorage) {
      return this.inMemoryStorage.memories
        .filter((memory) => memory.content.includes(query))
        .sort(
          (a, b) => b.importance - a.importance || b.timestamp - a.timestamp,
        )
        .slice(0, limit);
    }

    if (this.db) {
      const stmt = this.db.prepare(`
        SELECT * FROM memories
        WHERE content LIKE ?
        ORDER BY importance DESC, timestamp DESC
        LIMIT ?
      `);

      const rows = stmt.all(`%${query}%`, limit) as any[];

      return rows.map((row) => ({
        id: row.id,
        type: row.type,
        content: row.content,
        importance: row.importance,
        timestamp: row.timestamp,
        embedding: row.embedding
          ? Array.from(new Float32Array(row.embedding))
          : undefined,
      }));
    }

    return [];
  }

  deleteMemory(id: number): void {
    if (this.isBrowser && this.inMemoryStorage) {
      this.inMemoryStorage.memories = this.inMemoryStorage.memories.filter(
        (memory) => memory.id !== id,
      );
    } else if (this.db) {
      const stmt = this.db.prepare("DELETE FROM memories WHERE id = ?");
      stmt.run(id);
    }
  }

  clearOldConversations(olderThanDays: number = 7): void {
    if (this.isBrowser && this.inMemoryStorage) {
      const timestamp = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
      this.inMemoryStorage.conversations =
        this.inMemoryStorage.conversations.filter(
          (conv) => conv.timestamp >= timestamp,
        );
    } else if (this.db) {
      const timestamp = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
      const stmt = this.db.prepare(
        "DELETE FROM conversations WHERE timestamp < ?",
      );
      stmt.run(timestamp);
    }
  }

  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}

export const memoryService = new MemoryService();
