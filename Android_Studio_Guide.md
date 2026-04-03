# CafeSync Android Studio Setup Guide

Follow these steps to run the **CafeSync** app in Android Studio.

## Prerequisites
1.  **Node.js** installed on your computer.
2.  **Android Studio** installed and configured with an **Android Emulator**.
3.  **Java JDK 17** or later.

---

## Step 1: Download and Extract
1.  Download the project source code as a **ZIP** file from AI Studio (Settings > Export).
2.  Extract the ZIP file to a folder on your computer.

## Step 2: Install Dependencies
Open your terminal (Command Prompt or PowerShell) in the extracted folder and run:
```bash
npm install
```

## Step 3: Build the Web App
Generate the production build of the React frontend:
```bash
npm run build
```

## Step 4: Initialize Capacitor Android
Run the following commands to add the Android platform:
```bash
npx cap add android
npx cap copy
```

## Step 5: Open in Android Studio
Now, open the project in Android Studio:
```bash
npx cap open android
```
*Alternatively, open Android Studio manually and select the `android` folder inside your project.*

## Step 6: Run the App
1.  Wait for Android Studio to finish indexing (Gradle sync).
2.  Select your **Emulator** or a physical device.
3.  Click the **Run** (Green Play) button.

---

## Important Notes:
*   **Backend Connection**: The app is currently configured to connect to the hosted backend at:
    `https://ais-dev-yguxizkurlqlnn7euzfb3i-23391694551.asia-southeast1.run.app`
    If you want to run the backend locally, you must update `src/config.ts` and ensure your computer and phone are on the same Wi-Fi.
*   **API Key**: If you see any errors related to the Gemini API, make sure your environment variables are set correctly in your local `.env` file.

---
**Team Members:**
- IT24103788 Gihen H.S (Orders)
- IT24104140 Bandara P.M.A.N (Billing)
- IT24102666 Kasfbi A.J (Menu)
- IT24100953 Peiris H.M.D (Table)
