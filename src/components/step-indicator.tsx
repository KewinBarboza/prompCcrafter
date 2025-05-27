interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export const StepIndicator = ({
  currentStep,
  totalSteps,
}: StepIndicatorProps) => {


  return (
    <div className="relative inline-flex">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <p className="text-gray-900">{currentStep}</p> de <p className="text-gray-900">{totalSteps}</p>
        </div>
      </div>
    </div>
  )
}
