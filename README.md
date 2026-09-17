# faraaz817.github.io

Personal portfolio and résumé site. Plain HTML/CSS/JS, no build step, no framework —
same approach as [Time Flow](https://github.com/faraaz817/time-flow-web).

Live at [faraaz817.github.io](https://faraaz817.github.io) once Pages is enabled (see below).

## Structure

- `index.html` — the page (About, Experience, Projects, Publication, Skills, Education, Contact)
- `style.css` — theme (light/dark, follows system preference or the toggle in the top bar)
- `script.js` — theme toggle, mobile nav, scroll-reveal
- `Faraaz_Mohammed_Resume.pdf` — downloadable résumé, sourced from `Job_revive/Faraaz_Mohammed_Resume_Base.pdf`

## Publishing

1. Create a **public** GitHub repo named exactly `faraaz817.github.io` under the `faraaz817` account.
2. From this directory:
   ```bash
   git remote add origin https://github.com/faraaz817/faraaz817.github.io.git
   git branch -M main
   git push -u origin main
   ```
3. In the repo's Settings → Pages, set Source to "Deploy from a branch", branch `main`, folder `/ (root)`.
   (A user/org site at the `<user>.github.io` name usually only needs the push — Pages turns on
   automatically the first time.)
4. Site is live at `https://faraaz817.github.io` within a minute or two.

## Updating content

Edit the arrays of sections directly in `index.html` — there's no data file or generator, unlike
the résumé build in `Job_revive/_build/`. When the résumé changes there, re-copy the PDF:

```bash
cp ../Job_revive/Faraaz_Mohammed_Resume_Base.pdf ./Faraaz_Mohammed_Resume.pdf
```

and update `index.html` to match (Experience, Projects, Skills, Education sections mirror the résumé).
