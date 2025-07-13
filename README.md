<p align="center">
  <img width="250" height="250" alt="INSPECT" src="https://github.com/user-attachments/assets/1048b6f4-7646-4984-8019-752d61ad481b" />
</p>

## 📱 About the project

**Inspect** is a mobile and web application that helps users identify and collect insect sightings in a gamified way. It is designed for anyone interested in nature, including students and researchers. The app allows users to connect with friends, view a leaderboard, and learn more about insects through a built-in AI assistant.



---

## 🚀 Features

- Scan and save insect observations on the go
- Add text comments and voice notes to saved observations
- Ask questions about insects using an integrated AI assistant (Buggy)
- Add friends and compare progress on a leaderboard
- Earn XP and unlock achievements through gamified interaction
- Offline-first design with local SQLite database support
- Background sync when the device is online
- User authentication via Firebase
- Cloud data sync with Firebase Firestore
- Web dashboard for reviewing observations and progress
- Access educational articles related to insects


---

## 🧰 Technologies

### 📲 Mobile App
- [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/)
- Firebase Authentication
- SQLite (local database)
- Firebase Firestore (cloud sync)
- `expo-background-fetch` + `@react-native-community/netinfo` (background sync)

### 💻 Web Dashboard
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- Firebase Authentication
- Firebase Firestore

---

## 🗂 Project Structure

InspectApp/

├── mobileApp/ # Mobile app built with Expo + React Native

├── webApp/

│ └── inspectWebApp/ # Web dashboard built with React + Vite

---

## ▶️ Usage

Inspect is available as:

### 📱 Mobile App

To use the mobile app:

- Download the `.apk` file from https://drive.google.com/file/d/1VVLX87_Nv4sh4ch3J_vrE6v3Qwn4bTpj/view
- Install it on your Android device.
- Open the app and create an account
- Have fun exploring!

### 💻 Web Dashboard

The web dashboard is publicly available here:

👉 https://inspect-41b14.web.app/

Use it to:
- Review your and your friend's saved insect sightings
- Read and post educational articles

