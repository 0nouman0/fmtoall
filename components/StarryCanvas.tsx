'use client'

import React, { useEffect, useRef } from 'react'

export default function StarryCanvas() {
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

    // Generate 180 starry particles
    const stars = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw celestial arc horizon glow (Meridian aesthetic)
      const horizonY = height * 0.92
      const grad = ctx.createRadialGradient(
        width / 2,
        horizonY + 300,
        100,
        width / 2,
        horizonY + 300,
        width * 0.85
      )
      grad.addColorStop(0, 'rgba(184, 134, 43, 0.25)')
      grad.addColorStop(0.35, 'rgba(122, 46, 46, 0.12)')
      grad.addColorStop(0.7, 'rgba(46, 74, 122, 0.05)')
      grad.addColorStop(1, 'transparent')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(width / 2, horizonY + 300, width * 0.85, 0, Math.PI * 2)
      ctx.fill()

      // Draw twinkling stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed
        if (star.alpha > 0.95 || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed
        }

        ctx.fillStyle = `rgba(237, 230, 218, ${star.alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

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
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  )
}
