const getBaseUrl = () => {
  // 1. Check if we are running inside the Android Emulator (Capacitor)
  const isMobile = typeof window !== 'undefined' && (window as any).Capacitor;
  
  if (isMobile) {
    // If you are on mobile, you can either use your local PC IP (for testing)
    // or your Render.com URL (for production).
    // Replace the URL below with your Render.com URL after hosting.
    const RENDER_URL = 'https://your-app-name.onrender.com'; 
    
    if (RENDER_URL.includes('your-app-name')) {
      return 'http://10.0.2.2:3000'; // Default to local emulator during setup
    }
    return RENDER_URL;
  }

  // 2. Check if we are in the AI Studio Preview or Local Browser
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    
    // AI Studio Hosted URL
    if (origin.includes('asia-southeast1.run.app')) return origin;
    
    // Local PC Browser
    if (origin.includes('localhost:3000')) return 'http://localhost:3000';
  }
  
  // Fallback (Change this to your Render URL after hosting)
  return 'https://your-app-name.onrender.com';
};

export const API_BASE_URL = getBaseUrl();
console.log('Connecting to Backend at:', API_BASE_URL);
