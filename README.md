# STRATAOACK

Website for STRATAOACK, a geoscience consultancy in Accra, Ghana.

## Stack

Vite, React 19, TypeScript, and React Router 7. Styles are in `src/styles/global.css`. Page copy is in `src/data`.

## Run locally

```bash
npm install
npm run dev
```

Dev server: http://127.0.0.1:8742.

To exercise the PHP form from that server, start PHP in another terminal:

```bash
php -S 127.0.0.1:8755 -t public
```

Vite proxies `/api/contact.php` to that process.

## Build

```bash
npm run build
npm run preview
```

`npm run build` typechecks, then writes `dist/`. Preview serves that folder at http://127.0.0.1:8743. `npm run lint` runs oxlint.

## Forms

Contact and the speculative CV form post to the endpoint chosen by `VITE_FORM_PROVIDER` at build time. The value is compiled in, so change it and build again.

| Value | Where it posts |
| --- | --- |
| `php` (default) | `/api/contact.php` |
| `netlify` | Netlify Forms at `/` |
| `vercel` | `/api/contact` |

`VITE_FORM_ENDPOINT` overrides the path. See `.env.example`.

Both forms email strataoack@gmail.com and eustaceocrentsil@gmail.com. The CV field accepts one PDF, DOC, or DOCX up to 5 MB.

### cPanel

Build with `VITE_FORM_PROVIDER` unset or set to `php`. Upload the contents of `dist/` to the domain document root, including `api/`, `.htaccess`, and `_redirects`.

In `api/`, copy `config.example.php` to `config.php` and edit that copy on the server. Do not commit `config.php`. `api/.htaccess` blocks browsers from reading it. Set `from_email` to a mailbox on the domain. `transport` is `mail` or `smtp` (host, port 587, `tls`, mailbox username and password). `to` lists the two addresses above. In MultiPHP, set `upload_max_filesize` and `post_max_size` to at least `8M`.

### Vercel

`vercel.json` sets `VITE_FORM_PROVIDER=vercel` and rewrites other paths to `index.html`. The function sends mail with Resend. Set these on the Vercel project:

- `RESEND_API_KEY`
- `RESEND_FROM` — a sender on a domain verified in Resend, such as `STRATAOACK <noreply@your-domain.com>`
- `FORM_TO` — optional comma-separated recipients; otherwise the two Gmail addresses above

Redeploy after changing them.

### Netlify

`netlify.toml` sets `VITE_FORM_PROVIDER=netlify` and publishes `dist/`. That build keeps the static `contact` and `careers` forms in `index.html` so Netlify can detect them, including the CV file field. Other builds omit those forms. After the first deploy, turn on email notifications for both forms in the Netlify site settings.
