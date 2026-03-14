export interface CameraState {
  zoom: number
  panX: number
  panY: number
  targetZoom: number
  targetPanX: number
  targetPanY: number
  isDragging: boolean
  lastMouseX: number
  lastMouseY: number
  velocityX: number
  velocityY: number
}

export class Camera {
  private state: CameraState
  private readonly minZoom = 0.1
  private readonly maxZoom = 10
  private readonly zoomSpeed = 0.003
  private readonly panSpeed = 1
  private readonly friction = 0.88
  private readonly lerpFactor = 0.18
  private readonly inertiaScale = 0.15
  private readonly maxVelocity = 10
  private width: number
  private height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.state = {
      zoom: 1,
      panX: 0,
      panY: 0,
      targetZoom: 1,
      targetPanX: 0,
      targetPanY: 0,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
      velocityX: 0,
      velocityY: 0,
    }
  }

  updateDimensions(width: number, height: number) {
    this.width = width
    this.height = height
  }

  private clampZoom(value: number) {
    return Math.min(Math.max(value, this.minZoom), this.maxZoom)
  }

  private worldFromScreen(
    screenX: number,
    screenY: number,
    zoom: number,
    panX: number,
    panY: number
  ) {
    return {
      x: (screenX - this.width / 2 - panX) / zoom,
      y: (screenY - this.height / 2 - panY) / zoom,
    }
  }

  handleWheel(deltaY: number, mouseX: number, mouseY: number) {
    const zoomDelta = -deltaY * this.zoomSpeed
    const zoomFactor = 1 + zoomDelta
    const newZoom = this.clampZoom(this.state.targetZoom * zoomFactor)

    // Keep the world point under the cursor stable
    const world = this.worldFromScreen(
      mouseX,
      mouseY,
      this.state.targetZoom,
      this.state.targetPanX,
      this.state.targetPanY
    )

    this.state.targetZoom = newZoom
    this.state.targetPanX = -world.x * newZoom + (mouseX - this.width / 2)
    this.state.targetPanY = -world.y * newZoom + (mouseY - this.height / 2)
  }

  startDrag(mouseX: number, mouseY: number) {
    this.state.isDragging = true
    // Align pan and target so there is no backlog that causes a jump on release
    this.state.panX = this.state.targetPanX
    this.state.panY = this.state.targetPanY
    this.state.targetPanX = this.state.panX
    this.state.targetPanY = this.state.panY
    this.state.lastMouseX = mouseX
    this.state.lastMouseY = mouseY
    this.state.velocityX = 0
    this.state.velocityY = 0
  }

  updateDrag(mouseX: number, mouseY: number) {
    if (!this.state.isDragging) return

    const deltaX = mouseX - this.state.lastMouseX
    const deltaY = mouseY - this.state.lastMouseY
    const movedEnough = Math.abs(deltaX) >= 1 || Math.abs(deltaY) >= 1

    if (movedEnough) {
      const deltaPanX = deltaX * this.panSpeed
      const deltaPanY = deltaY * this.panSpeed

      this.state.panX += deltaPanX
      this.state.panY += deltaPanY
      this.state.targetPanX = this.state.panX
      this.state.targetPanY = this.state.panY

      const rawVX = deltaPanX * this.inertiaScale
      const rawVY = deltaPanY * this.inertiaScale
      this.state.velocityX = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, rawVX))
      this.state.velocityY = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, rawVY))
    }

    this.state.lastMouseX = mouseX
    this.state.lastMouseY = mouseY
  }

  endDrag() {
    if (!this.state.isDragging) return
    this.state.isDragging = false
    // Ensure pan and target are aligned when releasing
    this.state.targetPanX = this.state.panX
    this.state.targetPanY = this.state.panY
  }

  handleDoubleClick(mouseX: number, mouseY: number) {
    const world = this.worldFromScreen(
      mouseX,
      mouseY,
      this.state.targetZoom,
      this.state.targetPanX,
      this.state.targetPanY
    )
    const newZoom = this.clampZoom(this.state.targetZoom * 2)

    this.state.targetZoom = newZoom
    this.state.targetPanX = -world.x * newZoom + (mouseX - this.width / 2)
    this.state.targetPanY = -world.y * newZoom + (mouseY - this.height / 2)
  }

  zoomInCenter() {
    const worldX = -this.state.targetPanX / this.state.targetZoom
    const worldY = -this.state.targetPanY / this.state.targetZoom
    const newZoom = this.clampZoom(this.state.targetZoom * 1.2)
    this.state.targetZoom = newZoom
    this.state.targetPanX = -worldX * newZoom
    this.state.targetPanY = -worldY * newZoom
  }

  zoomOutCenter() {
    const worldX = -this.state.targetPanX / this.state.targetZoom
    const worldY = -this.state.targetPanY / this.state.targetZoom
    const newZoom = this.clampZoom(this.state.targetZoom / 1.2)
    this.state.targetZoom = newZoom
    this.state.targetPanX = -worldX * newZoom
    this.state.targetPanY = -worldY * newZoom
  }

  zoomIn() {
    this.state.targetZoom = this.clampZoom(this.state.targetZoom * 1.2)
  }

  zoomOut() {
    this.state.targetZoom = this.clampZoom(this.state.targetZoom / 1.2)
  }

  reset() {
    this.state.targetZoom = 1
    this.state.targetPanX = 0
    this.state.targetPanY = 0
    this.state.velocityX = 0
    this.state.velocityY = 0
  }

  update() {
    if (!this.state.isDragging) {
      // Apply inertial drift to the desired pan, then ease the actual pan toward it
      this.state.targetPanX += this.state.velocityX
      this.state.targetPanY += this.state.velocityY

      this.state.velocityX *= this.friction
      this.state.velocityY *= this.friction

      if (Math.abs(this.state.velocityX) < 0.01) this.state.velocityX = 0
      if (Math.abs(this.state.velocityY) < 0.01) this.state.velocityY = 0
    } else {
      // No inertia while actively dragging
      this.state.velocityX = 0
      this.state.velocityY = 0
    }

    this.state.zoom += (this.state.targetZoom - this.state.zoom) * this.lerpFactor
    this.state.panX += (this.state.targetPanX - this.state.panX) * this.lerpFactor
    this.state.panY += (this.state.targetPanY - this.state.panY) * this.lerpFactor
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return this.worldFromScreen(screenX, screenY, this.state.zoom, this.state.panX, this.state.panY)
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX * this.state.zoom + this.width / 2 + this.state.panX,
      y: worldY * this.state.zoom + this.height / 2 + this.state.panY,
    }
  }

  getTransform(): { zoom: number; panX: number; panY: number } {
    return {
      zoom: this.state.zoom,
      panX: this.state.panX,
      panY: this.state.panY,
    }
  }

  getZoomPercentage(): number {
    return Math.round(this.state.zoom * 100)
  }
}
