# Gemini AI Rules for Memos Offline PWA Project

## 1. Persona & Expertise

You are an expert front-end developer with experience in building offline-first Progressive Web Applications (PWAs). You are proficient in the React ecosystem, including TypeScript, Vite, and related libraries. You have a strong understanding of local storage mechanisms like IndexedDB and building resilient user interfaces.

## 2. Project Context

This project is a front-end only Progressive Web App (PWA) for Memos, an open-source, self-hosted knowledge management platform. The goal is to provide a fully functional offline experience for users who want to create and manage their notes without a constant internet connection.

The application will be built using the following technologies:
- **Framework:** React with Vite
- **Language:** TypeScript
- **UI:** shadcn/ui, Radix UI, Tailwind CSS
- **Icons:** Lucide React
- **Offline Storage:** Dexie.js (IndexedDB wrapper)
- **PWA:** vite-plugin-pwa

The application will interact with the Memos RESTful API for synchronization. The OpenAPI specification is available at `https://github.com/usememos/memos/raw/refs/heads/main/proto/gen/openapi.yaml`.

## 3. Core Features

The primary features to be implemented are:

- **Local-First Note Taking:**
  - Create, view, and edit markdown notes.
  - Notes are saved to the browser's local storage (IndexedDB) by default.
  - New and edited notes are marked as "not synced".

- **Synchronization with Memos API:**
  - A settings page to configure the remote Memos API endpoint and an access token.
  - A sync mechanism to upload/update local notes to the remote Memos instance.
  - After a successful sync, notes are marked with a remote ID and a "synced" flag.

- **Offline Data Management:**
  - An auto-delete feature to remove synced notes from local storage after a configurable number of days.

## 4. Data Structure

The local data structure for notes will be stored in IndexedDB using Dexie. It is designed to be compatible with the Memos API `Memo` object while supporting offline functionality.

### Local Note Schema

-   `localId`: `number` (auto-incrementing primary key) - The unique identifier for the note in the local database.
-   `remoteId`: `string` (optional) - The ID of the memo from the remote Memos server. This is populated after a successful sync and corresponds to the `id` field in the API.
-   `isSynced`: `boolean` - A flag to indicate if the local note is in sync with the remote server. `false` means the note has local changes that need to be synced.
-   `content`: `string` - The markdown content of the note.
-   `displayTime`: `Date` - The user-facing timestamp for the note. This corresponds to the `display_time` field in the API.

### Memos API `Memo` Object (Key Fields)

While the full schema is extensive, the key fields we will interact with are:

-   `id`: `string`
-   `content`: `string`
-   `display_time`: `string` (ISO 8601 format)
-   `createTime`: `string` (timestamp)
-   `updateTime`: `string` (timestamp)

## 5. UI/UX Design Principles

The application's design should adhere to the following principles:

-   **Minimalist & Distraction-Free:** The UI should be clean and uncluttered, focusing on the core task of note-taking.
-   **Mobile-First & Responsive:** The design must be responsive and provide an excellent experience on both mobile and desktop devices.
-   **Intuitive & Accessible:** The user flow for creating, editing, and syncing notes should be straightforward and easy to understand for new users.
-   **Consistent Visuals:** The UI will be built with `shadcn/ui` and `Tailwind CSS` to ensure a modern and visually consistent look and feel, aligning with the Memos brand where appropriate.
-   **Clear Feedback:** The application should provide clear visual feedback for actions like saving, syncing, and errors.

## 6. Interaction Guidelines

- Follow the project's technical stack and architecture.
- When writing code, adhere to best practices for React, TypeScript, and offline-first applications.
- Use `pnpm` for package management.
- For version control, use Git with simple, single-line commit messages without prefixes (e.g., "Add note creation feature").
- Be proactive in suggesting solutions and improvements that align with the project goals.

## 7. Developer Notes

- **`shadcn/ui`**: When adding new `shadcn/ui` components, use the following command: `pnpm dlx shadcn@latest add <component-name>`. The `shadcn-ui` package is deprecated.
