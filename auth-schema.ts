import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
			
export const user = pgTable("user", {
					id: text("id").primaryKey(),
					name: text('name').notNull(),
 email: text('email').notNull().unique(),
 emailVerified: boolean('emailVerified').notNull(),
 image: text('image'),
 createdAt: timestamp('createdAt').notNull(),
 updatedAt: timestamp('updatedAt').notNull(),
 role: text('role'),
 banned: boolean('banned'),
 banReason: text('banReason'),
 banExpires: timestamp('banExpires')
				});

export const session = pgTable("session", {
					id: text("id").primaryKey(),
					expiresAt: timestamp('expiresAt').notNull(),
 ipAddress: text('ipAddress'),
 userAgent: text('userAgent'),
 userId: text('userId').notNull().references(()=> user.id),
 impersonatedBy: text('impersonatedBy')
				});

export const account = pgTable("account", {
					id: text("id").primaryKey(),
					accountId: text('accountId').notNull(),
 providerId: text('providerId').notNull(),
 userId: text('userId').notNull().references(()=> user.id),
 accessToken: text('accessToken'),
 refreshToken: text('refreshToken'),
 idToken: text('idToken'),
 expiresAt: timestamp('expiresAt'),
 password: text('password')
				});

export const verification = pgTable("verification", {
					id: text("id").primaryKey(),
					identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: timestamp('expiresAt').notNull()
				});