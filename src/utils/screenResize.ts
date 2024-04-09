export default {
  /**
   * 現在のブラウザのウインドウをリサイズする。
   *
   */
  resizeTo() {
    switch (window.devicePixelRatio) {
      case 1.0:
        window.resizeTo((screen.availWidth / 1.25) * 0.8, screen.availHeight / 1.25);
        break;
      case 1.25:
        window.resizeTo(screen.availWidth * 0.8, screen.availHeight);
        break;
      default:
        window.resizeTo(screen.availWidth, screen.availHeight);
    }
  }
};
