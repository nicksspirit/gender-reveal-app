"use server"

import { cookies } from "next/headers"

import { createAdminClient } from "@/lib/supabase/admin"

interface AdminAuthState {
  ok: boolean
  message?: string
}

export async function verifyAdminPassword(_: AdminAuthState, formData: FormData): Promise<AdminAuthState> {
  const password = formData.get("password")

  if (typeof password !== "string" || password.trim().length === 0) {
    return { ok: false, message: "Password is required." }
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc("verify_admin_password", { input_password: password })

  if (error) {
    console.error("Error verifying admin password:", error)
    return { ok: false, message: "Unable to verify password. Please try again." }
  }

  if (data !== true) {
    return { ok: false, message: "Incorrect password. Please try again." }
  }

  const cookieStore = await cookies()
  cookieStore.set("admin_auth", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
  })

  return { ok: true }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.set("admin_auth", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  })
}
