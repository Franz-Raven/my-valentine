import React from "react"
import { KeyboardKey, KeyStatus } from "./KeyboardKey"

const ROWS: string[][] = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
]

export function Keyboard({
  onKey,
  keyStatuses,
}: {
  onKey: (k: string) => void
  keyStatuses: Record<string, KeyStatus>
}) {
  return (
    <div className="w-full max-w-[520px] mt-5 flex justify-center">
      <div className="w-full flex flex-col gap-2.5">
        {ROWS.map((row, i) => (
          <div key={i} className="flex justify-center gap-2">
            {row.map((k) => (
              <KeyboardKey
                key={k}
                label={k}
                wide={k === "ENTER" || k === "⌫"}
                status={keyStatuses[k] ?? "default"}
                onPress={() => onKey(k)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
