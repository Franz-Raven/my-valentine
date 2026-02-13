import React from "react"

export type YesTileStatus = "empty" | "wrong" | "correct"

const bgBy: Record<YesTileStatus, string> = {
  empty: "bg-[#2a5874]",
  wrong: "bg-[#d84b24]",
  correct: "bg-[#2ecc71]",
}

const bevelBy: Record<YesTileStatus, string> = {
  empty: "bg-[#1f4359]",
  wrong: "bg-[#a02f16]",
  correct: "bg-[#239a57]",
}

const textBy: Record<YesTileStatus, string> = {
  empty: "text-white/95",
  wrong: "text-white/95",
  correct: "text-black/80",
}

function YesTile({ ch, status }: { ch: string; status: YesTileStatus }) {
  return (
    <div className="relative w-14 h-14 sm:w-16 sm:h-16">
      <div className={["absolute inset-0 translate-y-[3px] rounded-md", bevelBy[status]].join(" ")} />
      <div
        className={[
          "relative w-full h-full rounded-md border border-white/10",
          "grid place-items-center select-none uppercase font-extrabold tracking-[1px]",
          bgBy[status],
          textBy[status],
        ].join(" ")}
      >
        <span className="text-2xl sm:text-3xl">{ch}</span>
      </div>
    </div>
  )
}

export function YesNoBoard({
  value,
  shake,
}: {
  value: string
  shake: boolean
}) {
  const target = "YES"
  const chars = [value[0] ?? "", value[1] ?? "", value[2] ?? ""]

  const statuses: YesTileStatus[] = chars.map((c, i) => {
    if (!c) return "empty"
    return c === target[i] ? "correct" : "wrong"
  })

  return (
    <div className="w-full flex justify-center mt-6">
      <div className={["flex gap-[10px]", shake ? "animate-shakeX" : ""].join(" ")}>
        <YesTile ch={chars[0]} status={statuses[0]} />
        <YesTile ch={chars[1]} status={statuses[1]} />
        <YesTile ch={chars[2]} status={statuses[2]} />
      </div>
    </div>
  )
}
