# Directus extension: Upload Limiter
>
> A custom extension which tracks the aggegated filesize of all uploads by a user and allows to set an project-wide upload limit.
> Hooks into create (update) and delete hooks of directus_files and calculates the upload-size
>

# NOTES
* The extension only allows to add a project-wide upload-limit. User-based upload limits may be added in the future
* The upload-limit can only be used for registered users. Files uploaded by unauthenticated users currently can't be tracked

# ToDos
* TODO: #1 create user-based limits
* TODO: #2 track uploaded files from public users
* TODO: #3 publish extension
* TODO: #4 add option to re-calculate everything (important: resource heavy operation)

# Install
0. Run `npm install` and build the extension
1. Copy the file `dist/upload-limiter.js` to your projects `extensions/hooks` folder
2. Copy the migrations from `src/_migrations` to your projects migration folder
3. Run the migrations (See Docs)[https://docs.directus.io/extensions/migrations/#migrations-and-directus-schema]
4. Start the application, upload a file and track the data inside the user-profile (column: `directus-extension-upload-limiter`)

# Config
## Add global upload-limit (for all users aggregated)
* Add a upload-limit in the config-file: `DIRECTUS_EXTENSION_UPLOAD_LIMITER_GLOBAL_LIMIT=[upload_limit_in_bytes]`
  * Note: this might change later once a key-value store is available for extensions. In this case we might drop the env support and switch to the DB-Version which also allows changing values on the fly
  * Note: The upload-limit is given in bytes (100GB = 107374182400b)

# Build / Develop
## Dev-Setup
0. Clone the project into your dev-environment
1. Build the extension
2. Hotlink the output into your lokal directus project

>
> You'll most likely set the (EXTENSIONS_AUTO_RELOAD environment variable)[https://docs.directus.io/configuration/config-options] while developing.
>
## One-time build
````
npm run build
````

## Dev-Build (watch changes)
````
npm run directus-extension build --watch
```