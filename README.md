# Winter Score Static Site

This folder is a dependency-free static rebuild of the current one-page Wix site.

## Local Preview

From this folder:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Files To Edit

- `index.html`: page copy, credits, footer email, Instagram link
- `styles.css`: visual design, spacing, responsive behavior
- `script.js`: audio playlist titles, durations, and file paths
- `assets/images`: optimized logo, portrait, and poster images
- `assets/audio`: audio excerpts

## Budget Hosting Recommendation

Use Cloudflare Pages or Netlify. Both can host this static site for free with SSL and a custom domain.

Cloudflare Pages is the best long-term low-cost setup if you are comfortable moving DNS to Cloudflare. Netlify is slightly friendlier for drag-and-drop deploys.

## Domain Launch Checklist

1. Keep the domain registration active wherever `winterscore.com` is registered.
2. Publish this folder to Cloudflare Pages or Netlify.
3. Add both `winterscore.com` and `www.winterscore.com` as custom domains in the host dashboard.
4. Update DNS only after the new preview URL works.
5. Use the hosting provider's recommended DNS records.
6. Wait for SSL/HTTPS to finish provisioning.
7. Test:
   - `https://winterscore.com`
   - `https://www.winterscore.com`
   - mobile layout
   - audio playback
   - email link
   - Instagram link

## Important Before Final Launch

The current preview uses WAV audio files because the local machine did not have a working AAC/MP3 encoder available. For the public launch, compress the audio to `.mp3` or `.m4a`, or host the tracks on a music platform and embed them. This keeps the site faster and reduces hosting/storage friction.

Recommended target:

- Audio: `.mp3` or `.m4a`, 128-192 kbps
- Posters: `.webp`, roughly 700-1000 px tall
- Portrait/logo: optimized PNG/WebP

## Updating The Site Later

To add a new credit:

1. Add the optimized poster image to `assets/images`.
2. Duplicate one `<article class="poster-card">` block in `index.html`.
3. Update the image path and alt text.

To add a new audio cue:

1. Add the audio file to `assets/audio`.
2. Add a new object to the `tracks` array in `script.js`.
3. Update the title, duration, and file path.
