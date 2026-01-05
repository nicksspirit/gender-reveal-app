"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { deletePrediction } from "@/app/actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Prediction {
  id: string
  name: string
  email: string
  prediction: "boy" | "girl"
  created_at: string
}

interface PredictionsTableProps {
  initialPredictions: Prediction[]
}

export function PredictionsTable({ initialPredictions }: PredictionsTableProps) {
  const [predictions, setPredictions] = useState(initialPredictions)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const result = await deletePrediction(id)
      if (result.success) {
        setPredictions((prev) => prev.filter((p) => p.id !== id))
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to delete prediction")
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <div className="max-h-[600px] overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Name</TableHead>
              <TableHead className="font-semibold text-slate-700">Email</TableHead>
              <TableHead className="font-semibold text-slate-700">Prediction</TableHead>
              <TableHead className="font-semibold text-slate-700">Date</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-slate-600">
                  No predictions yet.
                </TableCell>
              </TableRow>
            ) : (
              predictions.map((prediction) => (
                <TableRow key={prediction.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-900">{prediction.name}</TableCell>
                  <TableCell className="text-slate-700">{prediction.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      prediction.prediction === 'boy' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-pink-100 text-pink-700 border border-pink-200'
                    }`}>
                      {prediction.prediction === 'boy' ? 'Boy 💙' : 'Girl 💗'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {format(new Date(prediction.created_at), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(prediction.id)}
                      disabled={deletingId === prediction.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                    >
                      {deletingId === prediction.id ? (
                        <span className="animate-spin text-xs">⏳</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="bg-slate-50 border-t p-3 text-xs text-slate-600 text-center">
        Showing {predictions.length} prediction{predictions.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
