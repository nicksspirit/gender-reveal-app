"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Gift } from "lucide-react"
import { addRegistry, deleteRegistry } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Registry {
  id: string
  name: string
  url: string
}

interface RegistryManagerProps {
  initialRegistries: Registry[]
}

export function RegistryManager({ initialRegistries }: RegistryManagerProps) {
  const router = useRouter()
  // We keep local state for optimistic deletions, but rely on router.refresh for additions (to get the ID)
  // Actually, for consistency, let's just rely on router.refresh() for both updates 
  // but optimistic UI makes delete feel faster.
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !url.trim()) return

    setIsSubmitting(true)
    try {
      const result = await addRegistry(name, url)
      if (result.success) {
        toast.success(result.message)
        setName("")
        setUrl("")
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to add registry")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      // Optimistic update
      toast.promise(
        async () => {
          const result = await deleteRegistry(id)
          if (!result.success) throw new Error(result.message)
          router.refresh()
        },
        {
          loading: 'Deleting...',
          success: 'Registry deleted',
          error: 'Failed to delete registry',
        }
      )
    } catch (error) {
      // Error handled by toast.promise
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Gift className="w-4 h-4" /> Add New Registry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reg-name">Store Name</Label>
            <Input 
              id="reg-name" 
              placeholder="e.g. Amazon, Target" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-url">Link URL</Label>
            <Input 
              id="reg-url" 
              placeholder="https://..." 
              value={url} 
              onChange={e => setUrl(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
        <Button disabled={isSubmitting} type="submit" className="w-full md:w-auto">
          {isSubmitting ? "Adding..." : <><Plus className="w-4 h-4 mr-2" /> Add Registry</>}
        </Button>
      </form>

      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900">Active Registries</h3>
        {initialRegistries.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No registries added yet.</p>
        ) : (
          <div className="space-y-2">
            {initialRegistries.map(reg => (
              <div key={reg.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium text-slate-900">{reg.name}</span>
                  <a href={reg.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[200px] sm:max-w-xs">
                    {reg.url}
                  </a>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(reg.id)}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
