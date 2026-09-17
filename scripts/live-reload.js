// Reload the page automatically when local project files change.
if (window.EventSource) {
  const source = new EventSource('/__live_reload');
  source.addEventListener('reload', () => window.location.reload());
  source.onerror = () => {
    // EventSource reconnects automatically when the development server returns.
  };
}