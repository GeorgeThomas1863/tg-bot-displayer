# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Important: You are the orchestrator. Your subagents execute. You should NOT build, verify, or code inline (if possible). Your job is to plan, prioritize & coordinate the acitons of your subagents!

Keep your replies extremely concise and focus on providing necessary information.

Put all pictures / screenshots you take with the mcp plugin in the "pics" subfolder, under the .claude folder in THIS project.

Do NOT commit anything to GitHub. The user will control all commits to GitHub. Do NOT edit or in any way change the user's Git history or interact with GitHub.


## Architecture

A password-protected Express web app that acts as a control panel for running Telegram Bot API operations. The UI submits commands to the backend, which executes them against the TG API and stores results in MongoDB.

### Entry Point & Server

`app.js` bootstraps Express. It loads `.env` first, then `.env.local` with override — use `.env.local` for local dev secrets. It mounts session middleware, `public/` as static, and all routes.

### Request Flow

```
Browser → POST /tg-submit-route
  → requireAuth (session check)
  → tgCommandControl (data-controller.js)
    → tgCommandRun (src/src.js)         ← merges env defaults into form params
      → tg-api.js / forward-all / caption-all / upload-pics
        → MongoDB via dbModel
```

### Key Backend Modules (`src/`)

| File | Purpose |
|---|---|
| `src/src.js` | Command dispatcher. Maps `command` string to handler. Also merges `.env` defaults for any form field left blank/zero via `addDefaultParams`. |
| `src/tg-api.js` | All Telegram API calls (GET/POST via axios). Manages a pool of up to 11 bot tokens (`TOKEN_1`–`TOKEN_11`); rotates `tokenIndex` on 429 or bad response. |
| `src/util/state.js` | Singleton `{ active: false }`. Every looping operation checks `state.active` to support mid-run stops. |
| `src/util/params-back.js` | Builds structured DB objects from raw TG message results (vid, pic, text). |
| `src/forward-all/forward-all-store.js` | Iterates a message ID range, forwards each to a target chat, builds a store object by type, saves to MongoDB. |
| `src/caption-all/caption-all-lookup.js` | Iterates a message range, looks up caption text from MongoDB, edits TG message captions in bulk. |
| `src/upload-pics/upload-pics.js` | Uploads images to TG from local filesystem or URL. Handles single file, directory, and URL variants. |

### Data Layer

`models/db-model.js` — single class wrapping the MongoDB native driver. Constructed with `(dataObject, collectionName)`. All DB operations go through this class. Connection is established at module load (`await dbConnect()` at top-level).

`middleware/db-config.js` — holds the live `db` reference via module-level closure; `dbGet()` returns it.

### Auth

Session-based via `express-session`. `POST /site-auth-route` checks `req.body.pw` against `process.env.PW` and sets `req.session.authenticated`. The `requireAuth` middleware gates all protected routes.

### Frontend (`public/`)

Vanilla JS with no build step. All files use ES modules (`<script type="module">`).

- `js/main.js` — entry point; builds the UI from components
- `js/run.js` — action handlers (submit command, stop, auth, toggle password visibility, switch action type)
- `js/util/define-things.js` — central config: DOM element refs, `commandMap` (button ID → command string), `actionButtonMap` (which form fields to show per command)
- `js/util/params-front.js` — reads form inputs and assembles the payload sent to `/tg-submit-route`
- `js/util/api-front.js` — `sendToBack()` wrapper around `fetch`
- `js/display/` — functions that build/update DOM sections (action buttons, main form, return data display)


### Stop Mechanism

Posting `{ command: "stop" }` to `/tg-submit-route` sets `state.active = false`. All looping operations (`for` loops over message ranges, upload batches) check `state.active` on each iteration and return early if false.

### Token Rotation

`tg-api.js` maintains a module-level `tokenIndex`. After every API call, `checkToken(data)` inspects the response — if the request failed due to rate-limiting (no `ok: true` and no non-429 error code), it increments `tokenIndex` (wrapping at 10) and the caller retries the same operation with the new token.
