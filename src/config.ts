const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // In browser, relative path is safest for same-origin backend
    // Only use full URL if we are running in a disconnected environment (like Capacitor)
    // or if the user is explicitly developing on a different port than the backend
    if (
      hostname === 'localhost' || 
      hostname === '127.0.0.1' ||
      hostname.includes('.run.app') ||
      hostname.includes('.railway.app') ||
      hostname.includes('.up.railway.app')
    ) {
      return ''; 
    }
    
    return window.location.origin;
  }
  
  // Fallback for SSR
  return 'https://cafesync-app-production.up.railway.app';
};

export const API_BASE_URL = getBaseUrl();
if (typeof window !== 'undefined') {
  console.log('CafeSync: Current Origin:', window.location.origin);
  console.log('CafeSync: API Base URL:', API_BASE_URL || '(relative)');
}
