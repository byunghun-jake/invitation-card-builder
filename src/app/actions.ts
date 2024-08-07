"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { revalidateTag } from "next/cache";

export const getSupabaseUser = async (): Promise<User | null> => {
  "use server";

  const supabase = createClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    await supabase.auth.signOut();
    return null;
  }

  return user;
};

export const customRevalidateTag = async (tag: string) => {
  "use server";

  revalidateTag(tag);
};
