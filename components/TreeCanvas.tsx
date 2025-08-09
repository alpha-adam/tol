'use client'

import { useEffect, useRef, useState } from 'react'
import p5 from 'p5'

export default function TreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showFPS, setShowFPS] = useState(false)
  const p5Instance = useRef<p5 | null>(null)

  useEffect(() => {
    if (!containerRef.current || p5Instance.current) return

    const sketch = (p: p5) => {
      let fps = 0
      let frameCounter = 0
      let lastTime = 0
      let circleX = 0
      let circleY = 0
      let velocity = { x: 2, y: 3 }
      const circleRadius = 30

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight - 56)
        canvas.parent(containerRef.current!)
        
        circleX = p.width / 2
        circleY = p.height / 2
        
        p.frameRate(60)
        lastTime = p.millis()
      }

      p.draw = () => {
        p.background(20)
        
        const currentTime = p.millis()
        frameCounter++
        if (currentTime - lastTime >= 1000) {
          fps = frameCounter
          frameCounter = 0
          lastTime = currentTime
        }
        
        circleX += velocity.x
        circleY += velocity.y
        
        if (circleX - circleRadius <= 0 || circleX + circleRadius >= p.width) {
          velocity.x *= -1
          circleX = p.constrain(circleX, circleRadius, p.width - circleRadius)
        }
        if (circleY - circleRadius <= 0 || circleY + circleRadius >= p.height) {
          velocity.y *= -1
          circleY = p.constrain(circleY, circleRadius, p.height - circleRadius)
        }
        
        const hue = (p.frameCount * 2) % 360
        p.colorMode(p.HSB)
        p.fill(hue, 70, 90)
        p.noStroke()
        p.circle(circleX, circleY, circleRadius * 2)
        
        if (showFPS) {
          p.colorMode(p.RGB)
          p.fill(255)
          p.textAlign(p.LEFT, p.TOP)
          p.textSize(14)
          p.text(`FPS: ${fps}`, 10, 10)
        }
      }

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight - 56)
        circleX = p.width / 2
        circleY = p.height / 2
      }
    }

    p5Instance.current = new p5(sketch)

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove()
        p5Instance.current = null
      }
    }
  }, [showFPS])

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)]">
      <div ref={containerRef} className="w-full h-full" />
      <button
        onClick={() => setShowFPS(!showFPS)}
        className="absolute top-4 right-4 px-3 py-1 text-sm bg-background/80 backdrop-blur rounded-md border hover:bg-background/90 transition-colors"
        aria-label="Toggle FPS counter"
      >
        FPS {showFPS ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}