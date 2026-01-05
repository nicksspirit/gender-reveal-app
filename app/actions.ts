"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateRevealSettings(
  dueDate: string,
  gender: "boy" | "girl" | null,
  isRevealed: boolean
) {
  // Use a service-role client on the server so updates aren't blocked by RLS
  const supabase = createAdminClient()

  // Fetch the single row ID (assuming only one row exists)
  const { data: existingData, error: fetchError } = await supabase
    .from("reveal_state")
    .select("id")
    .single()

  if (fetchError || !existingData || !existingData.id) {
    console.error("Error fetching reveal state ID:", fetchError)
    return { success: false, message: "Failed to fetch current settings." }
  }

  // Perform update and request the updated row back so we can verify the change
  const { data: updatedData, error: updateError } = await supabase
    .from("reveal_state")
    .update({
      countdown_date: new Date(dueDate).toISOString(),
      gender,
      is_revealed: isRevealed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingData.id)
    .select()
    .single()

  if (updateError || !updatedData) {
    console.error("Error updating reveal state:", updateError)
    return { success: false, message: "Failed to save changes." }
  }

  // Revalidate paths to ensure fresh data on next fetch
  revalidatePath("/admin")
  revalidatePath("/")

  return { success: true, message: "Settings saved successfully!" }
}

export async function deletePrediction(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("predictions")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting prediction:", error)
    return { success: false, message: "Failed to delete prediction." }
  }

  revalidatePath("/admin")
  revalidatePath("/")

  return { success: true, message: "Prediction deleted successfully." }
}

export async function addRegistry(name: string, url: string) {
  const supabase = createAdminClient()

  // Ensure URL has protocol
  let formattedUrl = url
  if (!/^https?:\/\//i.test(url)) {
    formattedUrl = `https://${url}`
  }

  const { error } = await supabase
    .from("registries")
    .insert({ name, url: formattedUrl })

  if (error) {
    console.error("Error adding registry:", error)
    return { success: false, message: "Failed to add registry." }
  }

  revalidatePath("/admin")
  revalidatePath("/")

  return { success: true, message: "Registry added successfully!" }
}

export async function deleteRegistry(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("registries")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting registry:", error)
    return { success: false, message: "Failed to delete registry." }
  }

  revalidatePath("/admin")
  revalidatePath("/")

  return { success: true, message: "Registry deleted successfully." }
}

export async function getPredictionByEmail(email: string) {
  const supabase = await createClient()
  const normalizedEmail = email.trim().toLowerCase()

  const { data, error } = await supabase
    .from("predictions")
    .select("id, name, email, prediction, created_at")
    .eq("email", normalizedEmail)
    .maybeSingle()

  if (error) {
    console.error("Error fetching prediction by email:", error)
    return { success: false, data: null }
  }

  return { success: true, data }
}

export async function submitPrediction(
  name: string,
  email: string,
  prediction: "boy" | "girl"
) {
  const supabase = await createClient()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName = name.trim()

  const { data, error } = await supabase
    .from("predictions")
    .insert({
      name: normalizedName,
      email: normalizedEmail,
      prediction,
    })
    .select("id, name, email, prediction, created_at")
    .single()

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "EMAIL_EXISTS" as const }
    }
    console.error("Error submitting prediction:", error)
    return { success: false, error: "UNKNOWN" as const }
  }

  return { success: true, data }
}

export async function getPredictionStats() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("predictions")
    .select("prediction")

  if (error) {
    console.error("Error fetching prediction stats:", error)
    return { success: false, data: null }
  }

  const boy = data.filter((row) => row.prediction === "boy").length
  const girl = data.filter((row) => row.prediction === "girl").length
  const total = boy + girl

  return { success: true, data: { boy, girl, total } }
}
