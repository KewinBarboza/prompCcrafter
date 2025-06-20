interface ObjectiveSummaryExampleProps {
  label: string
  description: string
  value: string
  name?: string,
  icon?: string,
  handleRadioToTextarea: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ObjectiveSummaryExample = ({
  label,
  description,
  value,
  name,
  handleRadioToTextarea
}: ObjectiveSummaryExampleProps) => (
  <label className="
    has-checked:border-primary
    has-checked:border border border-neutral-200
    flex text-base p-6 rounded-3xl justify-between
    hover:bg-neutral-50 select-none">
    <span>
      <span className="block text-lg font-sans">
        {label}
        <span className="mt-1 block text-base text-neutral-500">
          {description}
        </span>
      </span>
    </span>
    <input
      type="radio"
      name={name}
      value={value}
      hidden
      onChange={handleRadioToTextarea}
    />
  </label>
)
