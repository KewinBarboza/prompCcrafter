"use client"

import { ObjectiveSummaryExample } from "@/components/form/radio"
import { StepIndicator } from "@/components/step-indicator"
import { Button } from "@/components/ui/button"
import { defineStepper } from "@stepperize/react"
import { ArrowRightToLine, Copy, Loader2, MoveLeft, Save } from "lucide-react"
import Link from "next/link"
import { ChangeEvent, FormEventHandler, useState } from "react"
import { Text } from "@/components/text"
import { promptMaster } from "@/lib/prompt"
import { SkeletonList } from "@/components/skeleton-list"

const { useStepper, utils } = defineStepper({
  id: "step-1",
  title: "¿ Cuál es el objetivo o tarea principal que quieres que la IA realice ?",
  description: "Comienza por establecer claramente qué tarea fundamental quieres que la IA realice. Una meta bien definida es el primer paso hacia un prompt efectivo."
},
  {
    id: "step-2",
    title: "Proporciona el Contexto Esencial",
    description: "La IA necesita entender el 'quién', 'qué', 'dónde', 'cuándo' y 'porqué' de tu solicitud. Describe la situación, los antecedentes o cualquier dato relevante que la IA deba conocer para actuar con precisión."
  },
  {
    id: "step-3",
    title: "Selecciona un ejemplo de entrada y salida deseada",
    description: "Proporcionar ejemplos (técnica few-shot) es muy efectivo para guiar a la IA. Para clasificación, mezcla las clases en los ejemplos."
  },
  {
    id: "step-4",
    title: "¿En qué formato deseas recibir la respuesta?",
    description: "Especificar el formato ayuda a obtener resultados estructurados."
  },
  {
    id: "step-5",
    title: "¿Qué estilo, tono o rol debe adoptar el modelo al generar la respuesta?",
    description: "Define la 'voz' de la IA. ¿Debe sonar formal, amigable, técnica o quizás humorística? El tono correcto conecta mejor con tu audiencia y el propósito del mensaje"
  },
  {
    id: "step-6",
    title: "¿Qué configuraciones o restricciones adicionales quieres aplicar?",
    description: "Estos parámetros controlan la 'creatividad' (temperatura) y la longitud (tokens) de la respuesta. Ajústalos para casos de uso específicos o déjalos en sus valores predeterminados para un balance general."
  })

// Utilidad para sincronizar radio y textarea
export function handleRadioToTextarea(e: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = e.target
  // Busca el textarea relacionado por name
  const textarea = document.querySelector(`textarea[name='${name}']`) as HTMLTextAreaElement
  if (textarea) {
    textarea.value = value
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

export default function CreatedPrompt() {
  const methods = useStepper()
  const [prompts, setPrompts] = useState<{ name: string, prompt: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [suggestions, setSuggestions] = useState({
    context: [],
    inputOutput: [],
    format: [],
    style: [],
    tokenRange: 0,
    tempRange: 0
  })

  const [formData, setFormData] = useState({
    objective: "",
    context: "",
    inputOutput: "",
    format: "",
    style: "",
    tokenRange: 0,
    tempRange: 0
  })

  const currentIndex = utils.getIndex(methods.current.id)

  const getDataPrompt = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsComplete(true)
    setIsLoading(true)

    const prompt = promptMaster(formData)

    setPrompts([])
    fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: prompt,
    }).then((res) => res.json())
      .then((data) => {
        setPrompts(data.prompt)
      }).catch((error) => {
        console.error("Error:", error)
        setIsComplete(false)
        setPrompts([])
      }).finally(() => {
        setIsLoading(false)
      })
  }

  const createSuggestion = () => {
    methods.next()

    if (currentIndex === 4) return

    setIsLoading(true)

    let question = ""

    // Paso 0: Contexto
    if (currentIndex === 0) {
      question = `
Actúa como experto en prompts para IA.
Dados:
- Objetivo: ${formData.objective}
Genera 4 ejemplos en JSON (sin explicaciones) que enriquezcan el contexto. Según el objetivo para ayudar a completar el prompt para mejorar el contexto.
Cada objeto debe tener:
  • "name": 2-3 palabras
  • "suggestion": ≤100 caracteres
Formato:
[
  {"name":"Título Breve","suggestion":"Texto conciso..."},
  …
]`.trim()
    }

    // Paso 1: Entrada y salida
    if (currentIndex === 1) {
      question = `
Actúa como experto en prompts para IA.
Dados:
- Objetivo: ${formData.objective}
- Contexto: ${formData.context}
Proporciona ejemplos para mejorar la sección de entrada y salida del prompt 4 pares entrada/salida en JSON (sin explicaciones).
Cada objeto debe tener:
  • "name": 2-3 palabras
  • "suggestion": ≤100 caracteres, formato "Entrada:…; Salida:…"
Formato:
[
  {"name":"Título Breve","suggestion":"Entrada:…; Salida:…"},
  …
]`.trim()
    }

    // Paso 2: Formato de salida
    if (currentIndex === 2) {
      question = `
Actúa como experto en prompts para IA.
Dados:
- Objetivo: ${formData.objective}
- Contexto: ${formData.context}
Genera 4 ejemplos según el contexto para mejorar el formato de salida de formato de salida en JSON (sin explicaciones).
Cada objeto debe tener:
  • "name": 2-3 palabras
  • "suggestion": ≤100 caracteres
Formato:
[
  {"name":"Título Breve","suggestion":"Texto conciso..."},
  …
]`.trim()
    }

    // Paso 3: Estilo y tono
    if (currentIndex === 3) {
      question = `
Actúa como experto en prompts para IA.
Dados:
- Objetivo: ${formData.objective}
- Contexto: ${formData.context}
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

    fetch("/api/suggestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: question,
    }).then((res) => res.json())
      .then((data) => {
        if (currentIndex === 0) {
          setSuggestions((prev) => ({
            ...prev,
            context: data.suggestions
          }))
        }
        if (currentIndex === 1) {
          setSuggestions((prev) => ({
            ...prev,
            inputOutput: data.suggestions
          }))
        }
        if (currentIndex === 2) {
          setSuggestions((prev) => ({
            ...prev,
            format: data.suggestions
          }))
        }
        if (currentIndex === 3) {
          setSuggestions((prev) => ({
            ...prev,
            style: data.suggestions
          }))
        }
      }).catch((error) => {
        console.error("Error:", error)


      }).finally(() => {
        setIsLoading(false)
      })
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "settings") {
      const [tokens, tempValue] = value.split("-").map(Number)
      setFormData((prev) => ({
        ...prev,
        tokenRange: tokens,
        tempRange: tempValue
      }))
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <section className="h-dvh w-dvw grid grid-rows-10 justify-center">
        <div className="min-w-4xl flex items-end w-full row-span-1">
          <Button size="lg" variant="link" asChild>
            <Link href='/'><MoveLeft />Volver atrás</Link>
          </Button>
        </div>
        {isComplete === false ? (
          <>
            <div className="py-6 max-w-4xl flex justify-center items-center w-full row-span-2">
              <div className="gap-2 items-center flex flex-col">
                <StepIndicator
                  currentStep={currentIndex + 1}
                  totalSteps={methods.all.length}
                />
                <div className="flex flex-col justify-center items-center mt-4">
                  <Text text={methods.current.title} />
                  <p className="text-lg text-muted-foreground text-center">
                    {methods.current.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="max-w-4xl flex flex-col relative row-span-7">
              <form className="max-w-fit" onSubmit={getDataPrompt}>
                {methods.when("step-1", () => <Task handleChange={handleChange} />)}
                {methods.when("step-2", () => <Context handleChange={handleChange} suggestions={suggestions.context} isLoading={isLoading} />)}
                {methods.when("step-3", () => <InputOutput handleChange={handleChange} suggestions={suggestions.inputOutput} isLoading={isLoading} />)}
                {methods.when("step-4", () => <FormatExit handleChange={handleChange} suggestions={suggestions.format} isLoading={isLoading} />)}
                {methods.when("step-5", () => <StyleAndTone handleChange={handleChange} suggestions={suggestions.style} isLoading={isLoading} />)}
                {methods.when("step-6", () => <Settings handleChange={handleChange} />)}

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-200">
                  {
                    methods.isLast === false ? (
                      <div className="flex justify-between w-full">
                        <Button
                          variant="secondary"
                          onClick={methods.prev}
                          disabled={methods.isFirst}
                          size="lg"
                        >
                          Anterior
                        </Button>
                        <Button onClick={createSuggestion} size="lg">
                          {methods.isLast ? 'Crear prompt' : 'Siguiente'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end w-full">
                        <Button type="submit" size="lg">Crear prompt</Button>
                      </div>
                    )
                  }
                </div>
              </form>
            </div>
          </>
        ) : (
          isLoading ? (
            <div className="max-w-4xl flex flex-col py-28 my-20">
              <div className="flex justify-center items-center w-full">
                <Loader2 className="animate-spin" />
              </div>
            </div>) : (<div className="max-w-4xl flex flex-col"><Complete prompts={prompts} /></div>)
        )}

      </section>
    </>
  )
}

const Task = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  return (
    <div>
      <textarea
        onInput={handleChange}
        name="objective"
        rows={3} required
        className="w-full min-w-4xl px-4 py-2 border border-neutral-200 rounded-3xl p-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary field-sizing-content"
        placeholder="Ej: Redactar un email de seguimiento a un cliente."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">Sugerencias</span>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            name="objective"
            value="Resume un texto explicando solo los puntos clave sin agregar opiniones personales."
            label="Resumen objetivo"
            description="Resume un texto sin agregar opiniones, manteniendo claridad."
            handleRadioToTextarea={handleRadioToTextarea}
          />
          <ObjectiveSummaryExample
            name="objective"
            value="Clasifica reseñas en positivas, negativas o neutrales y explica brevemente por qué."
            label="Clasificación de sentimiento"
            description="Categoriza y justifica reseñas de usuarios."
            handleRadioToTextarea={handleRadioToTextarea}
          />
          <ObjectiveSummaryExample
            name="objective"
            value="Genera una función en Python documentada y con prueba unitaria que invierta una cadena."
            label="Código con test"
            description="Crear función funcional y bien documentada."
            handleRadioToTextarea={handleRadioToTextarea}
          />
          <ObjectiveSummaryExample
            name="objective"
            value="Crea una tabla con los principales indicadores de rendimiento de marketing y sus metas."
            label="Tabla de KPIs"
            description="Representar KPIs con claridad en formato tabular."
            handleRadioToTextarea={handleRadioToTextarea}
          />
        </div>
      </div>
    </div>
  )
}

const Context = ({
  handleChange,
  suggestions,
  isLoading
}: {
  handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement>
  suggestions: { name: string; suggestion: string }[]
  isLoading: boolean
}) => {
  return (
    <div>
      <textarea
        name="context"
        onInput={handleChange}
        rows={3} required
        className="w-full min-w-4xl px-4 py-2 border border-neutral-200 rounded-3xl p-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary field-sizing-content"
        placeholder="Ej: El cliente 'Tech Solutions Inc.' asistió a nuestro webinar sobre 'IA en Marketing' la semana pasada y expresó interés en nuestro producto 'AnalyticPro'. El objetivo del email es agendar una demo."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7 p-2">
          {isLoading ? (
            <SkeletonList />
          ) : (
            suggestions.map((suggestion, index) => (
              <ObjectiveSummaryExample
                key={index}
                handleRadioToTextarea={handleRadioToTextarea}
                name="context"
                value={suggestion.suggestion}
                label={suggestion.name}
                description={suggestion.suggestion}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const InputOutput = ({
  handleChange,
  suggestions,
  isLoading
}: {
  handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement>
  suggestions: { name: string; suggestion: string }[]
  isLoading: boolean
}) => {
  return (
    <div>
      <textarea
        name="inputOutput" rows={3} required
        onInput={handleChange}
        className="w-full min-w-4xl px-4 py-2 border border-neutral-200 rounded-3xl p-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary field-sizing-content"
        placeholder="Ej: \nEntrada: Traduce 'Hola Mundo' al francés.\nSalida: Bonjour le monde.\n\nEntrada: Cliente pregunta por el estado de su pedido #123.\nSalida: Estimado cliente, su pedido #123 ha sido enviado..."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7">
          {isLoading ? (
            <SkeletonList />
          ) : (
            suggestions.map((suggestion, index) => (
              <ObjectiveSummaryExample
                key={index}
                handleRadioToTextarea={handleRadioToTextarea}
                name="inputOutput"
                value={suggestion.suggestion}
                label={suggestion.name}
                description={suggestion.suggestion}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const FormatExit = ({
  handleChange,
  suggestions,
  isLoading
}: {
  handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement>
  suggestions: { name: string; suggestion: string }[]
  isLoading: boolean
}) => {
  return (
    <div>
      <textarea
        name="format"
        rows={3} required
        onInput={handleChange}
        className="w-full min-w-4xl px-4 py-2 border border-neutral-200 rounded-3xl p-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary field-sizing-content"
        placeholder="Ej: JSON, Lista, Párrafo, Código"></textarea>
      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">Seleccione el formato en el que desea recibir la respuesta</span>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7">
          {isLoading ? (
            <SkeletonList />
          ) : (
            suggestions.map((suggestion, index) => (
              <ObjectiveSummaryExample
                key={index}
                handleRadioToTextarea={handleRadioToTextarea}
                name="format"
                value={suggestion.suggestion}
                label={suggestion.name}
                description={suggestion.suggestion}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const StyleAndTone = ({
  handleChange,
  suggestions,
  isLoading
}: {
  handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement>
  suggestions: { name: string; suggestion: string }[]
  isLoading: boolean
}) => {
  return (
    <div>
      <textarea
        onInput={handleChange}
        name="style" rows={3} required
        className="w-full min-w-4xl px-4 py-2 border border-neutral-200 rounded-3xl p-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary field-sizing-content"
        placeholder="Especifica otro estilo..."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          {isLoading ? (
            <SkeletonList />
          ) : (
            suggestions.map((suggestion, index) => (
              <ObjectiveSummaryExample
                key={index}
                handleRadioToTextarea={handleRadioToTextarea}
                name="style"
                value={suggestion.suggestion}
                label={suggestion.name}
                description={suggestion.suggestion}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const Settings = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  const [token, setToken] = useState(100)
  const [temp, setTemp] = useState(0.7)

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "settings") {
      handleChange(e)
      const [tokens, tempValue] = value.split("-").map(Number)
      setToken(tokens)
      setTemp(tempValue)
    }

    if (name === "tokenRange") setToken(Number(value))
    if (name === "tempRange") setTemp(Number(value))
  }

  const handlePreset = (e: ChangeEvent<HTMLInputElement>) => {
    handleSliderChange(e)
    handleChange(e)
  }

  return (
    <div>
      <div className="mt-4 p-6 rounded-3xl border border-neutral-200">
        <label htmlFor="tokenRange" className="block text-sm font-medium text-gray-700">
          Número máximo de tokens:{" "}
          <span id="tokenValue" className="font-semibold">{token}</span>
        </label>
        <input
          type="range"
          id="tokenRange"
          name="tokenRange"
          min="10"
          max="500"
          step="10"
          value={token}
          className="w-full accent-primary"
          onChange={handleSliderChange}
          onInput={handleChange}
        />
      </div>
      <div className="mt-4  p-6 rounded-3xl border border-neutral-200">
        <label htmlFor="tempRange" className="block text-sm font-medium text-gray-700">
          Temperatura:{" "}
          <span id="tempValue" className="font-semibold">{temp}</span>
        </label>
        <input
          type="range"
          id="tempRange"
          name="tempRange"
          min="0"
          max="1"
          step="0.01"
          value={temp}
          className="w-full accent-primary"
          onChange={handleSliderChange}
          onInput={handleChange}
        />
      </div>

      <div className="mt-4 space-y-2">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            name="settings"
            value="100-0.7"
            label="Tokens máximo: 100, Temperatura: 0.7"
            description="Conciso y creativo moderado."
            handleRadioToTextarea={(e) => handlePreset(e)}
          />
          <ObjectiveSummaryExample
            name="settings"
            value="200-0.3"
            label="Tokens máximo: 200, Temperatura: 0.3"
            description="Más largo y preciso, menos creativo."
            handleRadioToTextarea={(e) => handlePreset(e)}
          />
          <ObjectiveSummaryExample
            name="settings"
            value="50-1.0"
            label="Tokens máximo: 50, Temperatura: 1.0"
            description="Muy creativo, posible incoherencia."
            handleRadioToTextarea={(e) => handlePreset(e)}
          />
        </div>
      </div>
    </div>
  )
}

const Complete = ({ prompts }: { prompts: { name: string, prompt: string }[] }) => {
  const [btnText, setBtnText] = useState("Copiar")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setBtnText("Texto copiado")
        setTimeout(() => {
          setBtnText("Copiar")
        }, 2000)
      })
      .catch((err) => {
        console.error("Error al copiar el texto: ", err)
      })
  }

  if (prompts.length === 0) {
    return (
      <div className="flex justify-center items-center w-full">
        <p className="text-lg text-gray-500">No se encontraron resultados.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mt-4 space-y-2">
        {prompts.map((prompt, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <p className="text-xl">{prompt.name}</p>
            <p className="text-2xl text-gray-500">{prompt.prompt}</p>

            <div className="flex justify-end gap-x-2 mt-5">
              <Button variant="outline" onClick={() => copyToClipboard(prompt.prompt)}>
                <Copy />
                {btnText}
              </Button>

              <Button asChild variant="default">
                <Link href={`/prompt/?prompt=${encodeURIComponent(prompt.prompt)}&edit=true&name=${encodeURIComponent(prompt.name)}`}>
                  <Save />
                  Editar prompt
                </Link>

              </Button>

              <Button asChild variant="default">
                <Link href={`https://chat.openai.com/?prompt=${encodeURIComponent(prompt.prompt)}`} target="_blank" rel="noopener noreferrer">
                  <ArrowRightToLine />
                  Ir a ChatGpt
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
