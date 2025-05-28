import { ChangeEvent, FormEventHandler, useState } from "react"
import { ObjectiveSummaryExample } from "../form/radio"

export const Settings = ({ handleChange }: { handleChange: FormEventHandler<HTMLTextAreaElement | HTMLInputElement> }) => {
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
      <div className="mt-4 p-6 rounded-3xl border border-neutral-200">
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
      <div className="mt-4  p-6 rounded-3xl border border-neutral-200">
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
