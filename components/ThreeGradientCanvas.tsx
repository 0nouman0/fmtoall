'use client'

import React, { useEffect, useRef } from 'react'

export default function ThreeGradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    let t = 0

    const render = () => {
      t += 0.008
      ctx.clearRect(0, 0, width, height)

      // Celestial Violet & Emerald Green Blobs
      // Blob 1: Emerald Green (#10B981)
      const x1 = width * (0.5 + Math.sin(t * 0.7) * 0.25)
      const y1 = height * (0.4 + Math.cos(t * 0.5) * 0.2)
      const r1 = Math.min(width, height) * 0.65
      const g1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, r1)
      g1.addColorStop(0, 'rgba(16, 185, 129, 0.28)')
      g1.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.beginPath()
      ctx.arc(x1, y1, r1, 0, Math.PI * 2)
      ctx.fill()

      // Blob 2: Cosmic Violet (#7B2CBF)
      const x2 = width * (0.3 + Math.cos(t * 0.6) * 0.3)
      const y2 = height * (0.6 + Math.sin(t * 0.8) * 0.25)
      const r2 = Math.min(width, height) * 0.6
      const g2 = ctx.createRadialGradient(x2, y2, 10, x2, y2, r2)
      g2.addColorStop(0, 'rgba(123, 44, 191, 0.28)')
      g2.addColorStop(0.5, 'rgba(123, 44, 191, 0.07)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.beginPath()
      ctx.arc(x2, y2, r2, 0, Math.PI * 2)
      ctx.fill()

      // Blob 3: Vibrant Ultramarine (#3A86FF)
      const x3 = width * (0.7 + Math.sin(t * 0.9) * 0.2)
      const y3 = height * (0.3 + Math.sin(t * 0.4) * 0.3)
      const r3 = Math.min(width, height) * 0.55
      const g3 = ctx.createRadialGradient(x3, y3, 10, x3, y3, r3)
      g3.addColorStop(0, 'rgba(58, 134, 255, 0.22)')
      g3.addColorStop(0.5, 'rgba(58, 134, 255, 0.05)')
      g3.addColorStop(1, 'transparent')
      ctx.fillStyle = g3
      ctx.beginPath()
      ctx.arc(x3, y3, r3, 0, Math.PI * 2)
      ctx.fill()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90"
    />
  )
}
