import * as RNWeb from 'react-native-web';

export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => null,
};

// Spread all exports from react-native-web
export * from 'react-native-web';

// Default export should also include the mocks if needed, 
// but usually react-native-web's default is fine.
export default RNWeb.default || RNWeb;
