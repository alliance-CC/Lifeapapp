"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"]

const shiftData: Record<string, { type: "work" | "off" | "holiday"; start?: string; end?: string }> = {
  "2024-06-03": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-04": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-05": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-06": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-07": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-10": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-11": { type: "work", start: "10:00", end: "19:00" },
  "2024-06-12": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-13": { type: "off" },
  "2024-06-14": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-17": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-18": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-19": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-20": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-21": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-24": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-25": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-26": { type: "work", start: "09:00", end: "18:00" },
  "2024-06-27": { type: "off" },
  "2024-06-28": { type: "work", start: "09:00", end: "18:00" },
}

export default function ShiftsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 1))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getDateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

  const shiftTypeStyle = {
    work: "bg-violet-500/20 border-violet-500/30 text-violet-300",
    off: "bg-red-500/10 border-red-500/20 text-red-400",
    holiday: "bg-gray-500/10 border-gray-500/20 text-gray-500",
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-violet-400" />
          シフト管理
        </h1>
        <p className="text-white/50 text-sm mt-1">スプレッドシートより自動取得</p>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white font-bold text-lg">
            {year}年 {month + 1}月
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {daysOfWeek.map((d, i) => (
            <div
              key={d}
              className={cn(
                "text-center text-xs font-medium py-2",
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-white/40"
              )}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const dateKey = getDateKey(day)
            const shift = shiftData[dateKey]
            const isToday = dateKey === "2024-06-25"
            const dow = (firstDay + i) % 7

            return (
              <motion.div
                key={day}
                className={cn(
                  "relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs cursor-pointer",
                  isToday ? "bg-violet-600/30 border border-violet-500/50" : "hover:bg-white/5",
                  shift ? `border ${shiftTypeStyle[shift.type]}` : ""
                )}
                whileHover={{ scale: 1.05 }}
              >
                <span
                  className={cn(
                    "font-medium",
                    isToday
                      ? "text-violet-300"
                      : dow === 0
                      ? "text-red-400"
                      : dow === 6
                      ? "text-blue-400"
                      : "text-white/80"
                  )}
                >
                  {day}
                </span>
                {shift?.type === "work" && (
                  <span className="text-violet-300/60 text-[9px] leading-none mt-0.5 hidden sm:block">
                    {shift.start}
                  </span>
                )}
                {shift?.type === "off" && (
                  <span className="text-red-400/80 text-[9px] leading-none mt-0.5">休</span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
          {[
            { type: "work", label: "出勤" },
            { type: "off", label: "休日" },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-1.5">
              <div
                className={`w-3 h-3 rounded border ${
                  shiftTypeStyle[item.type as keyof typeof shiftTypeStyle]
                }`}
              />
              <span className="text-white/40 text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Today's shift detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-violet-600/10 border border-violet-500/20 rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <Clock className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <p className="text-white font-medium">今日のシフト</p>
          <p className="text-violet-300 text-sm">09:00 〜 18:00（通常勤務）</p>
        </div>
      </motion.div>
    </div>
  )
}
