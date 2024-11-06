# Remix + Drizzle + Cloudflare template

## Remix

| Remix                                                                | Styling                                             | Database                                    | Vite & Cloudflare                                                  |
| -------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| 📖 [Remix docs](https://remix.run/docs)                              | 📖 [Headless UI](https://headlessui.com/)           | 📖 [Drizzle ORM](https://orm.drizzle.team/) | 📖 [Vite docs on css](https://vitejs.dev/guide/features.html#css) |
| 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)   | 📖 [Catalyst](https://catalyst.tailwindui.com/docs) |                                             |                                                                   [Cloudflare API](https://developers.cloudflare.com/api/operations/pages-project-get-projects) |
| 📖 [Remix guide](https://remix.guide/)                               | 📖 [Tailwind CSS](https://tailwindcss.com/)         |                                             |                                                                   |

## Development

Local server

```sh
noderun # start docker bash session
npm install

nodeapp (npm run dev) # start local server
```

## Deployment

On first use, create the main branch (preview) and the production (production) branch

```sh
# add remotes
git init
git remote add origin REMOTE_URL
git remote -v

# create main branch
git checkout main
git push --set-upstream origin main

# create production branch
git checkout -b production
git push -u origin production
```

Make any changes and test locally, then

```sh
git checkout main
git add .
git commit -m ""
git push origin main
```

to push changes to Cloudflare Pages `preview`

Once tested on preview, deploy your app to Cloudflare Pages `production`:

```sh
git checkout production
git merge main
git push origin production
```

## Useful commands

```sh
# show all remix routes
npx remix routes
```
