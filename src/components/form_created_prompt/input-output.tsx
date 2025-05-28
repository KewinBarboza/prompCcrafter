import { FormEventHandler } from "react"
import { ObjectiveSummaryExample } from "../form/radio"
import { handleRadioToTextarea } from "@/lib/utils"
import { SkeletonList } from "../skeleton-list"

export const InputOutput = ({
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
