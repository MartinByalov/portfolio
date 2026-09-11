// Global clone and postMessage safety guard
(function() {
  function isNode(val) {
    return typeof Node === 'function' ? val instanceof Node : (val && typeof val === 'object' && val.nodeType);
  }

  function sanitizeCloneable(val, seen = new WeakSet()) {
    if (val === null || typeof val !== 'object') return val;
    if (isNode(val)) {
      return {
        nodeName: val.nodeName || '',
        tagName: val.tagName || '',
        id: val.id || '',
        className: val.className || '',
        href: val.href || '',
        rel: val.rel || '',
        type: val.type || ''
      };
    }
    if (val instanceof Error) {
      return { name: val.name, message: val.message, stack: val.stack };
    }
    if (seen.has(val)) return null;
    seen.add(val);

    if (Array.isArray(val)) {
      return val.map(item => sanitizeCloneable(item, seen));
    }
    const clean = {};
    for (const key of Object.keys(val)) {
      try {
        clean[key] = sanitizeCloneable(val[key], seen);
      } catch {}
    }
    return clean;
  }

  // 1. Guard Window.prototype.postMessage
  if (typeof Window !== 'undefined' && Window.prototype && Window.prototype.postMessage) {
    const origWindowPost = Window.prototype.postMessage;
    Window.prototype.postMessage = function(message, ...args) {
      try {
        return origWindowPost.call(this, message, ...args);
      } catch (err) {
        if (err && (err.name === 'DataCloneError' || String(err).includes('could not be cloned'))) {
          try {
            return origWindowPost.call(this, sanitizeCloneable(message), ...args);
          } catch (e2) {
            console.warn('Suppressed DataCloneError in postMessage:', err);
            return;
          }
        }
        throw err;
      }
    };
  }

  // 2. Guard Worker.prototype.postMessage
  if (typeof Worker !== 'undefined' && Worker.prototype && Worker.prototype.postMessage) {
    const origWorkerPost = Worker.prototype.postMessage;
    Worker.prototype.postMessage = function(message, ...args) {
      try {
        return origWorkerPost.call(this, message, ...args);
      } catch (err) {
        if (err && (err.name === 'DataCloneError' || String(err).includes('could not be cloned'))) {
          try {
            return origWorkerPost.call(this, sanitizeCloneable(message), ...args);
          } catch (e2) {
            console.warn('Suppressed Worker DataCloneError in postMessage:', err);
            return;
          }
        }
        throw err;
      }
    };
  }

  // 3. Guard MessagePort.prototype.postMessage
  if (typeof MessagePort !== 'undefined' && MessagePort.prototype && MessagePort.prototype.postMessage) {
    const origPortPost = MessagePort.prototype.postMessage;
    MessagePort.prototype.postMessage = function(message, ...args) {
      try {
        return origPortPost.call(this, message, ...args);
      } catch (err) {
        if (err && (err.name === 'DataCloneError' || String(err).includes('could not be cloned'))) {
          try {
            return origPortPost.call(this, sanitizeCloneable(message), ...args);
          } catch (e2) {
            console.warn('Suppressed MessagePort DataCloneError in postMessage:', err);
            return;
          }
        }
        throw err;
      }
    };
  }

  // 4. Guard structuredClone
  if (typeof window !== 'undefined' && typeof window.structuredClone === 'function') {
    const origStructuredClone = window.structuredClone;
    window.structuredClone = function(val, ...args) {
      try {
        return origStructuredClone.call(this, val, ...args);
      } catch (err) {
        if (err && (err.name === 'DataCloneError' || String(err).includes('could not be cloned'))) {
          return sanitizeCloneable(val);
        }
        throw err;
      }
    };
  }

  // 5. Global error suppression for DataCloneError
  if (typeof window !== 'undefined') {
    window.addEventListener('error', function(event) {
      if (event.error && (event.error.name === 'DataCloneError' || String(event.error).includes('could not be cloned'))) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    }, true);

    window.addEventListener('unhandledrejection', function(event) {
      if (event.reason && (event.reason.name === 'DataCloneError' || String(event.reason).includes('could not be cloned'))) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  }
})();
