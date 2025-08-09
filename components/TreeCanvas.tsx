'use client'

import { useEffect, useRef, useState } from 'react'
import p5 from 'p5'
import { Camera } from '@/lib/camera'

export default function TreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showFPS, setShowFPS] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  const p5Instance = useRef<p5 | null>(null)
  const cameraRef = useRef<Camera | null>(null)
  const isInteractingWithUI = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return
    if (p5Instance.current) return

    const sketch = (p: p5) => {
      let fps = 0
      let frameCounter = 0
      let lastTime = 0
      let testNodes: { x: number; y: number; r: number; color: string }[] = []

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight - 56)
        canvas.parent(containerRef.current!)
        
        cameraRef.current = new Camera(p.width, p.height)
        
        for (let i = 0; i < 50; i++) {
          testNodes.push({
            x: p.random(-400, 400),
            y: p.random(-400, 400),
            r: p.random(5, 20),
            color: `hsl(${p.random(360)}, 70%, 60%)`
          })
        }
        
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
        
        if (cameraRef.current) {
          cameraRef.current.update()
          const transform = cameraRef.current.getTransform()
          setZoomLevel(cameraRef.current.getZoomPercentage())
          
          p.push()
          p.translate(p.width / 2 + transform.panX, p.height / 2 + transform.panY)
          p.scale(transform.zoom)
          
          p.stroke(100)
          p.strokeWeight(1 / transform.zoom)
          p.line(-1000, 0, 1000, 0)
          p.line(0, -1000, 0, 1000)
          
          testNodes.forEach(node => {
            p.fill(node.color)
            p.noStroke()
            p.circle(node.x, node.y, node.r * 2)
          })
          
          const animatedNode = testNodes[0]
          if (animatedNode) {
            const time = p.millis() * 0.001
            const pulseSize = animatedNode.r * (1 + 0.3 * Math.sin(time * 3))
            p.fill(255, 100)
            p.circle(animatedNode.x, animatedNode.y, pulseSize * 2)
          }
          
          p.pop()
        }
        
        if (showFPS) {
          p.push()
          p.fill(255)
          p.noStroke()
          p.textAlign(p.LEFT, p.TOP)
          p.textSize(14)
          p.text(`FPS: ${Math.round(p.frameRate())}`, 10, 10)
          p.pop()
        }
      }

      p.mouseWheel = (event: any) => {
        if (cameraRef.current && !isInteractingWithUI.current) {
          cameraRef.current.handleWheel(event.delta, p.mouseX, p.mouseY)
        }
        return false
      }
      
      p.mousePressed = () => {
        if (cameraRef.current && !isInteractingWithUI.current) {
          cameraRef.current.startDrag(p.mouseX, p.mouseY)
          setIsDragging(true)
        }
      }
      
      p.mouseDragged = () => {
        if (cameraRef.current && !isInteractingWithUI.current) {
          cameraRef.current.updateDrag(p.mouseX, p.mouseY)
        }
        return false
      }
      
      p.mouseReleased = () => {
        if (cameraRef.current) {
          cameraRef.current.endDrag()
          setIsDragging(false)
        }
      }
      
      p.doubleClicked = () => {
        if (cameraRef.current && !isInteractingWithUI.current) {
          cameraRef.current.handleDoubleClick(p.mouseX, p.mouseY)
        }
        return false
      }
      
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight - 56)
        if (cameraRef.current) {
          cameraRef.current.updateDimensions(p.width, p.height)
        }
      }
    }

    p5Instance.current = new p5(sketch)

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove()
        p5Instance.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.zoomInCenter()
    }
  }
  
  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.zoomOutCenter()
    }
  }
  
  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.reset()
    }
  }

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)]">
      <div 
        ref={containerRef} 
        className="w-full h-full" 
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      <div 
        className="absolute top-4 right-4 flex flex-col gap-2"
        onMouseEnter={() => { isInteractingWithUI.current = true }}
        onMouseLeave={() => { isInteractingWithUI.current = false }}
      >
        <button
          onClick={() => setShowFPS(!showFPS)}
          className="px-3 py-1 text-sm bg-background/80 backdrop-blur rounded-md border hover:bg-background/90 transition-colors"
          aria-label="Toggle FPS counter"
        >
          FPS {showFPS ? 'ON' : 'OFF'}
        </button>
        
        <div className="flex flex-col gap-1 bg-background/80 backdrop-blur rounded-md border p-2">
          <button
            onClick={handleZoomIn}
            className="px-3 py-1 text-sm hover:bg-background/90 rounded transition-colors"
            aria-label="Zoom in"
          >
            + Zoom In
          </button>
          <button
            onClick={handleZoomOut}
            className="px-3 py-1 text-sm hover:bg-background/90 rounded transition-colors"
            aria-label="Zoom out"
          >
            − Zoom Out
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm hover:bg-background/90 rounded transition-colors"
            aria-label="Reset view"
          >
            ↺ Reset
          </button>
          <div className="text-xs text-center mt-1 text-muted-foreground">
            {zoomLevel}%
          </div>
        </div>
      </div>
      
      <div 
        className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur rounded-md border px-3 py-2"
        onMouseEnter={() => { isInteractingWithUI.current = true }}
        onMouseLeave={() => { isInteractingWithUI.current = false }}
      >
        <div>Scroll: Zoom</div>
        <div>Drag: Pan</div>
        <div>Double-click: Zoom in</div>
      </div>
    </div>
  )
}