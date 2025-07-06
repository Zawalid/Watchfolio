<div align="center">
  <br />
  <h1 align="center">🎬 Watchfolio</h1>
  <p align="center">
    A modern, feature-rich web application meticulously crafted for cinephiles to discover, track, and curate their personal movie and TV show watchlist.
  </p>

  <div align="center">
  <a href="https://watchfolio.netlify.app" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_Site-blue?style=for-the-badge&logo=rocket" alt="Live Demo"/>
  </a>****
</div>
  <br />
</div>

<div align="center">
  <img alt="Status" src="https://img.shields.io/badge/Status-Actively%20Developed-brightgreen"/>
  <img alt="React" src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img alt="Appwrite" src="https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white"/>
</div>

---

### **📌 Table of Contents**
- [**📌 Table of Contents**](#-table-of-contents)
- [**✨ Core Features**](#-core-features)
- [**🧰 Technology Stack**](#-technology-stack)
- [**🌟 Future Features**](#-future-features)
- [**📸 Screenshots**](#-screenshots)
- [**📨 Get In Touch**](#-get-in-touch)

---

### **✨ Core Features**

| Feature                   | Description                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Secure Authentication** | Robust user authentication system powered by **Appwrite**, allowing users to securely manage their private library with confidence.      |
| 📂 **Personalized Library** | Full CRUD functionality with granular tracking statuses (`Plan To Watch`,`Watching`, `Completed`, `On-Hold`, `Dropped`) for precise organization.      |
| 🔍 **Advanced Discovery** | Explore, search, and filter a vast media catalog from TMDB. Find exactly what you're looking for with robust filtering by genre, platform, and type. |
| 🎞️ **Dynamic Content Views** | Dive deep with detailed views for media, including cast, trailers, recommendations, and an interactive season and episode browser.       |
| ☁️ **Background Cloud Sync** | Library changes reflect instantly in the UI, while a custom hook (`useLibrarySync`) seamlessly synchronizes all data with Appwrite in the background. |
| 🔄 **Effortless Migration** | A dedicated **Web Worker** handles large-scale library imports via JSON/CSV off the main thread, ensuring the UI remains perfectly responsive. |
| ⌨️ **Power-User Shortcuts** | A comprehensive suite of keyboard shortcuts designed for efficient navigation and rapid library management, tailored for power-users.       |
| 📱 **Fully Responsive Design** | A pixel-perfect, adaptive interface built with **Tailwind CSS** that provides a flawless and intuitive experience from desktop to mobile.   |

---

### **🧰 Technology Stack**

This project uses a modern, performant, and scalable tech stack.

| Category                  | Technologies & Services                                                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend & UI** | <img src="https://skillicons.dev/icons?i=react" alt="React" width="24" style="vertical-align: middle; margin-right: 5px;"> **React 19** & <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" width="24" style="vertical-align: middle; margin-right: 5px;"> **TypeScript** for a type-safe, component-driven UI.                               |
| **State Management** | <img src="https://skillicons.dev/icons?i=zustand" alt="Zustand" width="24" style="vertical-align: middle; margin-right: 5px;"> **Zustand** for lightweight global state and <img src="https://raw.githubusercontent.com/TanStack/query/beta/media/repo-header.png" alt="TanStack Query" width="24" style="vertical-align: middle; margin-right: 5px;"> **TanStack Query** for robust server-state caching. |
| **Styling & Animation** | <img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind CSS" width="24" style="vertical-align: middle; margin-right: 5px;"> **Tailwind CSS** for styling, and <img src="https://skillicons.dev/icons?i=framer" alt="Framer Motion" width="24" style="vertical-align: middle; margin-right: 5px;"> **Framer Motion** for fluid animations.                               |
| **Backend & Data** | <img src="https://skillicons.dev/icons?i=appwrite" alt="Appwrite" width="24" style="vertical-align: middle; margin-right: 5px;"> **Appwrite** for Auth & Database, with the <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bFFAz1d6f5f6.svg" alt="TMDB" width="24" style="vertical-align: middle; margin-right: 5px;"> **TMDB API** for media metadata. |
| **Tooling & Quality** | <img src="https://skillicons.dev/icons?i=vite" alt="Vite" width="24" style="vertical-align: middle; margin-right: 5px;"> **Vite** as the build tool, with <img src="https://skillicons.dev/icons?i=eslint" alt="ESLint" width="24" style="vertical-align: middle; margin-right: 5px;"> **ESLint** & <img src="https://skillicons.dev/icons?i=prettier" alt="Prettier" width="24" style="vertical-align: middle; margin-right: 5px;"> **Prettier** for code quality.       |

---

### **🌟 Future Features**

This project has a strong foundation with a clear roadmap for future enhancements, focusing on personalization, social connectivity, and multi-platform access.

| Feature Area                      | Planned Enhancements                                                                                                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Intelligent Discovery & AI**    | Implement a sophisticated **AI-powered recommendation engine** that suggests movies and shows based not only on a user's watch history but also on their current mood or desired genre. |
| **Social & Community Features**   | Introduce a friend system to enable **social sharing** of watchlists and favorites. Develop a dedicated "Friends' Recommendations" section to discover content curated by your network. |
| **Cross-Platform Accessibility**  | Expand beyond the web with dedicated **desktop (via Tauri)** and **mobile (via React Native)** applications to ensure a seamless, native experience and on-the-go access to your library. |
| **Deeper Content Integration**    | Integrate a "Where to Watch" feature to link directly to streaming services. Add **Plex/Jellyfin scrobbling** for automated, real-time watch history tracking.                        |

---

### **📸 Screenshots**

<p align="center">
  <img src="https://i.imgur.com/e2qR84b.png" alt="Library View" width="85%">
  <br>
  <em>The user's personal media library, showcasing advanced filtering and clear status indicators.</em>
</p>
<br>
<p align="center">
  <img src="https://i.imgur.com/h9D6sT5.png" alt="Media Details View" width="85%">
  <br>
  <em>The detailed media view, providing comprehensive information, trailers, cast, and more.</em>
</p>

---

### **📨 Get In Touch**

Let's connect! I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.

**Walid Zakan**

-   **📧 Email**: [walid.zakan@gmail.com](mailto:walid.zakan@gmail.com)
-   **💼 LinkedIn**: [linkedin.com/in/walid-zakan](https://www.linkedin.com/in/walid-zakan)

