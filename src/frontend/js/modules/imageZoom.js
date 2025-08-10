/**
 * Image Zoom Module
 * Allows users to zoom in on images by clicking on them
 */
export default class ImageZoom {
  constructor() {
    this.overlay = null;
    this.zoomedImg = null;
    this.currentScale = 1;
    this.minScale = 1;
    this.maxScale = 4;
    this.scaleStep = 0.25;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.startTranslateX = 0;
    this.startTranslateY = 0;

    this.createOverlay();
  }

  createOverlay() {
    // Create overlay element
    this.overlay = document.createElement('div');
    this.overlay.className = 'image-zoom-overlay';
    
    // Create image element inside overlay
    this.zoomedImg = document.createElement('img');
    this.zoomedImg.className = 'image-zoom-content';
    this.overlay.appendChild(this.zoomedImg);
    
    // Create controls
    this.createControls();
    
    // Add overlay to body
    document.body.appendChild(this.overlay);
    
    // Add event listeners
    this.addEventListeners();
  }

  createControls() {
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'image-zoom-close';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });
    
    // Position close button in top-right corner
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    
    this.overlay.appendChild(closeBtn);
  }

  addEventListeners() {
    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Prevent closing and default image drag behavior
    this.zoomedImg.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    
    // Prevent default drag behavior
    this.zoomedImg.addEventListener('dragstart', (e) => e.preventDefault());

    // Restore drag functionality with boundaries
    this.zoomedImg.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.endDrag.bind(this));

    this.zoomedImg.addEventListener('touchstart', this.startDrag.bind(this));
    document.addEventListener('touchmove', this.drag.bind(this));
    document.addEventListener('touchend', this.endDrag.bind(this));

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (this.overlay.classList.contains('active')) {
        if (e.key === 'Escape') this.close();
        if (e.key === '+') this.zoomIn();
        if (e.key === '-') this.zoomOut();
        if (e.key === '0') this.resetZoom();
      }
    });

    // Event delegation for zoomable images
    document.addEventListener('click', (e) => {
      if (e.target.matches('img.zoomable')) {
        this.open(e.target);
      }
    });

    // Zoom with mouse wheel
    this.zoomedImg.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    });
  }


  zoomIn() {
    if (this.currentScale < this.maxScale) {
      this.currentScale += this.scaleStep;
      this.applyTransform();
    }
  }

  zoomOut() {
    if (this.currentScale > this.minScale) {
      this.currentScale -= this.scaleStep;
      this.applyTransform();
    }
  }

  resetZoom() {
    this.currentScale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.applyTransform();
  }

  startDrag(e) {
    this.isDragging = true;
    const event = e.type.includes('touch') ? e.touches[0] : e;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startTranslateX = this.translateX;
    this.startTranslateY = this.translateY;
  }

  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    const event = e.type.includes('touch') ? e.touches[0] : e;
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    this.translateX = this.startTranslateX + deltaX;
    this.translateY = this.startTranslateY + deltaY;
    
    // Apply boundaries after drag
    this.applyBoundaries();
    this.applyTransform();
  }

  endDrag() {
    this.isDragging = false;
  }

  applyBoundaries() {
    if (!this.zoomedImg || !this.overlay) return;
    
    const imgRect = this.zoomedImg.getBoundingClientRect();
    const overlayRect = this.overlay.getBoundingClientRect();
    
    // Calculate visible area
    const visibleWidth = overlayRect.width;
    const visibleHeight = overlayRect.height;
    
    // Calculate image dimensions after scaling
    const scaledWidth = imgRect.width * this.currentScale;
    const scaledHeight = imgRect.height * this.currentScale;
    
    // Calculate maximum translation to keep image within bounds
    const maxX = Math.max(0, (scaledWidth - visibleWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - visibleHeight) / 2);
    
    // Calculate minimum translation to keep image within bounds
    const minX = -maxX;
    const minY = -maxY;
    
    // Apply boundaries
    this.translateX = Math.max(minX, Math.min(maxX, this.translateX));
    this.translateY = Math.max(minY, Math.min(maxY, this.translateY));
  }

  applyTransform() {
    this.applyBoundaries();
    this.zoomedImg.style.transform = `scale(${this.currentScale}) translate(${this.translateX}px, ${this.translateY}px)`;
  }

  open(imgElement) {
    this.zoomedImg.src = imgElement.src;
    this.zoomedImg.alt = imgElement.alt;
    this.resetZoom();
    this.overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    
    // Ensure image is properly positioned after loading
    this.zoomedImg.onload = () => {
      this.applyBoundaries();
      this.applyTransform();
    };
  }

  close() {
    this.overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    this.resetZoom();
  }

}
