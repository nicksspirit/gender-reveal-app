import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"
import { logoutAdmin } from "@/app/admin/actions"
import { AdminForm } from "@/components/admin-form"
import { PredictionsTable } from "@/components/predictions-table"
import { RegistryManager } from "@/components/registry-manager"
import { AdminPasswordGate } from "@/components/admin-password-gate"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true"

  if (!isAuthenticated) {
    return <AdminPasswordGate />
  }

  const supabase = await createClient()

  // Small helper to avoid noisy logs when Supabase returns empty error objects
  const logIfUseful = (label: string, err: unknown) => {
    if (!err) return

    try {
      if (typeof err === "object" && err !== null) {
        const keys = Object.keys(err as Record<string, unknown>)
        const hasMessage = Boolean((err as any)?.message || (err as any)?.msg || (err as any)?.statusText)
        if (keys.length === 0 && !hasMessage) return
      }
    } catch {
      // ignore and fall through to logging
    }

    console.error(label, err)
  }

  // Fetch current reveal state
  const { data: revealState, error } = await supabase.from("reveal_state").select("*").single()

  logIfUseful("Error fetching reveal state:", error)

  // Fetch registries
  const { data: registries, error: registriesError } = await supabase
    .from("registries")
    .select("*")
    .order("created_at", { ascending: true })

  logIfUseful("Error fetching registries:", registriesError)

  // Fetch predictions
  const { data: predictions, error: predictionsError } = await supabase
    .from("predictions")
    .select("*")
    .order("created_at", { ascending: false })

  logIfUseful("Error fetching predictions:", predictionsError)

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
              <p className="text-slate-700">Manage your gender reveal settings</p>
            </div>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="w-full sm:w-auto bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Log out
              </button>
            </form>
          </div>

          <div className="mt-8">
            <AdminForm
            initialDueDate={revealState?.countdown_date || new Date().toISOString()}
            initialGender={revealState?.gender || null}
            initialIsRevealed={revealState?.is_revealed || false}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Gift Registries</h2>
          <RegistryManager initialRegistries={registries || []} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Guest Predictions ({predictions?.length || 0})</h2>
          <PredictionsTable initialPredictions={predictions || []} />
        </div>
      </div>
    </div>
  )
}
