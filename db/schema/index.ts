import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Categories table - main layers of the Bitcoin ecosystem
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Ecosystems table - major platforms or protocols within a category
export const ecosystems = pgTable("ecosystems", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logoUrl: text("logo_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Projects table - individual applications built on an ecosystem
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  ecosystemId: uuid("ecosystem_id")
    .references(() => ecosystems.id)
    .notNull(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  description: text("description"),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Subscriptions table - manages user payment status with Stripe
export const subscriptions = pgTable("subscriptions", {
  userId: text("user_id").primaryKey(), // FK to Clerk users.id
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  status: text("status").notNull(), // e.g., "active", "canceled"
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  ecosystems: many(ecosystems)
}))

export const ecosystemsRelations = relations(ecosystems, ({ one, many }) => ({
  category: one(categories, {
    fields: [ecosystems.categoryId],
    references: [categories.id]
  }),
  projects: many(projects)
}))

export const projectsRelations = relations(projects, ({ one }) => ({
  ecosystem: one(ecosystems, {
    fields: [projects.ecosystemId],
    references: [ecosystems.id]
  })
}))

// Type exports
export type InsertCategory = typeof categories.$inferInsert
export type SelectCategory = typeof categories.$inferSelect

export type InsertEcosystem = typeof ecosystems.$inferInsert
export type SelectEcosystem = typeof ecosystems.$inferSelect

export type InsertProject = typeof projects.$inferInsert
export type SelectProject = typeof projects.$inferSelect

export type InsertSubscription = typeof subscriptions.$inferInsert
export type SelectSubscription = typeof subscriptions.$inferSelect
