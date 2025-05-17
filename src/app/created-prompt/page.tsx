"use client"

import { Button } from "@/components/ui/button"
import { defineStepper } from "@stepperize/react"
import { MoveLeft } from "lucide-react"
import Link from "next/link"

const { useStepper, utils } = defineStepper(
  {
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
)

export default function CreatedPrompt() {
  const methods = useStepper()

  const getDataPrompt = (formData: FormData) => {
    console.log(formData.get("objective"))
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
          <form className=" max-w-fit" action={getDataPrompt}>
            {methods.when("step-1", () => <Task />)}
            {methods.when("step-2", () => <Context />)}
            {methods.when("step-3", () => <InputOutput />)}
            {methods.when("step-4", () => <FormatExit />)}
            {methods.when("step-5", () => <StyleAndTone />)}
            {methods.when("step-6", () => <Settings />)}

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
        </div>
      </section>
    </>
  )
}

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  size?: number
  strokeWidth?: number
}

const StepIndicator = ({
  currentStep,
  totalSteps,
  size = 50,
  strokeWidth = 4,
}: StepIndicatorProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const fillPercentage = (currentStep / totalSteps) * 100
  const dashOffset = circumference - (circumference * fillPercentage) / 100

  return (
    <div className="relative inline-flex">
      <svg width={size} height={size}>
        <title>Step Indicator</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-primary transition-all duration-300 ease-in-out"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium" aria-live="polite">
          {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  )
}


const Text = ({ text }: { text: string }) => <h2 className="flex-1 text-lg text-gray-800 font-sans">{text}</h2>

// Componente aparte:
interface ObjectiveSummaryExampleProps {
  label: string
  description: string
  value: string
  name?: string,
  icon?: string
}

const ObjectiveSummaryExample = ({
  label,
  description,
  value,
  name = "objectiveExample",
}: ObjectiveSummaryExampleProps) => (
  <label className="
    has-checked:ring-primary
    has-checked:ring-2 ring ring-neutral-300
    flex text-base p-6 rounded-3xl justify-between
    hover:bg-neutral-50 select-none">
    <span>
      <span className="block text-lg font-sans">
        {label}
        <span className="mt-1 block text-sm text-neutral-500">
          {description}
        </span>
      </span>
    </span>
    <input
      type="radio"
      name={name}
      value={value}
      hidden
    />
  </label>
)

const Context = () => {
  return (
    <div>
      <textarea
        id="context"
        name="context" rows={3} required
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ej: El cliente 'Tech Solutions Inc.' asistió a nuestro webinar sobre 'IA en Marketing' la semana pasada y expresó interés en nuestro producto 'AnalyticPro'. El objetivo del email es agendar una demo."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            name="examples"
            value="Entrada: 'Resume el siguiente texto sobre cambio climático manteniendo viñetas y sin opiniones personales.' Salida: '- Aumento de temperatura global\n- Derretimiento de glaciares\n- Impacto en ecosistemas'"
            label="Resumen con formato y restricción de opinión"
            description="Entrada y salida para resumen objetivo con formato de viñetas y sin opiniones personales."
          />

          <ObjectiveSummaryExample
            name="examples"
            value="Entrada: 'Clasifica las siguientes reseñas en positivo, negativo o neutral y explica tu elección.' Salida: 'Positivo: La calidad es excelente porque...'"
            label="Clasificación de sentimiento con justificación"
            description="Entrada y salida para clasificación de sentimiento con explicación."
          />

          <ObjectiveSummaryExample
            name="examples"
            value=""
            label="Generación de código con docstring y prueba"
            description="Entrada y salida para generación de código documentado y con prueba unitaria."
          />

          <ObjectiveSummaryExample
            name="examples"
            value="Entrada: 'Crea una tabla de indicadores de rendimiento (KPI) para un proyecto de marketing.' Salida: 'Tabla KPI | Descripción | Meta'"
            label="Estructura tabular de KPIs"
            description="Entrada y salida para generación de tabla de KPIs."
          />
        </div>
      </div>
    </div>
  )
}

const Task = () => {
  return (
    <div>
      <textarea
        id="objective"
        name="objective" rows={3} required
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ej: Redactar un email de seguimiento a un cliente."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            name="objectiveExample"
            value="Resume el siguiente texto explicando solo los puntos clave sin agregar opiniones personales."
            label="Resumen objetivo"
            description="Resume un texto sin agregar opiniones, manteniendo claridad."
            icon="📝"
          />
          <ObjectiveSummaryExample
            name="objectiveExample"
            value="Clasifica reseñas en positivas, negativas o neutrales y explica brevemente por qué."
            label="Clasificación de sentimiento"
            description="Categoriza y justifica reseñas de usuarios."
            icon="🔍"
          />
          <ObjectiveSummaryExample
            name="objectiveExample"
            value="Genera una función en Python documentada y con prueba unitaria que invierta una cadena."
            label="Código con test"
            description="Crear función funcional y bien documentada."
            icon="💻"
          />
          <ObjectiveSummaryExample
            name="objectiveExample"
            value="Crea una tabla con los principales indicadores de rendimiento de marketing y sus metas."
            label="Tabla de KPIs"
            description="Representar KPIs con claridad en formato tabular."
            icon="📊"
          />
        </div>
      </div>
    </div>
  )
}

const InputOutput = () => {
  return (
    <div>
      <textarea
        id="objective"
        name="objective" rows={3} required
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ej: &#10;Entrada: Traduce 'Hola Mundo' al francés.&#10;Salida: Bonjour le monde.&#10;&#10;Entrada: Cliente pregunta por el estado de su pedido #123.&#10;Salida: Estimado cliente, su pedido #123 ha sido enviado..."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            name="examples"
            value="Entrada: 'Resume el siguiente texto sobre cambio climático manteniendo viñetas y sin opiniones personales.' Salida: '- Aumento de temperatura global\n- Derretimiento de glaciares\n- Impacto en ecosistemas'"
            label="Resumen con formato y restricción de opinión"
            description="Entrada y salida para resumen objetivo con formato de viñetas y sin opiniones personales."
          />

          <ObjectiveSummaryExample
            name="examples"
            value="Entrada: 'Clasifica las siguientes reseñas en positivo, negativo o neutral y explica tu elección.' Salida: 'Positivo: La calidad es excelente porque...'"
            label="Clasificación de sentimiento con justificación"
            description="Entrada y salida para clasificación de sentimiento con explicación."
          />

          <ObjectiveSummaryExample
            name="examples"
            value=""
            label="Generación de código con docstring y prueba"
            description="Entrada y salida para generación de código documentado y con prueba unitaria."
          />

          <ObjectiveSummaryExample
            name="examples"
            value="Entrada: 'Crea una tabla de indicadores de rendimiento (KPI) para un proyecto de marketing.' Salida: 'Tabla KPI | Descripción | Meta'"
            label="Estructura tabular de KPIs"
            description="Entrada y salida para generación de tabla de KPIs."
          />
        </div>
      </div>
    </div>
  )
}

const FormatExit = () => {
  return (
    <div className="mt-4 space-y-2">
      <span className="text-gray-600 block mb-3 mt-5">Seleccione el formato en el que desea recibir la respuesta</span>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-7">
        <ObjectiveSummaryExample
          name="format"
          value="JSON"
          label="🗂️ JSON"
          description="Recibe la respuesta en formato JSON estructurado."
        />
        <ObjectiveSummaryExample
          name="format"
          value="Lista"
          label="📋 Lista"
          description="Recibe la respuesta como una lista de elementos."
        />
        <ObjectiveSummaryExample
          name="format"
          value="Párrafo"
          label="📄 Párrafo"
          description="Recibe la respuesta en formato de texto corrido o párrafo."
        />
        <ObjectiveSummaryExample
          name="format"
          value="Código"
          label="💻 Fragmento de código"
          description="Recibe la respuesta como un bloque de código."
        />
      </div>
    </div>
  )
}

const StyleAndTone = () => {
  return (
    <div>
      <textarea
        id="styleOtherInput"
        name="styleOther" rows={3} required
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Especifica otro estilo..."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo</span>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            name="style"
            value="Formal"
            label="Formal"
            description="Utiliza un lenguaje profesional, serio y estructurado, adecuado para contextos académicos o de negocios."
          />
          <ObjectiveSummaryExample
            name="style"
            value="Humorístico"
            label="Humorístico"
            description="Emplea un tono divertido y ligero, incorporando humor para hacer la respuesta más amena."
          />
          <ObjectiveSummaryExample
            name="style"
            value="Técnico experto"
            label="Técnico experto"
            description="Redacta la respuesta con precisión técnica y vocabulario especializado, como lo haría un profesional del área."
          />
          <ObjectiveSummaryExample
            name="style"
            value="Resumido"
            label="Resumido"
            description="Presenta la información de manera breve y concisa, enfocándose solo en los puntos clave."
          />
          <ObjectiveSummaryExample
            name="style"
            value="Detallado"
            label="Detallado"
            description="Ofrece una explicación extensa y minuciosa, cubriendo todos los aspectos relevantes del tema."
          />
        </div>
      </div>
    </div>
  )
}

const Settings = () => {
  return (
    <div>
      <div className="mt-4  p-6 rounded-3xl ring ring-neutral-300">
        <label htmlFor="tokenRange" className="block text-sm font-medium text-gray-700">
          Número máximo de tokens:{" "}
          <span id="tokenValue" className="font-semibold">100</span>
        </label>
        <input type="range" id="tokenRange" name="tokenRange" min="10" max="500" step="10" defaultValue="100" className="w-full accent-primary" />
      </div>
      <div className="mt-4  p-6 rounded-3xl ring ring-neutral-300">
        <label htmlFor="tempRange" className="block text-sm font-medium text-gray-700">
          Temperatura:{" "}
          <span id="tempValue" className="font-semibold">0.7</span>
        </label>
        <input type="range" id="tempRange" name="tempRange" min="0" max="1" step="0.01" defaultValue="0.7" className="w-full accent-primary" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
          <ObjectiveSummaryExample
            name="settings"
            value="Tokens máximo: 100, Temperatura: 0.7"
            label="Tokens máximo: 100, Temperatura: 0.7"
            description="Conciso y creativo moderado."
          />
          <ObjectiveSummaryExample
            name="settings"
            value="Tokens máximo: 200, Temperatura: 0.3"
            label="Tokens máximo: 200, Temperatura: 0.3"
            description="Más largo y preciso, menos creativo."
          />
          <ObjectiveSummaryExample
            name="settings"
            value="Tokens máximo: 50, Temperatura: 1.0"
            label="Tokens máximo: 50, Temperatura: 1.0"
            description="Muy creativo, posible incoherencia."
          />
        </div>
      </div>
    </div>
  )
}
