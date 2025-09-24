# CanvasSpark AI

An AI-powered creative studio for generating beautiful, illustrative artwork from text prompts.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/AidoesitAll/CloudflareAiPlayform)

CanvasSpark AI is a visually breathtaking web application that empowers users to transform their textual ideas into stunning, high-quality illustrations and concept art. Leveraging the power of serverless Cloudflare Workers and cutting-edge AI models, the platform provides a seamless and inspiring creative experience. The user interface is a masterpiece of form and function, featuring a clean, spacious layout, a sophisticated color palette, and delightful micro-interactions that make the creative process a joy.

## Key Features

- **AI-Powered Artwork Generation**: Transform simple text prompts into unique, high-quality illustrations.
- **Stunning User Interface**: A beautiful, minimal, and inspiring interface designed to foster creativity.
- **Personal Gallery**: Save, view, and manage all your creations in a beautifully organized grid-based gallery.
- **Serverless Architecture**: Built on Cloudflare Workers for high performance, scalability, and reliability.
- **Fully Responsive**: A flawless experience across desktops, tablets, and mobile devices.
- **Interactive Polish**: Smooth animations, hover states, and micro-interactions for a delightful user experience.

## Technology Stack

- **Frontend**: React, Vite, TypeScript
- **Backend**: Hono on Cloudflare Workers
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/canvas_spark_ai.git
    cd canvas_spark_ai
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.dev.vars` file in the root of the project for local development. You will need to get your Account ID and create an AI Gateway from your Cloudflare dashboard.

    ```ini
    # .dev.vars

    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_NAME/openai"
    CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
    ```

4.  **Run the development server:**

    This command will start the Vite frontend and the Wrangler development server for the backend worker.
    ```bash
    bun run dev
    ```

    The application will be available at `http://localhost:3000`.

## Usage

The application is designed to be intuitive and straightforward:

1.  **Generator View**: Upon loading, you'll be in the Generator view.
2.  **Enter a Prompt**: Type a descriptive text prompt for the artwork you want to create in the main input field.
3.  **Generate**: Click the "Spark" button to start the AI generation process.
4.  **View & Save**: The generated image will appear below the controls. You can then choose to save it to your personal gallery.
5.  **Gallery View**: Navigate to the "Gallery" to see all your saved creations. You can view them in detail, download, or delete them.

## Development

The project is structured into two main parts: the frontend application and the backend worker.

-   `src/`: Contains all the React frontend code.
    -   `src/pages/`: Main application views (e.g., `HomePage.tsx` for the Generator).
    -   `src/components/`: Reusable React components (e.g., `Header.tsx`, `GalleryView.tsx`).
    -   `src/store/`: Zustand stores for state management.
    -   `src/lib/`: Utility functions and services.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `worker/index.ts`: The entry point for the Hono server.
    -   `worker/userRoutes.ts`: Defines the API routes for the application.
-   `tailwind.config.js`: Configuration file for Tailwind CSS, including the custom color palette and fonts.

## Deployment

This project is designed for easy deployment to Cloudflare Pages.

### One-Click Deploy

You can deploy this application to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/AidoesitAll/CloudflareAiPlayform)

### Manual Deployment with Wrangler

1.  **Login to Wrangler:**
    ```bash
    bunx wrangler login
    ```

2.  **Build the project:**
    ```bash
    bun run build
    ```

3.  **Deploy the application:**
    ```bash
    bun run deploy
    ```

    Wrangler will build and deploy your application to Cloudflare Pages and set up the associated worker and Durable Object bindings.

4.  **Configure Secrets:**

    After deployment, you must add your Cloudflare API key as a secret for the production environment.

    ```bash
    bunx wrangler secret put CF_AI_API_KEY
    ```

    Follow the prompts to securely add your secret. Your `CF_AI_BASE_URL` from `wrangler.jsonc` will be used automatically.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.