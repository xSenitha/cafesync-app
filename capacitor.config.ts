import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cafesync.app',
  appName: 'CafeSync',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
