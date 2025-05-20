# "Playwright – zabawa z API Trello" Project

## Main Description

That file contains information's for set Playwright project for testing Trello API situated in genelaly available documentation [TRELLO API DOCUMENTATION](https://developer.atlassian.com/cloud/trello/rest)
Project with tests for articles from series **_"Playwright – zabawa z API Trello"_**

## Preconditions

1. (Required) TRELLO Account (for the test free account is sufficient)
   - For the Account API_KEY and TOKEN is required - preparation detailed instruction [TRELLO ACCOUNT KEYS PREPARATION](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)
2. (Recommended) Windows v-10+
3. (Required) Node v-22+ (version recommended)
4. (Recommended) IDE: VSCODE

## Basic Playwright Project Initialization

1. Playwright initialization: `npm init playwright@latest`
2. Dependencies installation: `npm i` or `npm install`
3. Playwright browsers installation (Not needed Optional): `npx playwright install`

## VSCODE EMBEDDED PLUGINS

1. (Recommended not required) Playwright Test for VSCode (**_Microsoft_**)
2. (Optional) Playwright Helpers (**_jaktestowac-pl_**)
3. (Optional) Playwright Snippets for (**_jaktestowac-pl_**)
4. (Recommended not required) Prettier (**_Prettier_**)
5. (Recommended not required) Material Icon Theme (**_Philip Kief_**)
6. (Recommended not required) Code Spell Checker (**_Street Side Software_**)

## External Plugins

1. (Optional) Husky plugin installation: `npm install husky --save-dev`
2. (Optional) Husky initialization: `npx husky init`
3. (Recommended) For environment preparation - dotenv: `npm i --save-dev dotenv`
4. (Needed from 2nd refactor) Faker installation: `npm i @faker-js/faker --save-dev`

## VSCode Functions

### Functions

- Preview: for README.md
- Autosave: in File -> Auto Save
- Timeline: file context menu -> Open Timeline
- Searching: editor -> <kbd>CTRL</kbd> + <kbd>F</kbd>
- Accept hint in editor: <kbd>Enter</kbd>
- Comment/Uncomment: <kbd>Ctrl</kbd> + <kbd>/</kbd>
- Duplicate line: <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↑</kbd>
- Extract to variable: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> -> Extract to constant in enclosing scope
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
