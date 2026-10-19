# SocialMuse Studio — Installation & Setup Guide

This guide covers setup and running instructions for both the web development environment and the native Android build configuration.

---

## 1. Quick Start (Web Runtime & Server)

### Prerequisites
- **Node.js**: Version 18.0+ (LTS recommended)
- **npm**: Version 9.0+

### Steps

1. **Clone or Open the Repository**:
   ```bash
   cd socialmuse-studio
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional for AI)**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (optional; if omitted, the local rule-and-template engine runs 100% offline):
   ```env
   GEMINI_API_KEY="your_api_key_here"
   PORT=3000
   ```
   *Note: SocialMuse Studio is 100% free with no subscription code, payment SDKs, or in-app billing. The core application and local engine require zero payment or keys. If you choose to enable the optional server-side Gemini AI integration, note that external API requests are subject to Google's standard developer API quotas or billing.*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000`.

---

## 2. Production Build

To compile and bundle the full application for production:

```bash
npm run build
npm start
```

---

## 3. Native Android Project Setup (Kotlin & Gradle)

The repository includes companion native Android configuration files located in `/android`:

### Prerequisites
- **Android Studio**: Iguana (2023.2.1) or newer
- **JDK**: Java 17+
- **Android SDK**: API Level 34 (Android 14) minimum API 26

### Gradle Sync
1. Open Android Studio and select **Open** ➔ navigate to the `android/` directory.
2. Allow Gradle sync to complete using the provided `build.gradle.kts`.
3. Run the application on an Android Virtual Device (AVD) or connected physical device using:
   ```bash
   ./gradlew assembleDebug
   ```
