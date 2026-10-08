// Shared UserWay configuration for the platform and standalone tool pages.
export function initAccessibilityWidget() {
  if (window.top !== window.self || document.querySelector('script[src="https://cdn.userway.org/widget.js"]')) return;

  window.UserWayWidgetOptions = {
    account: 'tKZSBrDiyh',
    position: 3,
    size: 'small',
    offset: { x: 8, y: 8 },
    mobile: {
      position: 3,
      size: 'small',
      offset: { x: 8, y: 8 }
    }
  };

  const script = document.createElement('script');
  script.src = 'https://cdn.userway.org/widget.js';
  script.dataset.account = 'tKZSBrDiyh';
  script.dataset.position = '3';
  script.dataset.size = 'small';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.onerror = () => console.warn('UserWay accessibility widget unavailable');
  document.head.appendChild(script);
}

initAccessibilityWidget();