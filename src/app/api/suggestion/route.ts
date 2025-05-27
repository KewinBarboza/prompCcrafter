import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import z from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const text = await req.text()

  if (!text) return new Response('Prompt is required', { status: 400 })

  const result = generateObject({
    model: google('gemini-2.0-flash'),
    schema: z.object({
      suggestions: z.array(
        z.object({
          name: z.string(),
          suggestion: z.string(),
        })
      )
    }),
    prompt: ` ${text}`,
    output: 'object'
  })

  return (await result).toJsonResponse()
}
