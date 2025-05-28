import { FormEventHandler } from "react"
import { ObjectiveSummaryExample } from "../form/radio"
import { handleRadioToTextarea } from "@/lib/utils"

export const Task = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
  return (
    <div>
      <textarea
        onInput={handleChange}
        name="objective"
        required
        className="w-full min-w-4xl px-4 h-32 py-2 border border-neutral-200 rounded-3xl p-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary field-sizing-content resize-none"
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
