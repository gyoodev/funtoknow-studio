# FunToKnow Platform

Welcome to the FunToKnow Platform, a modern web application designed for showcasing game projects, publishing a developer blog, and managing a user community. This project is built with a powerful, modern tech stack and includes AI-powered features to enhance user engagement.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Font Awesome](https://fontawesome.com/) & [Lucide React](https://lucide.dev/)

## Key Features

-   **Project Showcase**: Display game projects with images, descriptions, and awards.
-   **Developer Blog**: A fully-featured blog with markdown support for posts.
-   **User Authentication**: Secure sign-up and login for users with email and password.
-   **Admin Dashboard**: A protected area for administrators to manage site content.
    -   Manage Projects, Blog Posts, and Users.
    -   Dynamically update site-wide settings like social media links.
-   **AI-Powered Suggestions**: Personalized game project recommendations for users based on their declared gaming habits.
-   **Contact Form**: Server Action-powered form for users to get in touch.

## Getting Started

To get this project up and running on your local machine, follow these steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or a compatible package manager

### Installation

1.  Clone the repository to your local machine.
2.  Install the necessary dependencies:
    ```bash
    npm install
    ```

### Running the Development Servers

This project requires two separate development servers to be running simultaneously: one for the Next.js application and one for the Genkit AI flows.

1.  **Start the Next.js App**:
    Open a terminal and run:
    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:9002`.

2.  **Start the Genkit Server**:
    Open a *second* terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit development UI, allowing you to inspect and test your AI flows.

## Project Structure

-   `src/app/`: Contains all the application routes, following the Next.js App Router structure.
    -   `src/app/(site)/`: Public-facing pages (Home, Blog, Projects, Contact).
    -   `src/app/(auth)/`: Authentication pages (Login, Register).
    -   `src/app/admin/`: Protected admin dashboard routes.
-   `src/components/`: Reusable React components used throughout the application.
-   `src/lib/`: Core utilities, data models, and Firebase actions.
-   `src/ai/`: All Genkit-related code, including AI flows and prompts.
-   `src/firebase/`: Firebase configuration, providers, and custom hooks.
-   `docs/backend.json`: Defines the data entities and Firestore structure.
-   `firestore.rules`: Security rules for the Firestore database.
