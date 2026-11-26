import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Call at the top of every admin page AND every admin server action.
 * Middleware guards page navigation, but server actions are plain POST
 * endpoints, so each one must check the session itself.
 */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
