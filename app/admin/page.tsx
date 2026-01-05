import { createClient } from "@/lib/supabase/server"
import { AdminForm } from "@/components/admin-form"

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch current reveal state
  const { data: revealState, error } = await supabase.from("reveal_state").select("*").single()

  if (error) {
    console.error("Error fetching reveal state:", error)
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
          <p className="text-slate-600 mb-8">Manage your gender reveal settings</p>

          <AdminForm
            initialDueDate={revealState?.countdown_date || new Date().toISOString()}
            initialGender={revealState?.gender || null}
            initialIsRevealed={revealState?.is_revealed || false}
          />
        </div>
      </div>
    </div>
  )
}
