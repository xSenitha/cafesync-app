const getBaseUrl = () => {
  // --- CONFIGURATION ---
  // If your backend is NOT on the same domain as your frontend, 
  // enter your backend URL here (e.g., 'https://your-api.up.railway.app')
  const PRODUCTION_BACKEND_URL = 'https://cafesync-app-production.up.railway.app';
  // ---------------------

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // 1. AI Studio Preview (Same-origin)
    if (hostname.includes('.run.app')) {
      return '';
    }
    
    // 2. Local PC Development (using `npm run dev` on port 3000)
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && window.location.port === '3000') {
      return '';
    }

    // 3. Railway (Same-origin)
    if (hostname.includes('.railway.app')) {
      return '';
    }

    // 4. Default for Web Apps (Same-origin)
    // If you are browsing a website, relative path is usually best
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('192.168.')) {
      return '';
    }
    
    // 5. Fallback for Mobile (Capacitor/Native) or Disconnected Previews
    // If we're on localhost but NOT on port 3000, or we're on a local IP, 
    // we should probably point to the production server.
    return PRODUCTION_BACKEND_URL;
  }
  
  return PRODUCTION_BACKEND_URL;
};

export const API_BASE_URL = getBaseUrl();
if (typeof window !== 'undefined') {
  console.log('CafeSync: Current Origin:', window.location.origin);
  console.log('CafeSync: API Base URL:', API_BASE_URL || '(relative)');
}
