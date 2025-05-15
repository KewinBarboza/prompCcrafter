"use client"

import { Button } from "@/components/ui/button"
import YooptaEditor, { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor"
import { markdown, plainText } from "@yoopta/exports"
import Paragraph from "@yoopta/paragraph"
import { useEffect, useMemo, useState } from "react"

const plugins = [Paragraph]

export default function Prompt() {
  const editor = useMemo(() => createYooptaEditor(), [])
  const [value, setValue] = useState<YooptaContentValue>()
  const [readOnly, setReadOnly] = useState(true)

  useEffect(() => {
    deserializeMarkdown()
  }, [])

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(value)
  }

  const deserializeMarkdown = () => {
    const textString = '# First title'
    const value = plainText.deserialize(editor, textString)

    editor.setEditorValue(value)
  }

  return (
    <>
      {/* <Button onClick={() => setReadOnly(!readOnly)}>Editar {JSON.stringify(readOnly)}</Button> */}
      {/* <Button onClick={() => deserializeMarkdown()}>Des</Button> */}
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        placeholder="Type something"
        value={value}
        readOnly={true}
        onChange={onChange}
        // autoFocus
        style={{
          // backgroundColor: "red",
          // height: "calc(100dvh - 60px)",
          // width: "100%",
          // borderWidth: 1.5,
          // borderColor: "#f0f0f0",
          // borderRadius: 15
        }}
      />
    </>

  )
}
