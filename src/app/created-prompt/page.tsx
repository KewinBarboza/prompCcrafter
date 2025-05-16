"use client"
import { Button } from "@/components/ui/button"
import { defineStepper } from "@stepperize/react"
import { ArrowBigLeft } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

const { useStepper, steps, utils } = defineStepper(
  { id: "step-1", title: "1. ¿Cuál es el objetivo o tarea principal que quieres que el modelo realice?", description: "First step" },
  { id: "step-2", title: "Entrada y salida deseada", description: "Second step" },
  { id: "step-3", title: "Formato deseas recibir la respuesta", description: "Third step" },
  { id: "step-4", title: "¿ Qué estilo, tono o rol debe adoptar el modelo ?", description: "Third step" },
  { id: "step-5", title: "Configuraciones o restricciones adicionales", description: "Third step" },
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
        <div className="">
          <Button size="lg" variant="link" className="text-white" asChild>
            <Link href='/'><ArrowBigLeft />Volver atrás</Link>
          </Button>
        </div>
        <div className="py-6 max-w-4xl ">
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
            {methods.when("step-2", () => <InputOutput />)}
            {methods.when("step-3", () => <FormatExit />)}
            {methods.when("step-4", () => <StyleAndTone />)}
            {methods.when("step-5", () => <Settings />)}

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
                      Previous
                    </Button>
                  )}
                  <Button size={"lg"} onClick={methods.isLast ? methods.reset : methods.next} type="submit">
                    {methods.isLast ? "Reset" : "Next"}
                  </Button>
                </div>
              ) : <Button size={"lg"} onClick={() => console.log("info")}>Crear prompt</Button>
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


const Text = ({ text }: { text: string }) => <h2 className="flex-1 text-2xl font-semibold text-gray-800">{text}</h2>

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
    flex text-base p-4 rounded-3xl justify-between
    hover:bg-neutral-50 select-none">
    <span>
      <span className="block font-bold font-sans">
        {label}
        <span className="mt-1 block text-sm font-light">
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

const Task = () => {
  return (
    <div>
      <textarea
        id="objective"
        name="objective" rows={3} required
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Describe la acción o resultado deseado..."></textarea>

      <div className="mt-4 space-y-2">
        <span className="text-gray-600 block mb-3 mt-5">O selecciona un ejemplo de objetivo:</span>
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
      <Text text="2. Selecciona un ejemplo de entrada y salida deseada:" />
      <div className="space-y-4 ml-4">
        <label className="block">
          <input type="radio" name="examples" value="Entrada: 'Resume el siguiente texto sobre cambio climático manteniendo viñetas y sin opiniones personales.' Salida: '- Aumento de temperatura global\n- Derretimiento de glaciares\n- Impacto en ecosistemas'" required className="form-radio" />
          <span className="ml-2">Ejemplo 1: Resumen con formato y restricción de opinión</span>
        </label>

        <label className="block">
          <input type="radio" name="examples" value="Entrada: 'Clasifica las siguientes reseñas en positivo, negativo o neutral y explica tu elección.' Salida: 'Positivo: La calidad es excelente porque...'" className="form-radio" />
          <span className="ml-2">Ejemplo 2: Clasificación de sentimiento con justificación</span>
        </label>


        <label className="block">
          <input type="radio" name="examples" value="" className="form-radio" />
          <span className="ml-2">Ejemplo 3: Generación de código con docstring y prueba</span>
        </label>

        <label className="block">
          <input type="radio" name="examples" value="Entrada: 'Crea una tabla de indicadores de rendimiento (KPI) para un proyecto de marketing.' Salida: 'Tabla KPI | Descripción | Meta'" className="form-radio" />
          <span className="ml-2">Ejemplo 4: Estructura tabular de KPIs</span>
        </label>

        <label className="block">
          <input type="radio" name="examples" value="Otros" id="examplesOtherRadio" className="form-radio" />
          <span className="ml-2">✏️ Otros</span>
        </label>
        <textarea id="examplesOtherInput" name="examplesOther" rows={3} placeholder="Escribe tu propio ejemplo detallado..." className="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden"></textarea>
      </div>
    </div>
  )
}

const FormatExit = () => {
  return (
    <div>
      <Text text="3. ¿En qué formato deseas recibir la respuesta?" />
      <div className="space-y-2 ml-4">
        <label className="inline-flex items-center">
          <input type="radio" name="format" value="JSON" required className="form-radio" />
          <span className="ml-2">🗂️ JSON</span>
        </label>

        <label className="inline-flex items-center">
          <input type="radio" name="format" value="Lista" className="form-radio" />
          <span className="ml-2">📋 Lista</span>
        </label>

        <label className="inline-flex items-center">
          <input type="radio" name="format" value="Párrafo" className="form-radio" />
          <span className="ml-2">📄 Párrafo</span>
        </label>

        <label className="inline-flex items-center">
          <input type="radio" name="format" value="Código" className="form-radio" />
          <span className="ml-2">💻 Fragmento de código</span>
        </label>
      </div>
    </div>
  )
}

const StyleAndTone = () => {
  return (
    <div>
      <Text text="4. ¿Qué estilo, tono o rol debe adoptar el modelo al generar la respuesta?" />
      <div className="space-y-2 ml-4">
        <label className="inline-flex items-center">
          <input type="radio" name="style" value="Formal" required className="form-radio" />
          <span className="ml-2">🎩 Formal</span>
        </label>

        <label className="inline-flex items-center">
          <input type="radio" name="style" value="Humorístico" className="form-radio" />
          <span className="ml-2">😂 Humorístico</span>
        </label>

        <label className="inline-flex items-center">
          <input type="radio" name="style" value="Técnico experto" className="form-radio" />
          <span className="ml-2">💻 Técnico experto</span>
        </label>

        <label className="inline-flex items-center">
          <input type="radio" name="style" value="Resumido" className="form-radio" />
          <span className="ml-2">📝 Resumido</span>
        </label>

        <label className="inline-flex items-center">
          <input type="radio" name="style" value="Detallado" className="form-radio" />
          <span className="ml-2">🔍 Detallado</span>
        </label>

        <label className="inline-flex items-center">
          <input type="radio" name="style" value="Otros" id="styleOtherRadio" className="form-radio" />
          <span className="ml-2">✏️ Otros</span>
        </label>
        <input type="text" id="styleOtherInput" name="styleOther" placeholder="Especifica otro estilo..." className="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden" />
      </div>
    </div>
  )
}

const Settings = () => {
  return (
    <div>
      <Text text=" 5. ¿Qué configuraciones o restricciones adicionales quieres aplicar?" />
      <div className="space-y-4 ml-4">
        <label className="block">
          <input
            type="radio"
            name="settings"
            value="Tokens máximo: 100, Temperatura: 0.7"
            required
            className="form-radio"
          />
          <span className="ml-2 font-medium">
            Tokens máximo: 100, Temperatura: 0.7
          </span>
        </label>
        <p className="ml-8 text-sm text-gray-500">
          Conciso y creativo moderado.
        </p>
        <label className="block">
          <input
            type="radio"
            name="settings"
            value="Tokens máximo: 200, Temperatura: 0.3"
            className="form-radio"
          />
          <span className="ml-2 font-medium">
            Tokens máximo: 200, Temperatura: 0.3
          </span>
        </label>
        <p className="ml-8 text-sm text-gray-500">
          Más largo y preciso, menos creativo.
        </p>
        <label className="block">
          <input
            type="radio"
            name="settings"
            value="Tokens máximo: 50, Temperatura: 1.0"
            className="form-radio"
          />
          <span className="ml-2 font-medium">
            Tokens máximo: 50, Temperatura: 1.0
          </span>
        </label>
        <p className="ml-8 text-sm text-gray-500">
          Muy creativo, posible incoherencia.
        </p>
        <label className="block">
          <input
            type="radio"
            name="settings"
            value="Otros"
            id="settingsOtherRadio"
            className="form-radio"
          />
          <span className="ml-2">✏️ Otros</span>
        </label>
        <textarea
          id="settingsOtherInput"
          name="settingsOther"
          rows={2}
          placeholder="Especifica otras configuraciones..."
          className="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden"
        ></textarea>
        {/* Sliders para tokens y temperatura */}
        <div className="mt-4 ml-4">
          <label
            htmlFor="tokenRange"
            className="block text-sm font-medium text-gray-700"
          >
            Número máximo de tokens:{" "}
            <span id="tokenValue" className="font-semibold">
              100
            </span>
          </label>
          <input
            type="range"
            id="tokenRange"
            name="tokenRange"
            min="10"
            max="500"
            step="10"
            defaultValue="100"
            className="w-full"
          />
        </div>
        <div className="mt-4 ml-4">
          <label
            htmlFor="tempRange"
            className="block text-sm font-medium text-gray-700"
          >
            Temperatura:{" "}
            <span id="tempValue" className="font-semibold">
              0.7
            </span>
          </label>
          <input
            type="range"
            id="tempRange"
            name="tempRange"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.7"
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
