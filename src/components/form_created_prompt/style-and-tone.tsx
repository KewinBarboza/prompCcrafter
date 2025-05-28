import { FormEventHandler } from "react"
import { SkeletonList } from "../skeleton-list"
import { ObjectiveSummaryExample } from "../form/radio"
import { handleRadioToTextarea } from "@/lib/utils"

export const StyleAndTone = ({
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
        name="style" required
        className="w-full min-w-4xl px-4 h-32 py-2 border border-neutral-200 rounded-3xl p-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary field-sizing-content resize-none"
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
