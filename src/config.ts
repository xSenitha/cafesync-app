const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    
    // AI Studio Hosted URL (Preview)
    if (origin.includes('asia-southeast1.run.app')) return origin;
    
    // Local PC Browser (Development)
    if (origin.includes('localhost:3000')) return 'http://localhost:3000';
  }
  
  // For Mobile (Capacitor) and any other production environment
  return 'https://cafesync-app-production.up.railway.app';
};

export const API_BASE_URL = getBaseUrl();
console.log('Connecting to Backend at:', API_BASE_URL);
