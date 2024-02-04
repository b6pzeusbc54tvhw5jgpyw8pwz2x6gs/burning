import { useEffect } from "react"
import { toast } from "react-toastify"

export const useErrorToast = (error: Error | null) => {
  useEffect(() => {
    if (!error) return

    toast.error(error.message)
  }, [error])
}
