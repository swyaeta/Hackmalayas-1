# Hackmalayas 🏔️

A 4-day flagship Hack Club **YSWS (You Ship, We Ship)** event happening in the Himalayas — **Estimated in March 2027**.

Inspired by [Hack Oasis](https://hack-oasis-3sdu.vercel.app/).

---

## 📁 Project Structure

```
hackmalayas/
├── index.html           # Main single-page scrollable structure
├── style.css            # Styles, responsive layout & exact sky color (#2767b2)
├── script.js            # Interactive FAQ accordion, RSVP modal & ambient snow
├── assets/
│   ├── himalayas.jpg    # Your original Himalayan mountain photo
│   └── flag-orpheus-top.svg # Hack Club flag
└── README.md
```

---

## 🚀 How to Run Locally

### Option 1: Directly in Browser
Double-click `index.html` to open it in any web browser.

### Option 2: Local HTTP Server (Python)
Open a terminal in this folder and run:
```bash
python -m http.server 3000
```
Then visit: `http://localhost:3000`

---

## 🎨 Design Highlights

- **Exact Sky Color Match**: `#2767b2` sampled directly from the top sky of `himalayas.jpg`. When you scroll past the hero mountain image, the entire remaining site smoothly blends with this sky tone.
- **Hack Club Flag**: Pinned top-left Orpheus flag badge linking to Hack Club.
- **Hack Oasis Aesthetic**: Warm parchment rounded cards (`border-radius: 32px`), custom outlined headings (`Kavoon`), serif display title (`Playfair Display`), and retro 3D buttons (`Press Start 2P`).
- **Interactive FAQ Accordion**: Expandable Q&A accordion.
- **RSVP Interest Modal**: Click **START** to open the interest dialog and record entries in `localStorage`.
- **Himalayas Mode**: Ambient falling snow toggle in the top-right corner.

---

## 🌐 Deploying to Vercel / GitHub Pages

- **Vercel**: Run `vercel` in this folder or connect your GitHub repository on [vercel.com](https://vercel.com).
- **GitHub Pages**: Push this repo to GitHub and enable Pages in repository settings under `Settings > Pages`.
