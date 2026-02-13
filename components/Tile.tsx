import React from "react"

export type TileStatus = "empty" | "filled" | "absent" | "present" | "correct"
export type TileTone = "normal" | "revealRed"

const bgByStatus: Record<TileStatus, string> = {
  empty: "bg-[#1b3240]/75",
  filled: "bg-[#1b3240]",
  absent: "bg-[#203746]",
  present: "bg-[#e3b60a]",
  correct: "bg-[#2ecc71]",
}

const bevelByStatus: Record<TileStatus, string> = {
  empty: "bg-[#132733]",
  filled: "bg-[#132733]",
  absent: "bg-[#162c38]",
  present: "bg-[#c79d08]",
  correct: "bg-[#239a57]",
}

const textByStatus: Record<TileStatus, string> = {
  empty: "text-white/90",
  filled: "text-white/90",
  absent: "text-white/90",
  present: "text-black/80",
  correct: "text-black/80",
}

const revealRedBg = "bg-[#d84b24]"
const revealRedBevel = "bg-[#a02f16]"
const revealRedDarkBg = "bg-[#a3311b]"
const revealRedDarkBevel = "bg-[#7a1f12]"
const revealRedText = "text-white/95"

function Face({
  bgClass,
  bevelClass,
  textClass,
  letter,
  rotated,
}: {
  bgClass: string
  bevelClass: string
  textClass: string
  letter: string
  rotated?: boolean
}) {
  return (
    <div
      className={[
        "absolute inset-0",
        rotated ? "rotate-x-180" : "",
      ].join(" ")}
      style={{
        backfaceVisibility: "hidden",
        transform: rotated ? "rotateX(180deg)" : "rotateX(0deg)",
      }}
    >
      <div className="relative w-full h-full">
        <div className={["absolute inset-0 translate-y-[3px] rounded-md", bevelClass].join(" ")} />
        <div
          className={[
            "relative w-full h-full rounded-md border border-white/10",
            "grid place-items-center select-none uppercase font-extrabold tracking-[1px]",
            bgClass,
            textClass,
          ].join(" ")}
        >
          <span className="text-2xl sm:text-3xl">{letter}</span>
        </div>
      </div>
    </div>
  )
}

export function Tile({
  letter,
  status,
  flip,
  delayMs,
  revealLetter,
  tone = "normal",
}: {
  letter: string
  status: TileStatus
  flip?: boolean
  delayMs?: number
  revealLetter?: string
  tone?: TileTone
}) {
  const frontLetter = letter ?? ""
  const backLetter = revealLetter ?? frontLetter

  const isBlankBack = tone === "revealRed" && !backLetter

  const frontBg = tone === "revealRed" ? revealRedBg : bgByStatus[status]
  const frontBevel = tone === "revealRed" ? revealRedBevel : bevelByStatus[status]
  const frontText = tone === "revealRed" ? revealRedText : textByStatus[status]

  const backBg =
    tone === "revealRed"
      ? isBlankBack
        ? revealRedDarkBg
        : revealRedBg
      : bgByStatus[status]

  const backBevel =
    tone === "revealRed"
      ? isBlankBack
        ? revealRedDarkBevel
        : revealRedBevel
      : bevelByStatus[status]

  const backText = tone === "revealRed" ? revealRedText : textByStatus[status]

  return (
    <div className="relative w-14 h-14 sm:w-16 sm:h-16" style={{ perspective: 900 }}>
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 520ms cubic-bezier(.2,.8,.2,1)",
          transform: flip ? "rotateX(180deg)" : "rotateX(0deg)",
          transitionDelay: `${delayMs ?? 0}ms`,
        }}
      >
        <Face bgClass={frontBg} bevelClass={frontBevel} textClass={frontText} letter={frontLetter} />
        <Face bgClass={backBg} bevelClass={backBevel} textClass={backText} letter={backLetter} rotated />
      </div>
    </div>
  )
}
