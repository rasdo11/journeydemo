# JourneySpan demo site

An interactive demo of JourneySpan, walked through in four views, each mapped to
one research aim:

1. **Status quo**: the EPIC-26 questionnaire as it works today (the baseline problem)
2. **Patient experience** (Aim 2): the recovery span, with multimodal, optional, non-linear submissions across 0 to 12 months
3. **Surgeon & post-care** (Aim 1): the operative note linked to the recovery domains it may be associated with
4. **Clinician review** (Aim 3): a recovery-risk model that flags patients deviating from their expected continence trajectory, for clinician review only

A fifth view, **Journey Snapshot** (`src/views/JourneySnapshot.jsx`), is a consumer/patient
concept preview. It's intentionally not one of the four numbered steps above, but it's reachable
through a small "Also worth a look" link at the bottom of every step, for showing reviewers a
direction the product could take and talking through where it might fit.

All data is synthetic. This is a prototype for demonstration, not a clinical product.

---

## Run it on your computer

You don't need to know how to code. Just follow these steps in order.

### 1. Install Node.js (one time)
Go to **https://nodejs.org** and download the **LTS** version. Install it like any app.
This gives you the `npm` command the project needs.

### 2. Open a terminal in this folder
- **Mac:** right-click the `journeydemo` folder → "New Terminal at Folder"
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
Change the data there and all four views update.

---

## What's where

```
journeydemo/
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
   │  └─ Nav.jsx              the top navigation (the 4 demo steps)
   ├─ data/
   │  └─ mockData.js          ★ all the synthetic data, in one file
   └─ views/
      ├─ StatusQuo.jsx        view 1: EPIC-26 today
      ├─ PatientRoad.jsx      view 2: the recovery span (Aim 2)
      ├─ Surgeon.jsx          view 3: operative note linked to recovery (Aim 1)
      ├─ RiskPanel.jsx        view 4: clinician recovery-risk review (Aim 3)
      └─ JourneySnapshot.jsx  parked: consumer preview, not in the walkthrough
```
