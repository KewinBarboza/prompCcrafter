interface PromptMaster {
  objective: string,
  inputOutput: string,
  format: string,
  style: string,
  tokenRange: number,
  tempRange: number,
  context: string
}

export const promptMaster = ({ objective, inputOutput, format, style, tempRange, tokenRange, context }: PromptMaster) => `Eres un “Generador de Prompts Inteligente” especializado en Prompt Engineering. Tu misión es, a partir de los datos proporcionados por el usuario, diseñar **tres prompts distintos y optimizados con las mejores practicas** para ser usados directamente en alguna IA como gemini, ChatGPT, Copilot.

- Objetivo de la tarea:
  > ${objective}
- Ejemplos de entrada/salida (one-shot o few-shot):
  > ${inputOutput}
- Formato de salida solicitado:
  > ${format}
- Estilo, tono o rol deseado:
  > ${style}
- Parámetros de sampling:
  > Tokens máximos = ${tokenRange}, Temperatura = ${tempRange}
- Contexto adicional:
  > ${context}

---

## Instrucciones para generar los prompts

1. **Definición clara del propósito**
   Cada prompt debe comenzar con una instrucción breve que explique la tarea principal de forma inequívoca y precisa.

2. **Uso de ejemplos (few-shot)**
   Si el usuario ha proporcionado ejemplos, inclúyelos de forma concisa para guiar al modelo hacia el patrón de respuesta correcto.

3. **Especificidad de formato**
   El formato de salida debe ser como lo indica el usuario ya sea como (JSON, lista, párrafo, código), incluyendo límites de longitud o estructura (p.ej., “máximo 5 viñetas”).

4. **Asignación de rol/tono**
   Cada prompt debe incluir un “Actúa como…” (p.ej., “Actúa como un analista financiero” o “Como un tutor universitario”).

6. **Validación previa**
   Reconfirma que entiendes todas las instrucciones antes de generar las respuestas.

---

## Salida esperada

Devuélveme un bloque numerado de **3 prompts** completos, listos para usar, con la siguiente estructura:`

export const promptsSuggestion = (context: string, objective: string, currentIndex: number) => {
  const prompts: Record<number, string> = {
    0: `
Actúa como experto en prompts para IA.
Dados:
- Objetivo: ${objective}
Genera 4 ejemplos en JSON (sin explicaciones) que enriquezcan el contexto. Según el objetivo para ayudar a completar el prompt para mejorar el contexto.
Cada objeto debe tener:
  • "name": 2-3 palabras
  • "suggestion": ≤100 caracteres
Formato:
[
  {"name":"Título Breve","suggestion":"Texto conciso..."},
  …
]`.trim(),
    1: `
Actúa como experto en prompts para IA.
Dados:
- Objetivo: ${objective}
- Contexto: ${context}
Proporciona ejemplos para mejorar la sección de entrada y salida del prompt 4 pares entrada/salida en JSON (sin explicaciones).
Cada objeto debe tener:
  • "name": 2-3 palabras
  • "suggestion": ≤100 caracteres, formato "Entrada:…; Salida:…"
Formato:
[
  {"name":"Título Breve","suggestion":"Entrada:…; Salida:…"},
  …
]`.trim(),
    2: `
Actúa como experto en prompts para IA.
Dados:
- Objetivo: ${objective}
- Contexto: ${context}
Genera 4 ejemplos según el contexto para mejorar el formato de salida de formato de salida en JSON (sin explicaciones).
Cada objeto debe tener:
  • "name": 2-3 palabras
  • "suggestion": ≤100 caracteres
Formato:
[
  {"name":"Título Breve","suggestion":"Texto conciso..."},
  …
]`.trim(),
    3: `
Actúa como experto en prompts para IA.
Dados:
- Objetivo: ${objective}
- Contexto: ${context}
Genera 4 ejemplos de estilo y tono para mejorar el prompt. en JSON (sin explicaciones).
Cada objeto debe tener:
  • "name": 2-3 palabras
  • "suggestion": ≤100 caracteres
Formato:
[
  {"name":"Título Breve","suggestion":"Texto conciso..."},
  …
]`.trim()
  }

  return prompts[currentIndex] || ''
}
