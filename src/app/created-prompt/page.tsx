"use client"

import { StepIndicator } from "@/components/step-indicator"
import { Button } from "@/components/ui/button"
import { defineStepper } from "@stepperize/react"
import { Loader2, MoveLeft } from "lucide-react"
import Link from "next/link"
import { ChangeEvent, useState } from "react"
import { Text } from "@/components/text"
import { promptMaster, promptsSuggestion } from "@/lib/prompt"
import { Task } from "@/components/form_created_prompt/task"
import { Context } from "@/components/form_created_prompt/context"
import { InputOutput } from "@/components/form_created_prompt/input-output"
import { FormatExit } from "@/components/form_created_prompt/format-exit"
import { Complete } from "@/components/form_created_prompt/complete"
import { StyleAndTone } from "@/components/form_created_prompt/style-and-tone"
import { Settings } from "@/components/form_created_prompt/settings"

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

  const getDataPrompt = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsComplete(true)
    setIsLoading(true)

    try {
      const prompt = promptMaster(formData)

      setPrompts([])

      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: prompt,
      })

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setPrompts(data.prompt)
    } catch (error) {
      console.error("Error al procesar el prompt:", error)
      setIsComplete(false)
      setPrompts([])
    } finally {
      setIsLoading(false)
    }
  }

  const createSuggestion = async () => {
    if (currentIndex === 4) {
      methods.next()
      return
    }
    methods.next()
    setIsLoading(true)

    try {
      const { context, objective } = formData
      const question = promptsSuggestion(context, objective, currentIndex)

      const response = await fetch("/api/suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: question,
      })

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      const suggestionKeys = ["context", "inputOutput", "format", "style"]
      if (currentIndex >= 0 && currentIndex < suggestionKeys.length) {
        const key = suggestionKeys[currentIndex]
        setSuggestions((prev) => ({
          ...prev,
          [key]: data.suggestions,
        }))
      }
    } catch (error) {
      console.error("Error al obtener sugerencias:", error)
    } finally {
      setIsLoading(false)
    }
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

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-200 bg-white">
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
          </div>
        ) : (
          <div className="max-w-4xl flex flex-col">
            <Complete prompts={prompts} />
          </div>
        )
      )}
    </section>
  )
}
