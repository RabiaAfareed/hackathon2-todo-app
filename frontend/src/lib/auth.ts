// frontend\src\lib\auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
        // Connection pool settings
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    advanced: {
        cookiePrefix: "better-auth",
    },
    // Map table names if they differ from default Better Auth naming
    modelName: {
        user: "user",
        session: "session",
        account: "account",
        verification: "verification"
    },
    // Map database column names (camelCase)
    field: {
        user: {
            id: "id",
            name: "name",
            email: "email",
            emailVerified: "emailVerified",
            image: "image",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
        session: {
            id: "id",
            userId: "userId",
            token: "token",
            expiresAt: "expiresAt",
            ipAddress: "ipAddress",
            userAgent: "userAgent",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
        account: {
            id: "id",
            userId: "userId",
            accountId: "accountId",
            providerId: "providerId",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
            idToken: "idToken",
            expiresAt: "expiresAt",
            password: "password",
            scope: "scope",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
        verification: {
            id: "id",
            identifier: "identifier",
            value: "value",
            expiresAt: "expiresAt",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        }
    }
});
