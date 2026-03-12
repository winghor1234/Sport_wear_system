import { sendError } from "./response"

export function handleError(error: unknown) {
  console.error(error)
  if (error instanceof Error && error.name === "ZodError") {
    return sendError("Validation failed", 400)
  }
  return sendError("Internal Server Error", 500)
}