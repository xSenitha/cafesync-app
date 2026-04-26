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
    
    // 3. Custom Production URL (Change this to your actual backend URL)
    const PRODUCTION_API_URL = 'https://cafesync-app-production.up.railway.app'; // <--- ඔබේ Backend URL එක මෙතනට දාන්න
    
    if (hostname.includes('up.railway.app') || hostname === 'your-hosted-domain.com') {
      return origin;
    }
    
    return origin;
  }
  
  // For Mobile (Capacitor) or SSR
  return 'https://cafesync-app-production.up.railway.app'; // <--- ඔබේ Backend URL එක මෙතනට දාන්න
};

export const API_BASE_URL = getBaseUrl();
if (typeof window !== 'undefined') {
  console.log('CafeSync: Current Origin:', window.location.origin);
  console.log('CafeSync: API Base URL:', API_BASE_URL || '(relative)');
}
