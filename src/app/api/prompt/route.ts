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

  try {
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
      system: 'Eres un experto en prompts para IA. Tu tarea es generar prompts de alta calidad que ayuden a los usuarios a obtener mejores resultados de los modelos de IA. los prompts deben estar en español, ser claros y directos, y seguir las mejores prácticas de diseño para que sean efectivos y fáciles de entender a la ia lo que tiene que hacer.',
      prompt: prompt,
      output: 'object'
    })

    return (await result).toJsonResponse()
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
