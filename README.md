# Fandom Character Atlas

A GitHub Pages ready, static fandom library and character relationship atlas.

## Included

- English is the default interface. Use the language button to switch to Arabic.
- A sidebar with separate Fandoms and Ships pages. The current page is remembered after refresh.
- A fandom library organized by manga, anime, Korean web novels, Chinese web novels, and fanfiction. Semi-Coercive Imperialist is already included.
- Search and tags for fandoms, characters, and ships.
- Character cards with backgrounds, group colors, and spoiler controls. Add characters from **Add character**.
- A standalone **Ships** page available from the sidebar, keeping the card layout. Each card shows Type, Fandom, Image, Ship, Trope, Year, and Active Fanbase. Search and filter by those details, edit any ship, and add or remove custom pairings.
- Offline autocomplete data from the workbook: 39,926 fandom/work titles, 383 tropes, and names in its existing pairings. New character names are also suggested from the selected fandom’s character list.
- JSON export/import for fandoms, characters, chapter notes, custom ships, and edits to workbook ships.
- Optional Supabase email sign-in and cloud sync. Sign in on another device to load the same atlas.

## Put it on GitHub Pages

1. Extract the ZIP.
2. Upload all files inside `Fandom_Character_Atlas` to the root of your GitHub repository: `index.html`, `app.js`, `ship-data.js`, `.nojekyll`, and optionally `README.md`.
3. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. After deployment, open the Pages URL shown in the settings.

## Saving and database behavior

The workbook data is packaged with the site, so autocomplete works without a server. Your additions and edits are saved in the current browser when signed out. Use the account bar at the top to create an account or sign in; once signed in, the site saves your atlas to your Supabase `public.atlas_data` row and loads it on other devices. The site uses the project URL and a browser-safe publishable key. Keep Row Level Security enabled and never add a secret or service-role key to the site files. Export/Import remains available for backups.

The original character notes are available in Arabic. In English mode, untranslated Arabic descriptions are left blank rather than shown in Arabic.
