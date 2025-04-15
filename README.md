# Open Source AI

Open Source AI is a beginner-friendly SaaS application that helps users make open-source contributions easily. With AI-powered features, it fetches, ranks, and classifies GitHub issues by difficulty, providing a tailored experience for contributors.

## Features

- Fetches GitHub issues and ranks them by relevance.
- Classifies issues by difficulty
- Choose your preferred language and type of issues.
- Secure authentication via GitHub OAuth.
- AI based sumary and debugging tips
- Steps and resources to make your Open Source contribution

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) (v14+)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- GitHub account with OAuth App configured.

### Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/open-source-ai.git
   cd open-source-ai
   ```
2. **Install dependencies**:

# Backend

```bash

cd server
npm install
```

# Frontend

```bash
cd ../client
npm install
```

3. **setup env variables**
4. Set Up GitHub OAuth to get the callback url, client id and client secret
5. Setup MongoDB Atlas to get the connection url
6. **Run the app**

# Backend

```bash
cd server
npm start
```

# Frontend

```bash
cd ../client
npm start
```

# Demo - [Open Source Buddy](https://open-source-ai.onrender.com/){:target="_blank"}

7. Open the app in your browser at http://localhost:3000.
8. **Licesnse**
   This project is licensed under the MIT License.
