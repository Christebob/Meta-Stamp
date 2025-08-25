import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f6f8dabb546c4ea2aaa4062a64c41dad',
  appName: 'art-trace-ai',
  webDir: 'dist',
  server: {
    url: 'https://f6f8dabb-546c-4ea2-aaa4-062a64c41dad.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;