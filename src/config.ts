const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const hostname = window.location.hostname;
    
    // 1. AI Studio Preview Environment
    if (hostname.includes('asia-southeast1.run.app')) {
      return ''; // Use relative path for same-origin
    }
    
    // 2. Local Development (localhost)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || origin.includes('localhost:3000')) {
      return ''; 
    }
    
    // 3. Custom Railway/Production URL for Web
    if (hostname.includes('up.railway.app')) {
      return origin;
    }
    
    return origin;
  }
  
  // For Mobile (Capacitor) or SSR - always use the fixed hosted URL
  return 'https://cafesync-app-production.up.railway.app';
};

export const API_BASE_URL = getBaseUrl();
if (typeof window !== 'undefined') {
  console.log('CafeSync: Current Origin:', window.location.origin);
  console.log('CafeSync: API Base URL:', API_BASE_URL || '(relative)');
}
