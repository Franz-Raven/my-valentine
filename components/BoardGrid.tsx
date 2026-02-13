import React from "react"
import { Tile, TileStatus, TileTone } from "./Tile"

type Reveal = {
  active: boolean
  letters: string[][]
  flip: boolean[][]
  delayMs: number[][]
  toneMap?: (TileTone | "normal")[][]
  hideRowsFrom?: number | null
}

export function BoardGrid({
  letters,
  statuses,
  reveal,
}: {
  letters: string[][]
  statuses: TileStatus[][]
  reveal?: Reveal
}) {
  const hideFrom = reveal?.active ? (reveal.hideRowsFrom ?? null) : null

  return (
    <div className="w-full max-w-[520px] mt-2 flex justify-center">
      <div className="grid grid-cols-5 gap-[10px] p-2">
        {letters.flatMap((row, r) => {
          if (hideFrom !== null && r >= hideFrom) return []
          return row.map((ch, c) => (
            <Tile
              key={`${r}-${c}`}
              letter={ch}
              status={statuses[r]?.[c] ?? "empty"}
              flip={reveal?.active ? !!reveal.flip?.[r]?.[c] : false}
              delayMs={reveal?.active ? reveal.delayMs?.[r]?.[c] ?? 0 : 0}
              revealLetter={reveal?.active ? reveal.letters?.[r]?.[c] ?? ch : ch}
              tone={
                reveal?.active
                  ? ((reveal.toneMap?.[r]?.[c] as any) ?? "normal")
                  : "normal"
              }
            />
          ))
        })}
      </div>
    </div>
  )
}
