const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    
    // In AI Studio (preview) and Local PC Browser (development)
    // using relative path is the most robust way when same-origin
    if (origin.includes('asia-southeast1.run.app') || origin.includes('localhost:3000')) {
      return '';
    }
    
    return origin;
  }
  
  // For Mobile (Capacitor) and any other production environment without window
  return 'https://cafesync-app-production.up.railway.app';
};

export const API_BASE_URL = getBaseUrl();
if (typeof window !== 'undefined') {
  console.log('CafeSync: Current Origin:', window.location.origin);
  console.log('CafeSync: API Base URL:', API_BASE_URL || '(relative)');
}
