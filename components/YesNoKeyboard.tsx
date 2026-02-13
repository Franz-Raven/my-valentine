import React from "react"

type KeyStatus = "default" | "disabled"

const enabled = new Set(["Y", "E", "S", "N", "O", "ENTER", "⌫"])

function Key({
  label,
  onPress,
  wide,
  status,
}: {
  label: string
  onPress: () => void
  wide?: boolean
  status: KeyStatus
}) {
  const isControl = label === "ENTER" || label === "⌫"

  const bg =
    status === "disabled" ? "bg-[#1a3b52]/60" : "bg-[#2a5874]"
  const bevel =
    status === "disabled" ? "bg-[#132b3b]/60" : "bg-[#1f4359]"
  const text =
    status === "disabled" ? "text-white/25" : "text-white/95"

  return (
    <div className={wide ? "relative min-w-[78px] h-11" : "relative w-10 h-11"}>
      <div className={["absolute inset-0 translate-y-[3px] rounded-md transition", bevel].join(" ")} />
      <button
        type="button"
        onClick={onPress}
        disabled={status === "disabled"}
        className={[
          "relative w-full h-full rounded-md border border-white/10",
          "font-extrabold tracking-[0.5px]",
          "transition",
          status === "disabled" ? "cursor-not-allowed" : "hover:brightness-95 active:translate-y-[1px]",
          isControl ? "text-xs" : "text-sm",
          bg,
          text,
        ].join(" ")}
      >
        {label}
      </button>
    </div>
  )
}

export function YesNoKeyboard({ onKey }: { onKey: (k: string) => void }) {
  const rows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","⌫"],
  ]

  return (
    <div className="w-full max-w-[520px] mt-6 flex justify-center">
      <div className="w-full flex flex-col gap-2.5">
        {rows.map((r, ri) => (
          <div key={ri} className="flex gap-2 justify-center">
            {r.map((k) => {
              const wide = k === "ENTER" || k === "⌫"
              const status: KeyStatus = enabled.has(k) ? "default" : "disabled"
              return (
                <Key
                  key={k}
                  label={k}
                  wide={wide}
                  status={status}
                  onPress={() => onKey(k)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
