import React from "react"

export function ValentineRow({
  show,
  text = "VALENTINE?",
}: {
  show: boolean
  text?: string
}) {
  const chars = text.split("")

  return (
    <div
      className={[
        "w-full max-w-[520px] mt-1 flex justify-center",
        "transition-all duration-500",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
      ].join(" ")}
    >
      <div className="flex gap-[10px]">
        {chars.map((ch, i) => (
          <div key={i} className="relative w-14 h-14 sm:w-16 sm:h-16">
            <div className="absolute inset-0 translate-y-[3px] rounded-md bg-[#a02f16]" />
            <div className="relative w-full h-full rounded-md border border-white/10 bg-[#d84b24] grid place-items-center">
              <span className="font-extrabold text-white/95 text-2xl sm:text-3xl uppercase tracking-[1px]">
                {ch}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
