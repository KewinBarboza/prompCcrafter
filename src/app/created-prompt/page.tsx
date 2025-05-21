"use client"

import { ObjectiveSummaryExample } from "@/components/form/radio"
import { StepIndicator } from "@/components/step-indicator"
import { Button } from "@/components/ui/button"
import { defineStepper } from "@stepperize/react"
import { MoveLeft } from "lucide-react"
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
  },
  {
    id: "complete",
    title: "¡Listo!",
    description: "Has completado todos los pasos. Ahora puedes seleccionar el prompt que deseas utilizar. Puedes editarlo si lo deseas. en el editor"
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
  const [formData, setFormData] = useState({
    objective: "",
    context: "",
    inputOutput: "",
    format: "",
    style: "",
    tokenRange: 0,
    tempRange: 0
  })

  const getDataPrompt = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    const prompt = promptMaster(formData)

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
        setPrompts([])
      }).finally(() => {
        setIsLoading(false)
      })

  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const currentIndex = utils.getIndex(methods.current.id)

  return (
    <>
      <section className="h-dvh w-dvw grid-rows-3 flex flex-col items-center justify-center">
        <div className="max-w-4xl flex justify-start w-full">
          <Button size="lg" variant="link" asChild>
            <Link href='/'><MoveLeft />Volver atrás</Link>
          </Button>
        </div>
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
        <div className="max-w-4xl flex flex-col ">
          <form className=" max-w-fit" onSubmit={getDataPrompt}>
            {methods.when("step-1", () => <Task handleChange={handleChange} />)}
            {methods.when("step-2", () => <Context handleChange={handleChange} />)}
            {methods.when("step-3", () => <InputOutput handleChange={handleChange} />)}
            {methods.when("step-4", () => <FormatExit handleChange={handleChange} />)}
            {methods.when("step-5", () => <StyleAndTone handleChange={handleChange} />)}
            {methods.when("step-6", () => <Settings handleChange={handleChange} />)}
            {methods.when("complete", () => isLoading ? (
              <div className="flex justify-center items-center w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>) : (<Complete prompts={prompts} />))}

            {
              methods.isLast === false ? (
                <div className="flex justify-between w-full mt-10">
                  {!methods.isLast && (
                    <Button
                      size={"lg"}
                      variant="secondary"
                      onClick={methods.prev}
                      disabled={methods.isFirst}
                    >
                      Anterior
                    </Button>
                  )}
                  <Button size={"lg"} onClick={methods.isLast ? methods.reset : methods.next} type="submit">
                    {methods.isLast ? "Restablecer" : "Siguiente"}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end w-full mt-10">
                  <Button size={"lg"} onClick={() => console.log("info")}>Crear prompt</Button>
                </div>
              )
            }
          </form>

          <pre className="absolute top-10 right-10 p-4 bg-white rounded-lg shadow mt-4 min-w-2xl max-w-2xl">
            <code className="text-sm text-gray-500">
              {JSON.stringify(formData, null, 2)}
            </code>
          </pre>
        </div>
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
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
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

const Context = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
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
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="context"
            value="Email Marketing (Startup Tecnológica): Somos una startup de tecnología educativa a punto de lanzar 'LinguaBoost'. Queremos anunciar el lanzamiento (15 de junio), destacar características (aprendizaje adaptativo, personajes interactivos) y ofrecer descuento del 20%."
            label="Email Marketing"
            description="Email Marketing (Startup Tecnológica): Somos una startup de tecnología educativa a punto de lanzar 'LinguaBoost'. Queremos anunciar el lanzamiento (15 de junio), destacar características (aprendizaje adaptativo, personajes interactivos) y ofrecer descuento del 20%."
          />

          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="context"
            value="E-commerce (Zapatillas Running): Descripción para 'Velocity Pro' de 'RunFast'. Para maratonistas, suela de carbono, upper ligero, peso 210g, drop 8mm. Transmitir velocidad y tecnología."
            label="E-commerce"
            description="E-commerce (Zapatillas Running): Descripción para 'Velocity Pro' de 'RunFast'. Para maratonistas, suela de carbono, upper ligero, peso 210g, drop 8mm. Transmitir velocidad y tecnología."
          />

          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="context"
            value="Video Explicativo (Herramienta SaaS): Guion para 'TaskMaster' (gestión de proyectos). Integración con calendarios, colaboración real, notificaciones. Para freelancers y PYMEs. Llamada a acción: prueba gratuita 14 días."
            label="Video Explicativo"
            description="Video Explicativo (Herramienta SaaS): Guion para 'TaskMaster' (gestión de proyectos). Integración con calendarios, colaboración real, notificaciones. Para freelancers y PYMEs. Llamada a acción: prueba gratuita 14 días."
          />

          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="context"
            value="Redes Sociales (Nutricionista): Plan de contenidos para Instagram (junio). Dietas plant-based. Pilares: recetas veganas, mitos nutrición, mindfulness, transición a plant-based. Audiencia: mujeres 25-45 años."
            label="Redes Sociales"
            description="Redes Sociales (Nutricionista): Plan de contenidos para Instagram (junio). Dietas plant-based. Pilares: recetas veganas, mitos nutrición, mindfulness, transición a plant-based. Audiencia: mujeres 25-45 años."
          />
        </div>
      </div>
    </div>
  )
}

const InputOutput = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  return (
    <div>
      <textarea
        name="inputOutput" rows={3} required
        onInput={handleChange}
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ej: \nEntrada: Traduce 'Hola Mundo' al francés.\nSalida: Bonjour le monde.\n\nEntrada: Cliente pregunta por el estado de su pedido #123.\nSalida: Estimado cliente, su pedido #123 ha sido enviado..."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
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
          />
        </div>
      </div>
    </div>
  )
}

const FormatExit = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
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
        <div className="grid md:grid-cols-4 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="format"
            value="JSON"
            label="🗂️ JSON"
            description="Recibe la respuesta en formato JSON estructurado."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="format"
            value="Lista"
            label="📋 Lista"
            description="Recibe la respuesta como una lista de elementos."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="format"
            value="Párrafo"
            label="📄 Párrafo"
            description="Recibe la respuesta en formato de texto corrido o párrafo."
          />
          <ObjectiveSummaryExample
            handleRadioToTextarea={handleRadioToTextarea}
            name="format"
            value="Código"
            label="💻 Fragmento de código"
            description="Recibe la respuesta como un bloque de código."
          />
        </div>
      </div>
    </div>
  )
}

const StyleAndTone = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
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
          <ObjectiveSummaryExample
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
          />
        </div>
      </div>
    </div>
  )
}

const Settings = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  const [token, setToken] = useState(100)
  const [temp, setTemp] = useState(0.7)
  // Para actualizar el formData global, usa un custom event
  // o levanta el estado a CreatedPrompt si necesitas sincronizar

  // Si quieres actualizar el formData global, puedes usar un contexto o prop drilling
  // Aquí solo se muestra el control local, pero puedes adaptarlo según tu arquitectura

  // Maneja el cambio de los sliders
  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "settings") {
      const [tokens, tempValue] = value.split("-").map(Number)
      setToken(tokens)
      setTemp(tempValue)
    }

    if (name === "tokenRange") setToken(Number(value))
    if (name === "tempRange") setTemp(Number(value))
    // Aquí deberías actualizar el formData global si es necesario
  }

  // Maneja la selección de presets
  const handlePreset = (tokens: number, tempValue: number, e: ChangeEvent<HTMLInputElement>) => {
    // setToken(tokens)
    // setTemp(tempValue)
    handleSliderChange(e)
    handleChange(e)
    // Aquí deberías actualizar el formData global si es necesario
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
            handleRadioToTextarea={(e) => handlePreset(100, 0.7, e)}
          />
          <ObjectiveSummaryExample
            name="settings"
            value="200-0.3"
            label="200-0.3"
            description="Más largo y preciso, menos creativo."
            handleRadioToTextarea={(e) => handlePreset(200, 0.3, e)}
          />
          <ObjectiveSummaryExample
            name="settings"
            value="50,-1.0"
            label="50,-1.0"
            description="Muy creativo, posible incoherencia."
            handleRadioToTextarea={(e) => handlePreset(50, 1.0, e)}
          />
        </div>
      </div>
    </div>
  )
}

const Complete = ({ prompts }: { prompts: { name: string, prompt: string }[] }) => {

  return (
    <div>
      <div className="mt-4 space-y-2">
        {prompts.map((prompt, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <p>{prompt.name}</p>
            <p className="text-sm text-gray-500">{prompt.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
