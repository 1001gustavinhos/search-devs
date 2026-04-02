# React Internship Challenge Context

This document is the permanent context for the technical challenge and should guide every implementation decision.

## Main Goal

Build a React application that searches GitHub users and displays their repositories with infinite scroll.

## Mandatory User Stories

1. All screens must be responsive for desktop and mobile.
2. On home page, user can search by GitHub username and navigate to profile page with correct data.
3. If username is not found, show an informative message (example: "Nao ha usuarios com esse nome").
4. On profile page, repositories must use infinite scroll with page size = 10.
5. Repository list must allow sort parameter changes with all options supported by GitHub API for user repos.
6. Sort control is not in Figma and must be created with style consistency.
7. Repository names must be links to the original GitHub repository.
8. If profile has website/blog, show button to open it.
9. If profile has Twitter username, show button to open the account.

## Mandatory Technical Requirements

1. Use React.
2. Use Chakra UI v2 as component library (with CSS adaptation when needed).
3. Source code must be written in English.
4. UI texts must be internationalized with i18Next for Portuguese and English.
5. Routing must contain:
   - Home route for search
   - Shareable profile route: /profile/:username
6. Domain entities must be modeled with Zod (at least user and repository).
7. Repository must be public on GitHub and submission is sent via WhatsApp.

## Differential Criteria (Nice to Have)

1. Code quality and readability.
2. Good commit strategy (small, logical commits).
3. Deployment (Vercel or GitHub Pages).

## Scope Notes

1. This is not a full CRUD test.
2. Complex state management is not required.
3. Priority is a working app that satisfies stories and technical requirements.

## Current Technical Decisions For This Project

1. Data fetching: octokit (GitHub API client).
2. Router: @tanstack/react-router.
3. UI library: Chakra UI v2.
4. Validation/modeling: Zod.
5. i18n: i18next + react-i18next.
6. Infinite scroll page size: 10.
7. Default language: Portuguese.
8. Icon library: lucide-react.

## Functional Checklist Before Delivery

1. Search valid username from home and open profile.
2. Access profile directly by URL /profile/:username.
3. Invalid username shows informative message.
4. Profile renders avatar, name/login, stats, and external profile link.
5. Website button appears only when blog/site exists.
6. Twitter button appears only when twitter_username exists.
7. Repository cards render with clickable repository name.
8. Infinite scroll loads next pages in blocks of 10.
9. Sort parameter and direction change correctly reload list.
10. All UI labels/messages are translated in PT and EN.
11. Layout is responsive in mobile and desktop.
12. Lint and build run without errors.

## Suggested Commit Strategy

1. chore: setup providers, router baseline, and core dependencies (octokit and lucide-react)
2. feat: implement home search flow with octokit
3. feat: implement profile user data and error states
4. feat: implement repository infinite scroll
5. feat: implement repository sorting controls and lucide-react icons
6. feat: add i18n translations and language switch
7. style: responsive polish and visual adjustments
8. docs: update README with challenge checklist and deploy link

## Final Delivery Checklist

1. Public GitHub repository configured.
2. README with run steps and feature summary.
3. Deploy URL (if available).
4. WhatsApp message with repo + deploy link.
