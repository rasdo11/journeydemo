# JourneySpan — demo site

An interactive demo of JourneySpan, walked through in three views:

1. **Status quo** — the EPIC-26 questionnaire as it works today (the simple baseline)
2. **Patient experience** — the recovery span: multimodal, optional, non-linear submissions
3. **Surgeon & post-care** — the operative note linked to patient recovery

All data is synthetic. This is a prototype for demonstration, not a clinical product.

---

## Run it on your computer

You don't need to know how to code. Just follow these steps in order.

### 1. Install Node.js (one time)
Go to **https://nodejs.org** and download the **LTS** version. Install it like any app.
This gives you the `npm` command the project needs.

### 2. Open a terminal in this folder
- **Mac:** right-click the `willow-demo` folder → "New Terminal at Folder"
- **Windows:** open the folder, click the address bar, type `cmd`, press Enter

### 3. Install the project's pieces (one time)
Type this and press Enter:
```
npm install
```
Wait for it to finish (a minute or two).

### 4. Start the site
```
npm run dev
```
You'll see a line like `Local: http://localhost:5173/`.
Open that link in your browser. The demo is running. Edits you make save and refresh live.

To stop it: press `Ctrl + C` in the terminal.

---

## Put it online (shareable link)

The easiest path with your Vercel account:

1. Create a free GitHub account if you don't have one, and put this folder in a new repository.
2. Go to **https://vercel.com**, click **Add New → Project**, and import that repository.
3. Vercel auto-detects Vite. Confirm:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Click **Deploy**. You get a public URL to share.

Every time you push changes to GitHub, Vercel redeploys automatically.

---

## Editing with Claude Code

Open this folder in Claude Code and just describe what you want changed.
Start by reading `CLAUDE.md` — it orients Claude Code to how the project is built.

**The one file you'll touch most:** `src/data/mockData.js`.
Every patient detail, score, question, road window, and operative note lives there.
Change the data there and all three views update.

---

## What's where

```
willow-demo/
├─ index.html                 the page shell
├─ package.json               project + dependencies
├─ vite.config.js             build config (leave as-is)
├─ CLAUDE.md                  orientation for Claude Code
├─ README.md                  this file
└─ src/
   ├─ main.jsx                starts the app
   ├─ App.jsx                 nav + which view is showing + prev/next bar
   ├─ index.css               fonts + page background
   ├─ theme.js                the JourneySpan colors (one place)
   ├─ components/
   │  └─ Nav.jsx              the top navigation (the 3 demo steps)
   ├─ data/
   │  └─ mockData.js          ★ all the synthetic data, in one file
   └─ views/
      ├─ StatusQuo.jsx        view 1 — EPIC-26 today
      ├─ PatientRoad.jsx      view 2 — the recovery span
      └─ Surgeon.jsx          view 3 — operative note → recovery
```
