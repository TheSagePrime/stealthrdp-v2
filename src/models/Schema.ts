import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Generic persistence example for public websites and free tools.
// Child projects should replace this table with their real content/tool data.
export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
