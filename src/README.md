# Development & Build

## Dev-Setup
0. Clone the project into your dev-environment
1. Build the extension
2. Create a (symlink)[https://www.howtogeek.com/297721/how-to-create-and-use-symbolic-links-aka-symlinks-on-a-mac/] from the output-file into your local directus project (A basic alias won't work!)

### NOTE:
// TODO: Seems like a symlink work in production, but changes are not recognised by the auto-reload function of directus.

As for now copy the whole repo into your project extensions folder (e.g `<your-directus-project>/extensions/hooks/directus-extension-upload-limiter`) and change the build-path to `"index.js",`:

**!! THIS IS ONLY REQUIRED FOR A DEV-SETUP !!**

````
"directus:extension": {
    "path": "index.js",
    [...]
  },
````

>
> You'll most likely set the (EXTENSIONS_AUTO_RELOAD environment variable)[https://docs.directus.io/configuration/config-options] while developing.
>

## Commands
### One-time build
````
npm run build
````

### Dev-Build (watch changes)
````
npm run dev
```