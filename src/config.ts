const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Use relative paths if we are on a known web-hosted platform (Railway, AI Studio, or Dev localhost)
    if (
      hostname.endsWith('.railway.app') || 
      hostname.endsWith('.run.app') || 
      hostname === 'localhost' || 
      hostname === '127.0.0.1'
    ) {
      return ''; 
    }
    
    return window.location.origin;
  }
  
  // For Mobile (Capacitor) or SSR - fallback but usually relative paths don't work there
  return 'https://cafesync-app-production.up.railway.app';
};

export const API_BASE_URL = getBaseUrl();
if (typeof window !== 'undefined') {
  console.log('CafeSync: Current Origin:', window.location.origin);
  console.log('CafeSync: API Base URL:', API_BASE_URL || '(relative)');
}
