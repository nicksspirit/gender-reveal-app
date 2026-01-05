"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"

import { verifyAdminPassword } from "@/app/admin/actions"

const initialState = { ok: false, message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Checking..." : "Unlock Admin"}
    </button>
  )
}

export function AdminPasswordGate() {
  const [state, formAction] = useActionState(verifyAdminPassword, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.ok) {
      router.refresh()
    }
  }, [state.ok, router])

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h1>
        <p className="text-slate-700 mb-6">Enter the password to continue.</p>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-semibold text-slate-900">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-600 focus:border-slate-500 focus:outline-none"
              placeholder="Enter admin password"
              aria-invalid={Boolean(state.message)}
              aria-describedby={state.message ? "admin-password-error" : undefined}
              autoComplete="current-password"
              required
            />
            {state.message ? (
              <p id="admin-password-error" className="text-sm text-red-600 font-medium">
                {state.message}
              </p>
            ) : null}
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
