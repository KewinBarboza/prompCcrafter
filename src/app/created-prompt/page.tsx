"use client"

import { ObjectiveSummaryExample } from "@/components/form/radio"
import { StepIndicator } from "@/components/step-indicator"
import { Button } from "@/components/ui/button"
import { defineStepper } from "@stepperize/react"
import { ArrowRightToLine, Copy, MoveLeft, Save } from "lucide-react"
import Link from "next/link"
import { ChangeEvent, FormEventHandler, useState } from "react"
import { Text } from "@/components/text"
import { promptMaster } from "@/lib/prompt"

const { useStepper, utils } = defineStepper({
  id: "step-1",
  title: "1. ¿Cuál es el objetivo o tarea principal que quieres que el modelo realice?",
  description: "Describe la tarea central que la IA debe realizar. Sé específico y claro."
},
  {
    id: "step-2",
    title: "2. Contexto Relevante",
    description: "Proporciona la información de fondo necesaria para que la IA entienda la situación completamente."
  },
  {
    id: "step-3",
    title: "3. Selecciona un ejemplo de entrada y salida deseada",
    description: "Proporcionar ejemplos (técnica few-shot) es muy efectivo para guiar a la IA. Para clasificación, mezcla las clases en los ejemplos."
  },
  {
    id: "step-4",
    title: "4. ¿En qué formato deseas recibir la respuesta?",
    description: "Especificar el formato ayuda a obtener resultados estructurados."
  },
  {
    id: "step-5",
    title: "5. ¿Qué estilo, tono o rol debe adoptar el modelo al generar la respuesta?",
    description: "El tono adecuado puede hacer la respuesta más efectiva para tu audiencia."
  },
  {
    id: "step-6",
    title: "6. ¿Qué configuraciones o restricciones adicionales quieres aplicar?",
    description: "Third step"
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
    style: "",
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
    console.log('first')
    setIsLoading(true)

    let question = ""

    if (currentIndex === 0) {
      question = 'Actúa como un experto en creación de prompts para IA. proporciona ejemplos de contextos según el objetivo para ayudar a completar el prompt para mejorar el contexto. El objetivo actual que quiere realizar el usuario es: ' + formData.objective + '. Proporciona 4 ejemplos que sirvan para completar el prompt que sean concisos y relevantes para mejorar el contexto del prompt. Asegúrate de que los ejemplos sean prácticas y aplicables y que funcionen como un auto completado para el usuario según el objetivo. No incluyas explicaciones, solo los ejemplos en formato JSON. Cada ejemplo debe tener un campo "name" y "suggestion". sigue este ejemplo: {"name": "Email marketing", "suggestion": "El cliente ' + "Tech Solutions Inc" + ' asistió a nuestro webinar sobre ' + "IA en Marketing" + ' la semana pasada y expresó interés en nuestro producto ' + "AnalyticPro" + '. El objetivo del email es agendar una demo."}'
    }

    if (currentIndex === 1) {
      question = 'Actúa como un experto en creación de prompts para IA. Proporciona ejemplos para mejorar la sección de entrada y salida del prompt. El objetivo actual que quiere realizar el usuario es: ' + formData.objective + ' y el contexto se es el siguiente: ' + formData.context + '. Proporciona 4 ejemplos de entrada y salida que sean relevantes y útiles para el objetivo del usuario. Asegúrate de que las sugerencias sean prácticas y aplicables. No incluyas explicaciones, solo las sugerencias en formato JSON. Cada sugerencia debe tener un campo "name" y "suggestion". cada ejemplo de tener una entrada y una salida. Sigue este ejemplo: {"name": "Email", "suggestion": "Entrada: Buenas tardes, Tech Solutions Inc el objetivo de este email es ofrecerle nuestro producto ya que asistió a nuestro webinar. Salida:  Estimado cliente, gracias por asistir a nuestro webinar. ya que asistió a nuestro webinar le ofrecemos nuestros mejores productos."}'
    }

    if (currentIndex === 2) {
      question = 'Actúa como un experto en creación de prompts para IA. Proporciona sugerencias para mejorar el formato de la respuesta del prompt. El objetivo actual que quiere realizar el usuario es: ' + formData.objective + ' y el contexto es: ' + formData.context + '. Proporciona 4 formatos diferentes que sean relevantes y útiles para el objetivo del usuario. Asegúrate de que las sugerencias sean prácticas y aplicables. No incluyas explicaciones, solo las sugerencias en formato JSON. Cada sugerencia debe tener un campo "name" y "suggestion".'
    }

    if (currentIndex === 3) {
      question = 'Actúa como un experto en creación de prompts para IA. Proporciona sugerencias para mejorar el estilo y tono del prompt. El objetivo actual que quiere realizar el usuario es: ' + formData.objective + ' y el contexto es: ' + formData.context + '. Proporciona 4 estilos o tonos diferentes que sean relevantes y útiles para el objetivo del usuario. Asegúrate de que las sugerencias sean prácticas y aplicables. No incluyas explicaciones, solo las sugerencias en formato JSON. Cada sugerencia debe tener un campo "name" y "suggestion".'
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
      <section className="h-dvh w-dvw flex flex-col items-center justify-center">
        <div className="max-w-4xl flex justify-start w-full">
          <Button size="lg" variant="link" asChild>
            <Link href='/'><MoveLeft />Volver atrás</Link>
          </Button>
        </div>
        {isComplete === false ? (
          <>
            <div className="py-6 max-w-4xl items-start flex justify-start w-full">
              <div className="flex gap-4">
                <StepIndicator
                  currentStep={currentIndex + 1}
                  totalSteps={methods.all.length}
                />
                <div className="flex flex-col">
                  <Text text={methods.current.title} />
                  <p className="text-sm text-muted-foreground">
                    {methods.current.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="max-w-4xl flex flex-col">
              <form className="max-w-fit" onSubmit={getDataPrompt}>
                {methods.when("step-1", () => <Task handleChange={handleChange} />)}
                {methods.when("step-2", () => <Context handleChange={handleChange} suggestions={suggestions.context} isLoading={isLoading} />)}
                {methods.when("step-3", () => <InputOutput handleChange={handleChange} suggestions={suggestions.inputOutput} isLoading={isLoading} />)}
                {methods.when("step-4", () => <FormatExit handleChange={handleChange} suggestions={suggestions.format} isLoading={isLoading} />)}
                {methods.when("step-5", () => <StyleAndTone handleChange={handleChange} suggestions={suggestions.style} isLoading={isLoading} />)}
                {methods.when("step-6", () => <Settings handleChange={handleChange} />)}

                {
                  methods.isLast === false ? (
                    <div className="flex justify-between w-full mt-10">
                      <Button
                        variant="secondary"
                        onClick={methods.prev}
                        disabled={methods.isFirst}
                      >
                        Anterior
                      </Button>
                      <Button onClick={createSuggestion}>
                        {methods.isLast ? 'Crear prompt' : 'Siguiente'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end w-full mt-10">
                      <Button size={"lg"} type="submit">Crear prompt</Button>
                    </div>
                  )
                }
              </form>
            </div>
          </>
        ) : (
          isLoading ? (
            <div className="max-w-4xl flex flex-col py-28 my-20">
              <div className="flex justify-center items-center w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ej: Redactar un email de seguimiento a un cliente."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
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

const Context = ({ handleChange, suggestions, isLoading }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  return (
    <div>
      <textarea
        name="context"
        onInput={handleChange}
        rows={3} required
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ej: El cliente 'Tech Solutions Inc.' asistió a nuestro webinar sobre 'IA en Marketing' la semana pasada y expresó interés en nuestro producto 'AnalyticPro'. El objetivo del email es agendar una demo."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7 p-2">
          {isLoading ? (
            <p className="text-gray-500">No hay sugerencias disponibles.</p>
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

const InputOutput = ({ handleChange, suggestions, isLoading }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  return (
    <div>
      <textarea
        name="inputOutput" rows={3} required
        onInput={handleChange}
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ej: \nEntrada: Traduce 'Hola Mundo' al francés.\nSalida: Bonjour le monde.\n\nEntrada: Cliente pregunta por el estado de su pedido #123.\nSalida: Estimado cliente, su pedido #123 ha sido enviado..."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7">
          {isLoading ? (
            <p className="text-gray-500">No hay sugerencias disponibles.</p>
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
          {/* <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="inputOutput"
            value="Entrada: 'Resume el siguiente texto sobre cambio climático manteniendo viñetas y sin opiniones personales.' Salida: '- Aumento de temperatura global\n- Derretimiento de glaciares\n- Impacto en ecosistemas'"
            label="Resumen con formato y restricción de opinión"
            description="Entrada y salida para resumen objetivo con formato de viñetas y sin opiniones personales."
          />

          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="inputOutput"
            value="Entrada: 'Clasifica las siguientes reseñas en positivo, negativo o neutral y explica tu elección.' Salida: 'Positivo: La calidad es excelente porque...'"
            label="Clasificación de sentimiento con justificación"
            description="Entrada y salida para clasificación de sentimiento con explicación."
          />

          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="inputOutput"
            value=""
            label="Generación de código con docstring y prueba"
            description="Entrada y salida para generación de código documentado y con prueba unitaria."
          />

          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="inputOutput"
            value="Entrada: 'Crea una tabla de indicadores de rendimiento (KPI) para un proyecto de marketing.' Salida: 'Tabla KPI | Descripción | Meta'"
            label="Estructura tabular de KPIs"
            description="Entrada y salida para generación de tabla de KPIs."
          /> */}
        </div>
      </div>
    </div>
  )
}

const FormatExit = ({ handleChange, suggestions, isLoading }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  return (
    <div>
      <textarea
        name="format"
        rows={3} required
        onInput={handleChange}
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ej: JSON, Lista, Párrafo, Código"></textarea>
      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">Seleccione el formato en el que desea recibir la respuesta</span>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7">
          {isLoading ? (
            <p className="text-gray-500">No hay sugerencias disponibles.</p>
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
          {/* <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="format"
            value="JSON"
            label="JSON"
            description="Recibe la respuesta en formato JSON estructurado."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="format"
            value="Lista"
            label="Lista"
            description="Recibe la respuesta como una lista de elementos."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="format"
            value="Párrafo"
            label="Párrafo"
            description="Recibe la respuesta en formato de texto corrido o párrafo."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="format"
            value="Código"
            label="Fragmento de código"
            description="Recibe la respuesta como un bloque de código."
          /> */}
        </div>
      </div>
    </div>
  )
}

const StyleAndTone = ({ handleChange, suggestions, isLoading }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  return (
    <div>
      <textarea
        onInput={handleChange}
        name="style" rows={3} required
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Especifica otro estilo..."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          {isLoading ? (
            <p className="text-gray-500">No hay sugerencias disponibles.</p>
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
          {/* <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="style"
            value="Utiliza un lenguaje profesional, serio y estructurado, adecuado para contextos académicos o de negocios."
            label="Formal"
            description="Utiliza un lenguaje profesional, serio y estructurado, adecuado para contextos académicos o de negocios."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="style"
            value="Emplea un tono divertido y ligero, incorporando humor para hacer la respuesta más amena."
            label="Humorístico"
            description="Emplea un tono divertido y ligero, incorporando humor para hacer la respuesta más amena."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="style"
            value="Redacta la respuesta con precisión técnica y vocabulario especializado, como lo haría un profesional del área."
            label="Técnico experto"
            description="Redacta la respuesta con precisión técnica y vocabulario especializado, como lo haría un profesional del área."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="style"
            value="Presenta la información de manera breve y concisa, enfocándose solo en los puntos clave."
            label="Resumido"
            description="Presenta la información de manera breve y concisa, enfocándose solo en los puntos clave."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="style"
            value="Ofrece una explicación extensa y minuciosa, cubriendo todos los aspectos relevantes del tema."
            label="Detallado"
            description="Ofrece una explicación extensa y minuciosa, cubriendo todos los aspectos relevantes del tema."
          /> */}
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
      <div className="mt-4  p-6 rounded-3xl ring ring-neutral-300">
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
      <div className="mt-4  p-6 rounded-3xl ring ring-neutral-300">
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
            <p>{prompt.name}</p>
            <p className="text-sm text-gray-500">{prompt.prompt}</p>

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
