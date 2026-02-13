"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { BoardGrid } from "@/components/BoardGrid"
import { Keyboard } from "@/components/Keyboard"
import { ValentineRow } from "@/components/ValentineRow"
import { YesNoBoard } from "@/components/YesNoBoard"
import { YesNoKeyboard } from "@/components/YesNoKeyboard"
import { FlowerScene } from "@/components/FlowerScene"
import type { TileStatus, TileTone } from "@/components/Tile"
import type { KeyStatus } from "@/components/KeyboardKey"

const ROWS = 6
const COLS = 5
const TARGET = "WILL_"
const PRESENT_POOL = "WILLVALENTINE"

function isLetter(k: string) {
  return /^[A-Z]$/.test(k)
}

function evaluateGuess(guess: string, target: string): TileStatus[] {
  const g = guess.split("")
  const t = target.split("")
  const pool = new Set(PRESENT_POOL.split(""))
  const res: TileStatus[] = Array(g.length).fill("absent")

  for (let i = 0; i < g.length; i++) {
    if (g[i] === t[i]) {
      res[i] = "correct"
      continue
    }
    if (pool.has(g[i])) {
      res[i] = "present"
      continue
    }
    res[i] = "absent"
  }
  return res
}

function upgradeKeyStatus(prev: KeyStatus | undefined, next: KeyStatus): KeyStatus {
  const rank: Record<KeyStatus, number> = { default: 0, absent: 1, present: 2, correct: 3 }
  const p = prev ?? "default"
  return rank[next] > rank[p] ? next : p
}

function makeLetters() {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ""))
}

function makeStatuses(fill: TileStatus = "empty") {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => fill))
}

function makeBoolGrid(v: boolean) {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => v))
}

function makeNumGrid(v: number) {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => v))
}

type GiveUpStage = "none" | "fading" | "revealing" | "done"
type Phase = "wordle" | "question" | "flower"

const TILE_STAGGER_MS = 90
const FLIP_MS = 520
const ROW_GAP_MS = 20

export default function Page() {
  const [phase, setPhase] = useState<Phase>("wordle")

  const [letters, setLetters] = useState<string[][]>(() => makeLetters())
  const [statuses, setStatuses] = useState<TileStatus[][]>(() => makeStatuses())
  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)
  const [keyStatuses, setKeyStatuses] = useState<Record<string, KeyStatus>>({})

  const [gaveUpStage, setGaveUpStage] = useState<GiveUpStage>("none")
  const [showValentine, setShowValentine] = useState(false)

  const [revealActive, setRevealActive] = useState(false)
  const [revealFlip, setRevealFlip] = useState<boolean[][]>(() => makeBoolGrid(false))
  const [revealDelay, setRevealDelay] = useState<number[][]>(() => makeNumGrid(0))
  const [toneMap, setToneMap] = useState<(TileTone | "normal")[][]>(() =>
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "normal"))
  )
  const [hideRowsFrom, setHideRowsFrom] = useState<number | null>(null)

  const [answer, setAnswer] = useState("")
  const [shake, setShake] = useState(false)
  const shakeTimer = useRef<number | null>(null)

  const gameOver = row >= ROWS || gaveUpStage !== "none"

  const resetAll = () => {
    setPhase("wordle")
    setLetters(makeLetters())
    setStatuses(makeStatuses())
    setRow(0)
    setCol(0)
    setKeyStatuses({})
    setGaveUpStage("none")
    setShowValentine(false)
    setRevealActive(false)
    setRevealFlip(makeBoolGrid(false))
    setRevealDelay(makeNumGrid(0))
    setToneMap(Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "normal")))
    setHideRowsFrom(null)
    setAnswer("")
    setShake(false)
  }

  const onKey = (k: string) => {
    if (phase !== "wordle") return
    if (gameOver) return

    if (k === "⌫") {
      if (col <= 0) return
      const nextLetters = letters.map((r) => r.slice())
      nextLetters[row][col - 1] = ""
      setLetters(nextLetters)
      setCol(col - 1)
      return
    }

    if (k === "ENTER") {
      if (col < COLS) return

      const guess = letters[row].join("").toUpperCase()
      const evalRow = evaluateGuess(guess, TARGET)

      const nextStatuses = statuses.map((r) => r.slice())
      nextStatuses[row] = evalRow
      setStatuses(nextStatuses)

      setKeyStatuses((prev) => {
        const next = { ...prev }
        for (let i = 0; i < COLS; i++) {
          const ch = guess[i]
          if (!isLetter(ch)) continue
          const s = evalRow[i]
          const ks: KeyStatus = s === "correct" ? "correct" : s === "present" ? "present" : "absent"
          next[ch] = upgradeKeyStatus(next[ch], ks)
        }
        return next
      })

      setRow(row + 1)
      setCol(0)
      return
    }

    const key = k.toUpperCase()
    if (!isLetter(key)) return
    if (col >= COLS) return

    const nextLetters = letters.map((r) => r.slice())
    nextLetters[row][col] = key
    setLetters(nextLetters)

    const nextStatuses = statuses.map((r) => r.slice())
    nextStatuses[row][col] = "filled"
    setStatuses(nextStatuses)

    setCol(col + 1)
  }

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (phase === "wordle") {
        const k = e.key
        if (k === "Enter") return onKey("ENTER")
        if (k === "Backspace") return onKey("⌫")
        if (/^[a-zA-Z]$/.test(k)) return onKey(k.toUpperCase())
        return
      }

      if (phase === "question") {
        const k = e.key
        if (k === "Enter") return onAnswerKey("ENTER")
        if (k === "Backspace") return onAnswerKey("⌫")
        if (/^[a-zA-Z]$/.test(k)) return onAnswerKey(k.toUpperCase())
        return
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [phase, row, col, letters, statuses, gameOver, answer])

  const revealMessage = useMemo(() => {
    const msg = makeLetters()
    msg[0] = ["W", "I", "L", "L", ""]
    msg[1] = ["Y", "O", "U", "", ""]
    msg[2] = ["B", "E", "", "", ""]
    msg[3] = ["M", "Y", "", "", ""]
    return msg
  }, [])

  const startGiveUp = () => {
    if (phase !== "wordle") return
    if (gaveUpStage !== "none") return

    setGaveUpStage("fading")

    window.setTimeout(() => {
      setGaveUpStage("revealing")
      setRevealActive(true)
      setShowValentine(false)
      setHideRowsFrom(null)

      setRevealFlip(makeBoolGrid(false))
      setRevealDelay(makeNumGrid(0))
      setToneMap(Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "normal")))

      const sleep = (ms: number) => new Promise((res) => window.setTimeout(res, ms))

      const run = async () => {
        for (let r = 0; r < 4; r++) {
          setToneMap((prev) => {
            const next = prev.map((rr) => rr.slice())
            for (let c = 0; c < COLS; c++) next[r][c] = "revealRed"
            return next
          })

          setRevealDelay(() => {
            const d = makeNumGrid(0)
            for (let c = 0; c < COLS; c++) d[r][c] = c * TILE_STAGGER_MS
            return d
          })

          setRevealFlip((prev) => {
            const next = prev.map((rr) => rr.slice())
            for (let c = 0; c < COLS; c++) next[r][c] = true
            return next
          })

          const rowTime = (COLS - 1) * TILE_STAGGER_MS + FLIP_MS + ROW_GAP_MS
          await sleep(rowTime)
        }

        setHideRowsFrom(4)
        setShowValentine(true)
        setGaveUpStage("done")
      }

      run()
    }, 420)
  }

  useEffect(() => {
    if (gaveUpStage !== "done") return
    const t = window.setTimeout(() => {
      setPhase("question")
      setAnswer("")
      setShake(false)
    }, 5000)
    return () => window.clearTimeout(t)
  }, [gaveUpStage])

  const onAnswerKey = (k: string) => {
    const allowed = new Set(["Y", "E", "S", "N", "O"])

    if (k === "⌫") {
      if (!answer) return
      setAnswer(answer.slice(0, -1))
      return
    }

    if (k === "ENTER") {
      const v = answer.padEnd(3, "")
      const ok = v[0] === "Y" && v[1] === "E" && v[2] === "S"
      if (!ok) {
        setShake(true)
        if (shakeTimer.current) window.clearTimeout(shakeTimer.current)
        shakeTimer.current = window.setTimeout(() => setShake(false), 450)
        return
      }
      setPhase("flower")
      return
    }

    if (!allowed.has(k)) return
    if (answer.length >= 3) return
    setAnswer((answer + k).toUpperCase())
  }

  const bgClass =
    phase === "wordle" && gaveUpStage === "none"
      ? "bg-[radial-gradient(900px_600px_at_30%_15%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,#071a25,#0b2534)]"
      : "bg-[radial-gradient(900px_600px_at_30%_15%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,#3a0f16,#7b1f21)]"

  const keyboardWrapClass =
    gaveUpStage === "fading"
      ? "opacity-0 transition-opacity duration-400"
      : gaveUpStage === "none"
        ? "opacity-100 transition-opacity duration-200"
        : "hidden"

  if (phase === "flower") {
    return (
      <main
        className={[
          "min-h-screen flex flex-col items-center justify-start px-[14px] py-[18px]",
          "text-white/90 transition-colors duration-500",
          bgClass,
        ].join(" ")}
      >
        <FlowerScene />
      </main>
    )
  }

  if (phase === "question") {
    return (
      <main
        className={[
          "min-h-screen flex flex-col items-center justify-center px-[14px] py-[18px]",
          "text-white/90 transition-colors duration-500",
          bgClass,
        ].join(" ")}
      >
        <header className="w-full max-w-[520px] text-center px-0.5 pt-1 pb-2">
          <div className="font-extrabold tracking-[.4px] text-[22px] sm:text-[26px]">
            Will you be my Valentine?
          </div>
          <div className="mt-2 text-[13px] text-white/70">Type your answer...</div>
        </header>

        <YesNoBoard value={answer} shake={shake} />

        <YesNoKeyboard onKey={onAnswerKey} />

        <div className="w-full max-w-[520px] mt-6 text-center text-[12px] text-white/60">
          Hint: Already there hehe
        </div>
      </main>
    )
  }

  return (
    <main
      className={[
        "min-h-screen flex flex-col items-center justify-start px-[14px] py-[18px]",
        "text-white/90 transition-colors duration-500",
        bgClass,
      ].join(" ")}
    >
      <header className="w-full max-w-[520px] text-center px-0.5 pt-1 pb-4">
        <div className="font-extrabold tracking-[.4px] text-[50px]">Wordle</div>
        <div className="text-[13px] text-white/60">Guess the word!</div>
      </header>

      <BoardGrid
        letters={letters}
        statuses={statuses}
        reveal={
          revealActive
            ? {
                active: true,
                letters: revealMessage,
                flip: revealFlip,
                delayMs: revealDelay,
                toneMap,
                hideRowsFrom,
              }
            : undefined
        }
      />

      <div className={keyboardWrapClass}>
        <Keyboard onKey={onKey} keyStatuses={keyStatuses} />
      </div>

      {row >= ROWS && gaveUpStage === "none" && (
        <div className="w-full max-w-[520px] mt-12 flex gap-3 justify-center">
          <button
            type="button"
            onClick={resetAll}
            className="h-11 px-5 rounded-2xl font-extrabold border border-white/10 bg-white/10 hover:bg-white/15 transition"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={startGiveUp}
            className="h-11 px-5 rounded-2xl font-extrabold border border-white/10 bg-black/20 hover:bg-red-600 hover:border-red-300/60 transition"
          >
            Give Up
          </button>
        </div>
      )}

      <ValentineRow show={showValentine} text="VALENTINE?" />
    </main>
  )
}
