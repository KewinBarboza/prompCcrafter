import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {



  return (
    <div className="container gap-5 flex justify-center items-center w-full h-dvh mx-auto">
      <Button asChild>
        <Link href="/created-prompt">Crear prompt</Link>
      </Button>

      <Button asChild>
        <Link href="/prompt">Ver prompts</Link>
      </Button>
    </div>
  )
}
