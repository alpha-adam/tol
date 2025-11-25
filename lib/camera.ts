export interface CameraState {
  zoom: number;
  panX: number;
  panY: number;
  targetZoom: number;
  targetPanX: number;
  targetPanY: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
  velocityX: number;
  velocityY: number;
}

export class Camera {
  private state: CameraState;
  private minZoom = 0.1;
  private maxZoom = 10;
  private zoomSpeed = 0.003;
  private panSpeed = 1;
  private friction = 0.92;
  private lerpFactor = 0.15;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
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
    };
  }

  updateDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  handleWheel(deltaY: number, mouseX: number, mouseY: number) {
    const zoomDelta = -deltaY * this.zoomSpeed;
    const zoomFactor = 1 + zoomDelta;
    const newZoom = Math.min(Math.max(this.state.targetZoom * zoomFactor, this.minZoom), this.maxZoom);
    
    // Calculate the actual zoom factor that will be applied
    const actualZoomFactor = newZoom / this.state.targetZoom;
    
    // Calculate offset from canvas center to mouse position
    const offsetX = mouseX - this.width / 2;
    const offsetY = mouseY - this.height / 2;
    
    // Update zoom
    this.state.targetZoom = newZoom;
    
    // Adjust pan to zoom towards mouse position
    // When zooming, we need to adjust the pan so that the point under the mouse stays fixed
    this.state.targetPanX = this.state.targetPanX * actualZoomFactor - offsetX * (actualZoomFactor - 1);
    this.state.targetPanY = this.state.targetPanY * actualZoomFactor - offsetY * (actualZoomFactor - 1);
  }

  startDrag(mouseX: number, mouseY: number) {
    this.state.isDragging = true;
    this.state.lastMouseX = mouseX;
    this.state.lastMouseY = mouseY;
    this.state.velocityX = 0;
    this.state.velocityY = 0;
  }

  updateDrag(mouseX: number, mouseY: number) {
    if (!this.state.isDragging) return;

    const deltaX = mouseX - this.state.lastMouseX;
    const deltaY = mouseY - this.state.lastMouseY;
    const movedEnough = Math.abs(deltaX) >= 2 || Math.abs(deltaY) >= 2;
    if (movedEnough) {
      this.state.targetPanX += deltaX * this.panSpeed;
      this.state.targetPanY += deltaY * this.panSpeed;
      this.state.velocityX = deltaX;
      this.state.velocityY = deltaY;
    }

    this.state.lastMouseX = mouseX;
    this.state.lastMouseY = mouseY;
  }

  endDrag() {
    this.state.isDragging = false;
    this.state.velocityX = 0;
    this.state.velocityY = 0;
  }

  handleDoubleClick(mouseX: number, mouseY: number) {
    // Zoom in by 2x
    const newZoom = Math.min(this.state.targetZoom * 2, this.maxZoom);
    const actualZoomFactor = newZoom / this.state.targetZoom;
    
    // Calculate offset from canvas center to mouse position
    const offsetX = mouseX - this.width / 2;
    const offsetY = mouseY - this.height / 2;
    
    // Update zoom
    this.state.targetZoom = newZoom;
    
    // Adjust pan to zoom towards mouse position
    this.state.targetPanX = this.state.targetPanX * actualZoomFactor - offsetX * (actualZoomFactor - 1);
    this.state.targetPanY = this.state.targetPanY * actualZoomFactor - offsetY * (actualZoomFactor - 1);
  }

  zoomIn() {
    this.state.targetZoom = Math.min(this.state.targetZoom * 1.2, this.maxZoom);
  }

  zoomOut() {
    this.state.targetZoom = Math.max(this.state.targetZoom / 1.2, this.minZoom);
  }

  zoomInCenter() {
    // Get the current world point at the center of the screen
    const worldX = -this.state.targetPanX / this.state.targetZoom;
    const worldY = -this.state.targetPanY / this.state.targetZoom;
    
    // Set new zoom
    this.state.targetZoom = Math.min(this.state.targetZoom * 1.5, this.maxZoom);
    
    // Keep the same world point at the center
    this.state.targetPanX = -worldX * this.state.targetZoom;
    this.state.targetPanY = -worldY * this.state.targetZoom;
  }

  zoomOutCenter() {
    // Get the current world point at the center of the screen
    const worldX = -this.state.targetPanX / this.state.targetZoom;
    const worldY = -this.state.targetPanY / this.state.targetZoom;
    
    // Set new zoom
    this.state.targetZoom = Math.max(this.state.targetZoom / 1.5, this.minZoom);
    
    // Keep the same world point at the center
    this.state.targetPanX = -worldX * this.state.targetZoom;
    this.state.targetPanY = -worldY * this.state.targetZoom;
  }

  reset() {
    this.state.targetZoom = 1;
    this.state.targetPanX = 0;
    this.state.targetPanY = 0;
  }

  update() {
    this.state.zoom += (this.state.targetZoom - this.state.zoom) * this.lerpFactor;
    this.state.panX += (this.state.targetPanX - this.state.panX) * this.lerpFactor;
    this.state.panY += (this.state.targetPanY - this.state.panY) * this.lerpFactor;

    if (!this.state.isDragging) {
      this.state.velocityX = 0;
      this.state.velocityY = 0;
    }
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.width / 2 - this.state.panX) / this.state.zoom,
      y: (screenY - this.height / 2 - this.state.panY) / this.state.zoom,
    };
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX * this.state.zoom + this.width / 2 + this.state.panX,
      y: worldY * this.state.zoom + this.height / 2 + this.state.panY,
    };
  }

  getTransform(): { zoom: number; panX: number; panY: number } {
    return {
      zoom: this.state.zoom,
      panX: this.state.panX,
      panY: this.state.panY,
    };
  }

  getZoomPercentage(): number {
    return Math.round(this.state.zoom * 100);
  }
}