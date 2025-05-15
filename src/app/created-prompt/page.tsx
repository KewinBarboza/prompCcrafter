"use client"
import { Button } from "@/components/ui/button"
import { defineStepper } from "@stepperize/react"
import { ArrowBigLeft } from "lucide-react"
import Link from "next/link"

const { Scoped, useStepper, steps } = defineStepper(
  { id: "step-1", title: "Step 1", description: "First step" },
  { id: "step-2", title: "Step 2", description: "Second step" },
  { id: "step-3", title: "Step 3", description: "Third step" }
)

export default function CreatedPrompt() {
  const methods = useStepper()

  return (
    <>
      <Button size="lg" variant="outline" asChild>
        <Link href='/'><ArrowBigLeft /></Link>
      </Button>

      <p>{steps[0].title}</p>
      {methods.when("step-1", (step) => (
        <p>First step: {step.title}</p>
      ))}

      {methods.when("step-2", (step) => (
        <p>Second step: {step.title}</p>
      ))}

      {methods.when("step-3", (step) => (
        <p>Second step: {step.title}</p>
      ))}

      {
        methods.isLast === false ? (
          <>
            <Button onClick={() => methods.next()}>Next</Button>
            <Button onClick={() => methods.prev()}>Previous</Button>
          </>
        ) : null
      }
    </>
  )
}
