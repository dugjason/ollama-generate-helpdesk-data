import { z } from "zod"

/**
 * Schema for the helpdesk messages.
 */
export const helpdeskMessageSchema = z.object({
  text: z.string().min(100).max(750).describe("The email body"),
  subject: z.string().min(10).max(100).describe("The email subject"),
})

export type HelpdeskMessage = z.infer<typeof helpdeskMessageSchema>
