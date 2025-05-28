import { useState } from "react"
import { Button } from "../ui/button"
import { ArrowRightToLine, Copy, Link, Save } from "lucide-react"

export const Complete = ({ prompts }: { prompts: { name: string, prompt: string }[] }) => {
  const [btnText, setBtnText] = useState("Copiar")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setBtnText("Texto copiado")
        setTimeout(() => {
          setBtnText("Copiar")
        }, 2000)
      })
      .catch((err) => {
        console.error("Error al copiar el texto: ", err)
      })
  }

  if (prompts.length === 0) {
    return (
      <div className="flex justify-center items-center w-full">
        <p className="text-lg text-gray-500">No se encontraron resultados.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mt-4 space-y-2">
        {prompts.map((prompt, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <p className="text-xl">{prompt.name}</p>
            <p className="text-2xl text-gray-500">{prompt.prompt}</p>

            <div className="flex justify-end gap-x-2 mt-5">
              <Button variant="outline" onClick={() => copyToClipboard(prompt.prompt)}>
                <Copy />
                {btnText}
              </Button>

              <Button asChild variant="default">
                <Link href={`/prompt/?prompt=${encodeURIComponent(prompt.prompt)}&edit=true&name=${encodeURIComponent(prompt.name)}`}>
                  <Save />
                  Editar prompt
                </Link>

              </Button>

              <Button asChild variant="default">
                <a href={`https://chat.openai.com/?prompt=${encodeURIComponent(prompt.prompt)}`} target="_blank" rel="noopener noreferrer">
                  <ArrowRightToLine />
                  Ir a ChatGpt
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
