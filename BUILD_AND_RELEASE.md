# SocialMuse Studio — Build and Release Guide

This document outlines the testing, compilation, and distribution workflow for SocialMuse Studio.

---

## 1. Web Release Build

1. **Lint and Typecheck**:
   ```bash
   npm run lint
   ```
2. **Compile Production Bundle**:
   ```bash
   npm run build
   ```
   This generates an optimized static distribution in `/dist`.

3. **Verify Local Production Run**:
   ```bash
   npm start
   ```

---

## 2. Native Android Build Pipeline (Kotlin DSL)

### Debug APK Generation
To create a debug build for QA testing:
```bash
cd android
./gradlew assembleDebug
```
Output artifact location:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Release Bundle (AAB) for Google Play Store
1. **Configure Keystore in `android/keystore.properties`**:
   ```properties
   storeFile=/path/to/release.keystore
   storePassword=your_keystore_password
   keyAlias=socialmuse_key
   keyPassword=your_key_password
   ```

2. **Generate Signed Release Bundle**:
   ```bash
   ./gradlew bundleRelease
   ```
Output artifact location:
`android/app/build/outputs/bundle/release/app-release.aab`

3. **R8 / ProGuard Optimization**:
   Ensure `isMinifyEnabled = true` and `isShrinkResources = true` in `android/app/build.gradle.kts`.
