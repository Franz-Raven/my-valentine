import React from "react"

function FireworksBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="fw fw-1" />
      <div className="fw fw-2" />
      <div className="fw fw-3" />
      <div className="fw fw-4" />
      <div className="fw fw-5" />
      <div className="fw fw-6" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,105,180,0.12),transparent_70%)]" />
    </div>
  )
}

export function FlowerScene() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-[14px] py-[18px] overflow-hidden">
      <FireworksBg />

      <div className="relative z-10 text-center space-y-2">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-[1px] text-white drop-shadow-[0_0_18px_rgba(255,105,180,0.45)] animate-floatSoft">
          I LOVE YOU LOVEYY💗💗💗!!!
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-[1px] text-white drop-shadow-[0_0_18px_rgba(255,105,180,0.45)] animate-floatSoft">
          DATE TAU MONDAY NEXT WEEK 11AM SHARP
        </div>
      </div>

      <div className="relative z-10 mt-10 w-full max-w-[520px] flex justify-center">
        <img
          src="/flowers.png"
          alt="Pink roses"
          className="w-full max-w-[420px] h-auto rounded-2xl shadow-[0_20px_80px_rgba(255,105,180,0.35)]"
          draggable={false}
        />
      </div>
    </div>
  )
}
