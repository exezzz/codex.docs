// No inspection for unused var `css` because it's used for css bundle
// eslint-disable-next-line no-unused-vars
import '../styles/main.pcss';
import ModuleDispatcher from 'module-dispatcher';

/**
 * Import modules
 */
import Writing from './modules/writing';
import Page from './modules/page';
import Extensions from './modules/extensions';
import Sidebar from './modules/sidebar';
import ImageZoom from './modules/imageZoom';
import HawkCatcher from '@hawk.so/javascript';

/**
 * Main app class
 */
class Docs {
  /**
   * @class
   */
  constructor() {
    this.writing = new Writing();
    this.page = new Page();
    this.extensions = new Extensions();
    this.sidebar = new Sidebar();
    this.imageZoom = new ImageZoom();
    if (window.config.hawkClientToken) {
      this.hawk = new HawkCatcher(window.config.hawkClientToken);
    }

    document.addEventListener('DOMContentLoaded', (event) => {
      this.docReady();
    });
  }

  /**
   * Document is ready
   */
  docReady() {
    this.moduleDispatcher = new ModuleDispatcher({
      Library: this,
    });
  }
}

export default new Docs();

// Fullscreen functionality for video blocks
document.addEventListener('click', (e) => {
  if (e.target.closest('.video-fullscreen-btn')) {
    const btn = e.target.closest('.video-fullscreen-btn');
    const container = btn.closest('.video-container');
    const video = container.querySelector('video');
    
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  }
});
