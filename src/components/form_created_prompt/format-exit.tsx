import { FormEventHandler } from "react"
import { ObjectiveSummaryExample } from "../form/radio"
import { SkeletonList } from "../skeleton-list"
import { handleRadioToTextarea } from "@/lib/utils"

export const FormatExit = ({
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
