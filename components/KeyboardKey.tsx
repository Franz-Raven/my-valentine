import React from "react"

export type KeyStatus = "default" | "absent" | "present" | "correct"

const bgByStatus: Record<KeyStatus, string> = {
  default: "bg-[#193140]",
  absent: "bg-[#203746]",
  present: "bg-[#e3b60a]",
  correct: "bg-[#2ecc71]",
}

const bevelByStatus: Record<KeyStatus, string> = {
  default: "bg-[#132733]",
  absent: "bg-[#162c38]",
  present: "bg-[#c79d08]",
  correct: "bg-[#239a57]",
}

const bevelHoverOverlay: Record<KeyStatus, string> = {
  default: "bg-black/20",
  absent: "bg-black/20",
  present: "bg-black/15",
  correct: "bg-black/15",
}

const textByStatus: Record<KeyStatus, string> = {
  default: "text-white/90",
  absent: "text-white/90",
  present: "text-black/80",
  correct: "text-black/80",
}

export function KeyboardKey({
  label,
  onPress,
  wide,
  status = "default",
}: {
  label: string
  onPress: () => void
  wide?: boolean
  status?: KeyStatus
}) {
  const isControl = label === "ENTER" || label === "⌫"

  return (
    <div className={wide ? "relative min-w-[78px] h-11 group" : "relative w-10 h-11 group"}>
      <div
        className={[
          "absolute inset-0 translate-y-[3px] rounded-md overflow-hidden",
          bevelByStatus[status],
        ].join(" ")}
      >
        <span
          className={[
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
            bevelHoverOverlay[status],
          ].join(" ")}
        />
      </div>

      <button
        type="button"
        onClick={onPress}
        className={[
          "relative w-full h-full overflow-hidden",
          "rounded-md border border-white/10",
          "font-extrabold tracking-[0.5px]",
          "active:translate-y-[1px] transition",
          isControl ? "text-xs" : "text-sm",
          bgByStatus[status],
          textByStatus[status],
        ].join(" ")}
      >
        <span className="relative z-10">{label}</span>
        <span className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-md" />
      </button>
    </div>
  )
}
