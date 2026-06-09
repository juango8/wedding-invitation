const crypto = require('crypto');

// Polyfill getRandomValues directly on the crypto module for Node 16 compatibility
if (typeof crypto.getRandomValues === 'undefined') {
  crypto.getRandomValues = function(buf) {
    return crypto.webcrypto.getRandomValues(buf);
  };
}
