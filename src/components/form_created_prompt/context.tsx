import { FormEventHandler } from "react"
import { SkeletonList } from "../skeleton-list"
import { ObjectiveSummaryExample } from "../form/radio"
import { handleRadioToTextarea } from "@/lib/utils"

export const Context = ({
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
