"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import YooptaEditor, { createYooptaEditor, YooptaContentValue } from "@yoopta/editor"
import { plainText } from "@yoopta/exports"
import Paragraph from "@yoopta/paragraph"
import { Edit, ExternalLink, Pencil, Plus, Save, StickyNote } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

const plugins = [Paragraph]
interface PromptSave {
  id: string
  text: string
  date: Date
  name: string
}

const DEFAULT_VALUE_PROMPT = {
  id: '',
  text: '',
  date: new Date(),
  name: ''
}

export default function Prompt() {
  const editor = useMemo(() => createYooptaEditor(), [])
  const [value, setValue] = useState<YooptaContentValue>()
  const [readOnly, setReadOnly] = useState(true)
  const [name, setName] = useState('')
  const [isEditName, setIsEditName] = useState(false)
  const searchParams = useSearchParams()
  const [promptSave, setPromptSave] = useState<PromptSave>(DEFAULT_VALUE_PROMPT)

  const inputNameRef = useRef<HTMLInputElement>(null)
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
            setPromptSave(findPrompt)

            const textString = findPrompt.text
            setName(findPrompt.name)

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
    editor.readOnly = edit === 'true' ? false : true
    deserializeMarkdown()
  }, [editor, prompt, namePrompt, edit, id])

  const onChange = (value: YooptaContentValue) => {
    setValue(value)
  }

  // function for save prompt in local storage
  const savePrompt = (value: YooptaContentValue, id: string | null) => {
    const editorContent = editor.getPlainText(value)
    const getStorage = localStorage.getItem('prompt')

    if (id && promptSave) {
      const parsed = JSON.parse(getStorage || '')
      const newPrompt = {
        id: id,
        text: editorContent,
        date: promptSave.date,
        name: name
      }

      const addPrompt = parsed.map((item: { id: string }) => item.id === id ? newPrompt : item)
      localStorage.setItem('prompt', JSON.stringify(addPrompt))
      toast.success('Prompt guardado correctamente')
      return
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
    const getStorage = localStorage.getItem('prompt')

    setName(e.target.value)

    if (id) {
      if (promptSave) {
        const parsed = JSON.parse(getStorage || '')

        const newPrompt = {
          id: promptSave.id,
          text: promptSave.text,
          date: promptSave.date,
          name: e.target.value
        }

        const addPrompt = parsed.map((item: { id: string }) => item.id === id ? newPrompt : item)
        localStorage.setItem('prompt', JSON.stringify(addPrompt))

        return
      }
    }
  }

  // function enabled edit name bottom
  const editName = () => {
    setIsEditName(!isEditName)
    inputNameRef.current?.focus()
  }

  const editPrompt = () => {
    setReadOnly(!readOnly)
    editor.readOnly = !readOnly

    if (readOnly) {
      editor.focus()
    } else {
      editor.blur()
    }
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
              <input
                type="text"
                disabled={!isEditName}
                value={name}
                ref={inputNameRef}
                className="text-sm rounded-md p-2 disabled:bg-white bg-neutral-100 w-fit" onChange={updateName} />
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="link" asChild>
              <Link href={`https://chat.openai.com/?prompt=${encodeURIComponent(promptSave.text || !prompt)}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Abrir en ChatGPT
              </Link>
            </Button>
            <Button variant="outline" asChild className="col-span-2" >
              <Link href='/created-prompt'>
                <Plus />
                Crear prompt
              </Link>
            </Button>

            <Button variant="outline" onClick={() => editPrompt()}>
              {readOnly ? <Edit /> : <StickyNote />}
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

      <div className="flex justify-center items-center">
        <YooptaEditor
          editor={editor}
          plugins={plugins}
          placeholder="Type something"
          value={value}
          onChange={onChange}
          autoFocus={readOnly ? false : true}
          style={{
            backgroundColor: readOnly ? 'white' : '#F9FAFB',
            height: "calc(100dvh - 80px)",
            minWidth: "56rem",
            paddingBlock: 20,
            paddingInline: 20,
            borderRadius: 15
          }}
        />
      </div>
    </>

  )
}
