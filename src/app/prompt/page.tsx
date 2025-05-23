"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import YooptaEditor, { createYooptaEditor, YooptaContentValue } from "@yoopta/editor"
import { plainText } from "@yoopta/exports"
import Paragraph from "@yoopta/paragraph"
import { Edit, ExternalLink, Pencil, Plus, Save } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

const plugins = [Paragraph]

export default function Prompt() {
  const editor = useMemo(() => createYooptaEditor(), [])
  const [value, setValue] = useState<YooptaContentValue>()
  const [readOnly, setReadOnly] = useState(true)
  const [name, setName] = useState('')
  const [isEditName, setIsEditName] = useState(false)
  const searchParams = useSearchParams()

  const prompt = searchParams.get('prompt')
  const edit = searchParams.get('edit')
  const namePrompt = searchParams.get('name')
  const id = searchParams.get('id')

  useEffect(() => {
    const deserializeMarkdown = () => {
      if (id) {
        const getStorage = localStorage.getItem('prompt')
        if (getStorage) {
          const parsed = JSON.parse(getStorage)
          const findPrompt = parsed.find((item: { id: string }) => item.id === id)

          if (findPrompt) {
            const textString = findPrompt.text
            const value = plainText.deserialize(editor, textString)
            editor.setEditorValue(value)
          }
        }

        return
      }

      const textString = ''
      const value = plainText.deserialize(editor, prompt || textString)
      editor.setEditorValue(value)
    }
    setName(namePrompt || '')
    setReadOnly(edit === 'true' ? false : true)
    deserializeMarkdown()
  }, [editor, prompt, namePrompt, edit, id])

  const onChange = (value: YooptaContentValue) => {
    setValue(value)
  }

  // function for save prompt in local storage
  const savePrompt = (value: YooptaContentValue, id: string | null) => {
    const editorContent = editor.getPlainText(value)
    const getStorage = localStorage.getItem('prompt')

    if (id) {
      const findPrompt = JSON.parse(getStorage || '').find((item: { id: string }) => item.id === id)
      if (findPrompt) {
        const parsed = JSON.parse(getStorage || '')
        const newPrompt = {
          id: id,
          text: editorContent,
          date: findPrompt.date,
          name: name
        }

        const addPrompt = parsed.map((item: { id: string }) => item.id === id ? newPrompt : item)
        localStorage.setItem('prompt', JSON.stringify(addPrompt))

        return
      }
    }

    if (getStorage) {
      const parsed = JSON.parse(getStorage)
      const date = new Date()

      const newPrompt = {
        id: crypto.randomUUID(),
        text: editorContent,
        date: date,
        name: name
      }

      const addPrompt = parsed.concat(newPrompt)
      localStorage.setItem('prompt', JSON.stringify(addPrompt))

      return
    }

    localStorage.setItem('prompt', JSON.stringify([
      {
        id: crypto.randomUUID(),
        date: new Date(),
        text: editorContent,
        name: name
      }
    ]))
  }

  // function update name prompt
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  // function enabled edit name bottom
  const editName = () => {
    setIsEditName(!isEditName)
  }


  return (
    <>
      <div className="flex justify-between items-center gap-2 my-4">
        <SidebarTrigger />
        <div className="flex justify-between items-center gap-2 w-full ms-4">
          <div>
            <div className="flex items-center w-fit">
              <Button variant="ghost" onClick={editName} className="me-2">
                <Pencil size={18} />
              </Button>
              <input type="text" disabled={isEditName} value={name} className="text-sm rounded-md p-2 disabled:bg-white bg-neutral-100 w-fit" onChange={updateName} />
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="link">
              <ExternalLink />
              Abrir en ChatGPT
            </Button>
            <Button variant="outline" asChild className="col-span-2" >
              <Link href='/created-prompt'>
                <Plus />
                Crear prompt
              </Link>
            </Button>

            <Button variant="outline" onClick={() => setReadOnly(!readOnly)}>
              <Edit />
              {readOnly ? 'Editar' : 'Vista previa'}
            </Button>

            <Button
              className="ms-5"
              onClick={() => value && savePrompt(value, id)}
              disabled={!value}
            >
              <Save />
              Guardar
            </Button>
          </div>
        </div>
      </div>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        placeholder="Type something"
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        autoFocus={readOnly ? false : true}
        style={{
          backgroundColor: "#f1f1f1",
          height: "calc(100dvh - 80px)",
          width: "100%",
          paddingBlock: 20,
          paddingInline: 20,
          borderRadius: 15
        }}
      />
    </>

  )
}
