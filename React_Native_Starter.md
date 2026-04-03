# CafeSync React Native Starter Guide

This guide will help you connect your React Native mobile app to the backend we just built.

## 1. Project Structure
In your React Native project, create the following folder structure:
```
/src
  /api
    client.js
  /screens
    LoginScreen.js
    RegisterScreen.js
    DashboardScreen.js
    MenuScreen.js
  /context
    AuthContext.js
```

## 2. API Client (src/api/client.js)
Replace `YOUR_BACKEND_URL` with the URL of this AI Studio app.

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'https://YOUR_BACKEND_URL/api',
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

## 3. Login Logic (Example)
```javascript
const handleLogin = async () => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    await AsyncStorage.setItem('token', token);
    // Navigate to Dashboard
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
  }
};
```

## 4. Image Upload (Example for Menu)
```javascript
const uploadMenuItem = async (formData) => {
  try {
    const response = await apiClient.post('/menu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
```

## 5. Important Note
Since you are using an Android Emulator, `localhost` will not work. You must use the **Live App URL** from AI Studio.
