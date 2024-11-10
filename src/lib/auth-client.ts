import { createAuthClient } from "better-auth/react";
import { adminClient} from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_BETTER_AUTH_URL!,
  plugins: [
    adminClient()
  ]
});
