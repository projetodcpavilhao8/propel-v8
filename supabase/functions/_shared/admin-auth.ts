import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Valida o JWT do Supabase Auth enviado em "Authorization: Bearer <token>" e
// exige app_metadata.role === "admin" (só editável via service role / SQL).
export async function isAdminRequest(req: Request): Promise<boolean> {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return false;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return false;
  return data.user.app_metadata?.role === "admin";
}
