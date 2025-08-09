# "Playwright – zabawa z API Trello" Project

## Project Description

Project with tests for articles from series **_"Playwright – zabawa z API Trello"_**
This project focuses on basic testing of API the application _**TRELLO**_ using the Playwright framework and Typescript programming language.

## Main Links

TRELLO API DOCUMENTATION: [TRELLO API DOCUMENTATION](https://developer.atlassian.com/cloud/trello/rest)

Instruction for TRELLO Preparation for API tests: [TRELLO ACCOUNT KEYS PREPARATION](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)

## Preconditions

1. (Required) TRELLO Account (for the project free account is sufficient)
2. (Recommended) Windows v_10+
3. (Recommended) Node v_22+
4. (Recommended) IDE: VSCODE

## Basic Playwright Project Initialization from scratch

1. Playwright initialization: `npm init playwright@latest`
2. Playwright browsers installation (Not needed Optional): `npx playwright install`

## Cloned project installation

1. Clone project into own device:
   `git clone https://github.com/Kruchy1980/trello_api_by_playwright.git`
2. Dependencies installation: `npm i` or `npm install`

## VSCODE EMBEDDED PLUGINS

1. (Recommended) Playwright Test for VSCode (**_Microsoft_**)
2. (Recommended) Playwright Helpers (**_jaktestowac-pl_**)
3. (Recommended) Playwright Snippets for VSCode (**_jaktestowac-pl_**)
4. (Recommended) Prettier (**_Prettier_**)
5. (Optional) Material Icon Theme (**_Philip Kief_**)
6. (Optional) Code Spell Checker (**_Street Side Software_**)

## Additional Dependencies

1. (Recommended) For environment variables usage - dotenv: `npm i --save-dev dotenv`
2. (Optional) Husky plugin installation: `npm install husky --save-dev`
3. (Optional) Husky initialization: `npx husky init`
4. (Optional/Recommended) Prettier and trivago dependency installation:
   `npm i prettier @trivago/prettier-plugin-sort-imports --save-dev`
5. (Optional) Faker installation: `npm i @faker-js/faker --save-dev`

## VSCode Functions

- Preview for .md files: <kbd>Shift</kbd> + <kbd>Ctrl</kbd> + <kbd>V</kbd>
- Autosave: in File -> Auto Save
- Timeline: file context menu -> Open Timeline
- Searching: editor -> <kbd>CTRL</kbd> + <kbd>F</kbd>
- Accept hint in editor: <kbd>Enter</kbd>
- Comment/Uncomment: <kbd>Ctrl</kbd> + <kbd>/</kbd>
- Duplicate line: <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↑</kbd>
- Extract to variable: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>
- Move line i.e. up: <kbd>Alt</kbd> + <kbd>↑</kbd>
- Show autocomplete suggestion: <kbd>Ctrl</kbd> + <kbd>Space-bar</kbd>
- Formatting: editor -> context menu -> Format Document
- Formatting shortcut: <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>
- Format code on save:
  - Top menu: View -> Open Command Palette
  - Type: user settings - chose `Preferences: Open User Settings`
  - Search: format on save
  - Edit: check `Editor Format On Save`
- Reload Window:
  - <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
  - Find and use: `Developer: Reload Window`
- Rename in opened files: <kbd>F2</kbd>
- Show quick fix: <kbd>Ctrl</kbd> + </kbd>.</kbd>

### Terminal (console)

- Open: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>`</kbd>
- Cancelling Node process: hit twice <kbd>Ctrl</kbd> + <kbd>C</kbd>
- Open file: <kbd>Ctrl</kbd> + mouse click
- Autocomplete: <kbd>Tab</kbd>
- Paste in terminal shortcuts:
  - <kbd>Ctrl</kbd> + <kbd>V</kbd>
  - <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>
  - <kbd>Shift</kbd> + <kbd>Insert</kbd>
  - right mouse button
- Use more than one terminal: <kbd>+</kbd> sign in TERMINAL
- Use another terminal (Git Bash, JavaScript Debug): <kbd>˅</kbd> sign in TERMINAL

### The main structure of project folders with basic description

├───**config** <-- folder contains file with environment variables preparation
├───**src** <-- folder which contains additional elements/helpers (objects, functions, etc.)
│ └───**API** <-- sub folder which contains all additional helpers for API Tests
│ └───**utils** <-- sub-sub folder which contains utils for API tests
└───**tests** <-- folder with tests
├───**1.Atomic-tests-dependent** <-- pure atomic tests without any updates
├───**2.Base_refactor-dependent** <-- tests with headers and auth params separated to external file
└───**3.Refactoring-hooks_usage-independent** <-- folder with independent tests
