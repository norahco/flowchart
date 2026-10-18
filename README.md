# Fandom Character Atlas

A GitHub Pages ready, static fandom library and character relationship atlas.

## Included

- English is the default interface. Use the language button to switch to Arabic.
- A sidebar with separate Fandoms, Ships, and Glossary pages. The current page is remembered after refresh.
- A paginated, searchable Glossary that lists the full master fandom catalog (about 39,926 names), atlas characters, ships, chapter notes, tags, tropes, categories, groups, and saved lookup entries. Names are marked by source; saved suggestion names do not create fandom pages.
- Excel export/import for the full data set. `AppData` is the complete backup; the fandom pages, characters, ships, chapter notes, glossary, saved suggestions, and master fandom/ship/trope sheets can be edited and uploaded to apply changes.
- A fandom library organized by manga, anime, Korean web novels, Chinese web novels, and fanfiction. Semi-Coercive Imperialist is already included.
- Search and tags for fandoms, characters, and ships.
- Character cards with backgrounds, group colors, and spoiler controls. Add characters from **Add character**.
- A standalone **Ships** page available from the sidebar, keeping the card layout. Each card shows Type, Fandom, Image, Ship, Trope, Year, and Active Fanbase. Search and filter by those details, edit any ship, and add or remove custom pairings.
- The bundled workbook supplies an editable starting catalog of fandom/work titles, 383 tropes, and existing pairings. New character names are suggested from the selected fandom’s character list.
- JSON and Excel backup/restore for fandom pages, characters, chapter notes, custom ships, ship edits, saved reference names, and glossary entries.
- Optional Supabase email sign-in and cloud sync. Sign in on another device to load the same atlas.

## Put it on GitHub Pages

1. Extract the ZIP.
2. Upload all files inside `Fandom_Character_Atlas` to the root of your GitHub repository: `index.html`, `app.js`, `ship-data.js`, `cloud-sync.js`, `supabase-config.js`, `.nojekyll`, and `README.md`.
3. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. After deployment, open the Pages URL shown in the settings.

## Saving and database behavior

The master catalog is packaged with the site, so browsing works without a server. Your additions and edits, including saved fandom names and master-catalog updates from Excel, are saved in the current browser when signed out. Use the account bar at the top to create an account or sign in; once signed in, the site saves your account’s data in its Supabase `public.atlas_data` row and loads it on other devices. This is a per-account JSON record, not a shared catalog: glossary names and fandom pages are separate, and only fandom pages appear in the Fandoms library. Glossary and imported catalog updates sync with the account too. The site uses the project URL and a browser-safe publishable key. Keep Row Level Security enabled and never add a secret or service-role key to the site files. Export/Import remains available for backups.

The original character notes are available in Arabic. In English mode, untranslated Arabic descriptions are left blank rather than shown in Arabic.


## Notes workspace
The Notes section is a document-style workspace with pages and nested subpages, page icons and cover images, editable text, headings, lists, toggles, quotes, callouts, dividers, links, images, and Spotify/YouTube playlist embeds. To bring in a Notion page, export it from Notion as **HTML** with subpages included, then choose **Import Notion ZIP** and select the exported ZIP. The importer retains headings, rich text, lists, quotes, tables, toggles, internal page links, and exported image files where the HTML export exposes them. Notes are saved in this browser, included in JSON and Excel backups, and synced through the existing Supabase `atlas_data` record when signed in. The Excel workbook includes a `Notes` sheet with editable page metadata and `BlocksJSON`; `AppData` retains the full structured state.
