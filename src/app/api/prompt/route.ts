import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import z from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const prompt = await req.text()
  if (!prompt) {
    return new Response('Prompt is required', { status: 400 })
  }

  const result = generateObject({
    model: google('gemini-2.0-flash'),
    schema: z.object({
      prompt: z.array(
        z.object({
          name: z.string(),
          prompt: z.string(),
        })
      )
    }),
    prompt: prompt,
    output: 'object'
  })

  return (await result).toJsonResponse()
}
