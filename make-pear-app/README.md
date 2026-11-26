# Make Pear Apps :pear:

GitHub Action to build unsigned Pear apps on Windows, macOS and Linux and upload the artifacts.

The build runs the app's dependency code, so it gets no signing credentials. Sign the uploaded artifacts in a separate job with [`sign-pear-app`](../sign-pear-app). The app's build configuration must allow unsigned builds, e.g. with Electron Forge, set `sign: false` for `@electron-forge/maker-msix` and only configure `osxSign`/`osxNotarize` when a signing identity is set.

## Inputs

### Build Inputs

| Input                      | Description                                                                      | Required |
| -------------------------- | -------------------------------------------------------------------------------- | -------- |
| `script`                   | Build script (`make` by default)                                                 | No       |
| `channel`                  | Channel name (e.g. `preview`, `experimental`, `staging`)                         | Yes      |
| `upgrade_key`              | Upgrade key (e.g. `pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o`) | No       |
| `host`                     | Host passed to `npm run make` as environment variable.                           | No       |
| `sfw`                      | Enable Socket Firewall. (`true` by default)                                      | No       |
| `standalone`               | Standalone executable to upload                                                  | No       |
| `standalone_artifact_name` | Standalone uploaded artifact name                                                | No       |

### Windows

| Input                        | Description                         | Required |
| ---------------------------- | ----------------------------------- | -------- |
| `windows_msix`               | Windows MSIX to upload              | No       |
| `windows_msix_artifact_name` | Windows MSIX uploaded artifact name | No       |
| `windows_zip`                | Windows ZIP to upload               | No       |
| `windows_zip_artifact_name`  | Windows ZIP uploaded artifact name  | No       |

### macOS

| Input                         | Description                            | Required |
| ----------------------------- | -------------------------------------- | -------- |
| `macos_app`                   | macOS app bundle ZIP archive to upload | No       |
| `macos_dmg`                   | macOS DMG to upload                    | No       |
| `macos_dmg_artifact_name`     | macOS DMG uploaded artifact name       | No       |
| `macos_mas_pkg`               | macOS MAS PKG to upload                | No       |
| `macos_mas_pkg_artifact_name` | macOS MAS PKG uploaded artifact name   | No       |

### Linux

| Input                          | Description                           | Required |
| ------------------------------ | ------------------------------------- | -------- |
| `linux_appimage`               | Linux AppImage to upload              | No       |
| `linux_appimage_artifact_name` | Linux AppImage uploaded artifact name | No       |
| `linux_snap`                   | Linux Snap to upload                  | No       |
| `linux_snap_artifact_name`     | Linux Snap uploaded artifact name     | No       |
| `linux_flatpak`                | Linux Flatpak to upload               | No       |
| `linux_flatpak_artifact_name`  | Linux Flatpak uploaded artifact name  | No       |

## Usage

### Windows

```yaml
jobs:
  build-win32:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/actions/node-base-extended@v1
        with:
          allow-git: root
          clean-install: true
          version: 20
          registry-url: 'https://npm.pkg.github.com'
          node-auth-token: ${{ github.token }}
      - uses: holepunchto/actions/run-npm-script@v1
        with:
          script: postinstall:all
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
          windows_msix: Keet-win32-x64-4.17.0.msix
          windows_msix_artifact_name: Keet-win32-x64-4.17.0-msix
          windows_zip: Keet-win32-x64-4.17.0.zip
          windows_zip_artifact_name: Keet-win32-x64-4.17.0-zip
```

### macOS

```yaml
jobs:
  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/actions/node-base-extended@v1
        with:
          allow-git: root
          clean-install: true
          version: 20
          registry-url: 'https://npm.pkg.github.com'
          node-auth-token: ${{ github.token }}
      - uses: holepunchto/actions/run-npm-script@v1
        with:
          script: postinstall:mac
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
          macos_app: Keet-4.17.0-arm64.app.zip
          macos_dmg: Keet-4.17.0-arm64.dmg
          macos_dmg_artifact_name: Keet-4.17.0-arm64
```

### Linux

```yaml
jobs:
  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/actions/node-base-extended@v1
        with:
          allow-git: root
          clean-install: true
          version: 20
          registry-url: 'https://npm.pkg.github.com'
          node-auth-token: ${{ github.token }}
      - uses: holepunchto/actions/run-npm-script@v1
        with:
          script: postinstall:all
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
          linux_appimage: Keet-4.17.0-x64.AppImage
          linux_appimage_artifact_name: Keet-4.17.0-x64-appimage
          linux_snap: keet_4.17.0_amd64.snap
          linux_snap_artifact_name: keet_4.17.0_amd64-snap
          linux_flatpak: keet_4.17.0_x64_flatpak.tar.gz
          linux_flatpak_artifact_name: keet_4.17.0_x64-flatpak
```
