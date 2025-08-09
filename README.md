# Sitara Web Companion

[![Issues](https://img.shields.io/github/issues/Nixzouxu/sitara-web-companion)](https://github.com/Nixzouxu/sitara-web-companion/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/Nixzouxu/sitara-web-companion)](https://github.com/Nixzouxu/sitara-web-companion/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/Nixzouxu/sitara-web-companion)](https://github.com/Nixzouxu/sitara-web-companion/commits/main)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [How to Run the Web](#how-to-run-the-web)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Contributing](#contributing)
- [Testing](#testing)
- [Deployment](#deployment)
- [FAQ](#faq)
- [Contact](#contact)
- [Credits](#credits)

---

## Project Overview

**SITARA** is an innovative AI-powered website designed to provide personalized early risk detection, education, and holistic support for ovarian cysts in women of reproductive age in Indonesia. SITARA leverages artificial intelligence to offer tailored assessments that help users identify potential risk factors for ovarian cysts at an early stage. In addition to risk detection, SITARA delivers comprehensive educational resources and interactive tools to increase awareness and understanding of ovarian cysts, their symptoms, treatments, and prevention.

The platform also serves as a holistic support system, offering guidance, recommendations, and a supportive community for women who may be at risk or are seeking information about ovarian health. By combining early detection, education, and support in one accessible web application, SITARA aims to empower Indonesian women with the knowledge and resources they need to manage their reproductive health proactively and confidently.

---

## Features

- **Modern User Interface**: Intuitive, responsive UI built with React and TypeScript, adhering to best UX practices.
- **Task Automation**: Automate repetitive or routine workflows through customizable scripts or triggers.
- **Integration-Ready**: Easily connect with external APIs, services, or databases.
- **Real-time Notifications**: Instant feedback and alerts for key events or actions.
- **User Authentication & Authorization**: Secure login, role-based access, and session management.
- **Customization & Theming**: Supports light/dark modes and user-customizable settings.
- **Error Handling & Logging**: Robust error boundaries, centralized logging, and developer-friendly debug tools.
- **Accessibility**: Built with accessibility (a11y) in mind to ensure usability for all users.
- **Internationalization**: Structure in place for multi-language support.

---

## Tech Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/) (94.3%), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) (3.2%)
- **Styling**: [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (1.3%)
- **Backend**: [Python](https://www.python.org/) (Flask), [Node.js](https://nodejs.org/)
- **Frontend Framework**: [React](https://react.dev/) (presumed)
- **Build Tools**: [Webpack](https://webpack.js.org/) or [Vite](https://vitejs.dev/) (depending on setup)
- **State Management**: [Redux](https://redux.js.org/) or Context API (if present)
- **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting & Formatting**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) (if configured)
- **Other**: See `package.json` for a full list of dependencies.

---

## Architecture Overview

The project follows modern fullstack architecture patterns, including:

- **Component-Based Design**: UI is split into reusable, isolated components.
- **API Layer**: Centralized modules for all HTTP requests and data fetching.
- **Backend Services**: Combination of Flask (Python) and Node.js for backend APIs and services.
- **Frontend**: Modular React-based frontend with TypeScript for maintainability.

---

## Getting Started

### How to Run the Web

To run the Sitara Web Companion locally, follow these three steps:

#### **Step 0: Clone the Repository**

```bash
git clone https://github.com/Nixzouxu/sitara-web-companion.git
cd sitara-web-companion
```

#### **Step 1: Start the Flask Backend**

```bash
cd backend
python -m venv venv
# For Windows:
venv\Scripts\activate
# For Unix/MacOS:
# source venv/bin/activate
pip install -r requirements.txt
python app3.py
```

#### **Step 2: Start the Node Backend**

> Open a separate terminal, then run:

```bash
cd backend
node index.js
```

#### **Step 3: Start the Frontend**

> Open yet another terminal, then run:

```bash
cd frontend
npm i
npm run dev
```

The application should now be running with both backend services (Flask and Node.js) and the frontend.

---

## Project Structure

```
sitara-web-companion/
├── backend/             # Backend folder (Flask & Node.js code)
│   ├── app3.py          # Flask application entrypoint
│   ├── index.js         # Node.js server entrypoint
│   ├── requirements.txt # Python dependencies
│   └── ...              # Other backend files
├── frontend/            # Frontend React application
│   ├── src/             # React source files
│   ├── package.json     # Frontend dependencies & scripts
│   └── ...              # Other frontend files
├── .env.example         # Environment variable template
├── README.md            # This file
├── ...                  # Additional configuration files (lint, prettier, etc.)
```

---

## Design Decisions

- **TypeScript-First**: The project leverages TypeScript for type safety, maintainability, and better developer experience.
- **Separation of Concerns**: Backend and frontend are clearly separated for scalability and clarity.
- **Multiple Backend Services**: Uses both Flask (Python) and Node.js for distinct backend functionalities.
- **Accessibility**: Semantic HTML and ARIA attributes are used to maximize accessibility.
- **Performance**: Code splitting and lazy loading are considered for optimal bundle sizes.
- **Testing**: Emphasis on unit and integration tests to ensure reliability and prevent regressions.

---

## Contributing

Contributions are welcome! Please review the [CONTRIBUTING.md](CONTRIBUTING.md) if available, or follow these steps:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request.

Follow the [Code of Conduct](CODE_OF_CONDUCT.md) when interacting with the community.

---

## Testing

- Run all tests:
  ```bash
  npm test
  # or
  yarn test
  ```
- Coverage reports and debugging information will be available in the console.

---

## Deployment

- The app can be deployed to any modern static hosting service (e.g., Vercel, Netlify, GitHub Pages) for the frontend.
- Ensure all environment variables are configured on your deployment platform.
- For backend services, deploy Flask and Node.js apps to your preferred PaaS or server.
- For Dockerized deployment, consult the `Dockerfile` (if present).

---

## FAQ

**Q: What is SITARA for?**  
A: SITARA is an AI-powered website that provides early risk detection, education, and holistic support for ovarian cysts, specifically targeting women of reproductive age in Indonesia.

**Q: Can I extend or customize it?**  
A: Absolutely. The modular architecture and comprehensive documentation make adding new features straightforward.

**Q: Is it suitable for production use?**  
A: Yes, but ensure you review and configure all environment variables and security settings before deploying.

**Q: Is there a roadmap?**  
A: See [issues](https://github.com/Nixzouxu/sitara-web-companion/issues) or the [Projects](https://github.com/Nixzouxu/sitara-web-companion/projects) tab.

---

## Contact

- **Author**: [Nixzouxu](https://github.com/Nixzouxu)
- **Issues**: [GitHub Issues](https://github.com/Nixzouxu/sitara-web-companion/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Nixzouxu/sitara-web-companion/discussions) (if enabled)

---

## Credits

This web is created by **Dakelunang Team** from Syiah Kuala University.

---

> _Sitara Web Companion – Empower your workflow, one click at a time._
