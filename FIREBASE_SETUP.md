# Firebase Setup Guide for Padel Pro Hub

This guide walks you through setting up your free Firebase project with **Google Auth for Admin** and a **Shared Password for Members**.

---

## ⚡ Quick Migration Path (If You Already Set Up Firebase)

If you already created your Firebase project with Anonymous Auth, here is the 60-second migration:

1. **Enable Email/Password**:
   - In Firebase Console, go to **Build** -> **Authentication** -> **Sign-in method**.
   - Click **Add new provider** (or click on **Email/Password**).
   - Toggle **Enable** to ON (leave "Email link" OFF).
   - Click **Save**.
2. **Create the Shared Member User**:
   - Go to the **Users** tab (next to Sign-in method).
   - Click **Add user**.
   - Email: `members@padel.club`
   - Password: *Choose your desired club password* (e.g. `padel2026!`).
   - Click **Add user**.
3. **Update Security Rules**:
   - Go to **Firestore Database** -> **Rules** tab.
   - Paste the rules from **Step 4** below and click **Publish**.
4. You're done! Run `migrate-data.html` to seed your normalized data.

---

## Step 1: Create a Free Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g., `padel-pro-hub`).
4. Google Analytics is optional (you can disable it for a faster setup).
5. Click **Create project** and wait for it to finish.

---

## Step 2: Enable Authentication (Email/Password + Google)

We use **Google Sign-In for Admin** and **Email/Password for the Shared Member Account**:
1. In Firebase console, go to **Build** -> **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - Click **Email/Password** -> Toggle **Enable** -> Click **Save**.
   - Click **Add new provider** -> Click **Google** -> Toggle **Enable** -> Select your Project support email -> Click **Save**.
4. Under the **Users** tab:
   - Click **Add user**.
   - Email: `members@padel.club`
   - Password: *Choose your club password* (shared with players).
   - Click **Add user**.

---

## Step 3: Create Cloud Firestore Database

1. In the left menu, go to **Build** -> **Firestore Database**.
2. Click **Create database**.
3. Choose a location closest to you (e.g., `europe-west1`, `nam5`, etc.).
4. Select **Start in production mode**.
5. Click **Create**.

---

## Step 4: Configure Firestore Security Rules

1. In Firestore, click the **Rules** tab.
2. Replace all existing text with the rules below, replacing `'YOUR_GOOGLE_EMAIL@gmail.com'` with your actual Google account email:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Authenticated with Google as the Admin
    function isAdmin() {
      return request.auth != null && 
        request.auth.token.email == 'YOUR_GOOGLE_EMAIL@gmail.com';
    }
    
    // Authenticated with the shared Club Password
    function isMember() {
      return request.auth != null && 
        request.auth.token.email == 'members@padel.club';
    }
    
    function isAttendanceLocked() {
      return exists(/databases/$(database)/documents/config/app) &&
        get(/databases/$(database)/documents/config/app).data.attendanceLocked == true;
    }

    // Admin role probe (used by the web app to check admin status):
    match /config/admin_role {
      allow read, write: if isAdmin();
    }

    // App config (active status, lock status):
    match /config/app {
      allow read: if isMember() || isAdmin();
      allow write: if isAdmin();
    }

    // Players collection (normalized records):
    match /players/{id} {
      allow read: if isMember() || isAdmin();
      allow write: if isAdmin();
    }

    // Match history:
    match /matches/{id} {
      allow read: if isMember() || isAdmin();
      allow write: if isAdmin();
    }

    // Current active match session:
    match /session/current {
      allow read: if isMember() || isAdmin();
      allow write: if isAdmin();
    }

    // Attendance list:
    // Club members can update attendance ONLY when the session is not locked
    match /attendance/current {
      allow read: if isMember() || isAdmin();
      allow write: if isAdmin() || (isMember() && !isAttendanceLocked());
    }
  }
}
```

3. Click **Publish**.

> [!NOTE]
> Anyone without the Club Password or your Admin Google account has `request.auth == null` and is completely blocked from reading any players, matches, or attendance data.

---

## Step 5: Get Your Web App Firebase Credentials

1. In Firebase console, click the gear icon (⚙️) next to **Project Overview** (top-left) -> **Project settings**.
2. Scroll down to the **Your apps** card and click the **Web icon** (`</>`).
3. App nickname: `padel-web`.
4. Click **Register app**.
5. Copy the values and paste them into `DEFAULT_FIREBASE_CONFIG` inside `firebase-config.js`.

---

## Step 6: Run Migration & Seed Data

1. Open `migrate-data.html` in your browser (via a local server or deployed site).
2. Select your exported JSON backup file (`padel_data_v24_*.json`).
3. Click **Sign in with Google** to authenticate as Admin.
4. Click **Migrate & Upload to Firestore**.
5. Once completed, your database is normalized and live in Firestore!

---

## Step 7: Ready to Play!

* Open `index.html`.
* **Club Members**: Enter the **Club Password** once to unlock the database and mark attendance.
* **Admin**: Click the **Admin Login (Google)** button in the top header and sign in with your Google account.
