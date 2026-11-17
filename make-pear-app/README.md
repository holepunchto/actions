# Make Pear Apps :pear:

GitHub Action to build Pear apps on Linux, macOS, and Windows, with code signing and artifact upload.

Signing is enabled by default on macOS and Windows; missing required certificate inputs fail before the build. For unsigned builds, explicitly set `unsigned: true`, omit signing credentials, and configure the app's build to skip signing when no identity or hook is supplied. Linux builds are unchanged.

## Inputs

### Build Inputs

| Input                      | Description                                                                      | Required |
| -------------------------- | -------------------------------------------------------------------------------- | -------- |
| `script`                   | Build script (`make` by default)                                                 | No       |
| `channel`                  | Channel name (e.g. `preview`, `experimental`, `staging`)                         | Yes      |
| `upgrade_key`              | Upgrade key (e.g. `pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o`) | No       |
| `host`                     | Host passed to `npm run make` as environment variable.                           | No       |
| `sfw`                      | Enable Socket Firewall. (`true` by default)                                      | No       |
| `unsigned`                 | Skip macOS and Windows signing setup (`false` by default)                        | No       |
| `standalone`               | Standalone executable to upload                                                  | No       |
| `standalone_artifact_name` | Standalone uploaded artifact name                                                | No       |

### Windows

| Input                        | Description                                      | Required                           |
| ---------------------------- | ------------------------------------------------ | ---------------------------------- |
| `windows_msix`               | Windows MSIX to upload                           | No                                 |
| `windows_msix_artifact_name` | Windows MSIX uploaded artifact name              | No                                 |
| `windows_zip`                | Windows ZIP to upload                            | No                                 |
| `windows_zip_artifact_name`  | Windows ZIP uploaded artifact name               | No                                 |
| `windows_signing_method`     | Signing method to use: `cert_sha1` or `cert_pfx` | No; defaults to thumbprint signing |
| `windows_cert_sha1`          | SHA1 thumbprint of the Windows cert              | Required for `cert_sha1` signing   |
| `windows_cert_pfx_base64`    | Base64-encoded Windows cert pfx file             | Required for `cert_pfx` signing    |
| `windows_cert_password`      | Password for the Windows certificate             | Required for `cert_pfx` signing    |

### macOS

Unless `unsigned: true`, provide at least one of the three certificate inputs below. Signing identities can be supplied explicitly or selected by the app's build configuration.

| Input                                             | Description                                                                             | Required                                                                |
| ------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `macos_app`                                       | macOS app bundle ZIP archive to upload                                                  | No                                                                      |
| `macos_dmg`                                       | macOS DMG to upload                                                                     | No                                                                      |
| `macos_dmg_artifact_name`                         | macOS DMG uploaded artifact name                                                        | No                                                                      |
| `macos_mas_pkg`                                   | macOS MAS PKG to upload                                                                 | No                                                                      |
| `macos_mas_pkg_artifact_name`                     | macOS MAS PKG uploaded artifact name                                                    | No                                                                      |
| `macos_development_certificate_base64`            | Base64 Apple development certificate (P12)                                              | No                                                                      |
| `macos_development_password`                      | Password for the P12 certificate                                                        | No                                                                      |
| `macos_codesign_identity`                         | Code signing identity                                                                   | No                                                                      |
| `macos_distribution_certificate_base64`           | Base64 Apple distribution certificate (P12)                                             | No                                                                      |
| `macos_distribution_password`                     | Password for the P12 certificate                                                        | No                                                                      |
| `macos_distribution_identity`                     | Distribution identity used for macOS App Store builds                                   | Required for macOS App Store signing                                    |
| `macos_installer_distribution_certificate_base64` | Base64 macOS installer distribution certificate (P12)                                   | No                                                                      |
| `macos_installer_distribution_password`           | Password for the P12 certificate                                                        | No                                                                      |
| `macos_installer_distribution_identity`           | Distribution identity used for macOS App Store PKG Installer builds                     | No                                                                      |
| `macos_distribution_provisioning_profile_base64`  | Base64-encoded Apple distribution provisioning profile for MAS build (provisionprofile) | No                                                                      |
| `macos_notarization_method`                       | Notarization method to use: `appstore_connect` or `apple_id_password`                   | No                                                                      |
| `macos_apple_id`                                  | Apple ID email for notarization                                                         | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_apple_password`                            | Apple app-specific password                                                             | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_apple_team_id`                             | Apple Developer Team ID                                                                 | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_api_key_base64`                            | Base64-encoded App Store Connect API key (like AuthKey_ABCD123456.p8)                   | Required on macOS if `macos_notarization_method` is `appstore_connect`  |
| `macos_api_key_id`                                | 10-character alphanumeric ID string of the App Store Connect (like ABCD123456)          | Required on macOS if `macos_notarization_method` is `appstore_connect`  |
| `macos_api_issuer`                                | UUID that identifies the API key issuer                                                 | Required on macOS if `macos_notarization_method` is `appstore_connect`  |

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

### Unsigned builds

Use a hosted runner without signing credentials, set `unsigned: true`, and omit the signing inputs. Build scripts and artifact uploads run normally; certificate import and notarization setup are skipped, and signing identities and the Windows signing hook are left empty.

```yaml
jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/actions/node-base-extended@v1
        with:
          version: 24
          clean-install: true
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          channel: dev
          unsigned: true
          macos_app: unsigned-macos-app.zip
          windows_msix: '*.msix'
          windows_msix_artifact_name: unsigned-windows-msix
```

The action runs the app's npm `make` script, or the script selected by `script`. Keep any app-specific dependency preparation before that step. The app's build configuration must allow unsigned builds. For example, if the app uses Electron Forge:

- On macOS, only configure Forge's `osxSign` and `osxNotarize` when `MAC_CODESIGN_IDENTITY` is nonempty.
- For `@electron-forge/maker-msix` on Windows, set `sign: false` when `WINDOWS_SIGN_HOOK` is empty. The maker otherwise defaults to signing. Example signing settings for this Forge maker:

  ```js
  const hook = process.env.WINDOWS_SIGN_HOOK
  const signing = hook ? { windowsSignOptions: { hookModulePath: hook } } : { sign: false }
  ```

  Merge `signing` into the maker's `config` object in your Forge configuration. Only require signing credentials when signing is requested.

The action does not override signing hardcoded in app scripts. Omitting credentials does not opt out of signing: use `unsigned: true`. Existing signed callers keep their signing behavior without setting this input. Unsigned artifacts can be signed later; for macOS, sign the extracted `.app` before creating the final distribution archive or DMG.

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
          windows_msix: Keet.msix
          windows_msix_artifact_name: Keet-win32-x64-4.17.0-msix
          windows_zip: Keet-win32-x64-4.17.0.zip
          windows_zip_artifact_name: Keet-win32-x64-4.17.0-zip
          windows_signing_method: cert_sha1
          windows_cert_sha1: ${{ secrets.WINDOWS_CERT_SHA1 }}
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
          macos_development_certificate_base64: ${{ secrets.DEVELOPMENT_CERTIFICATE_BASE64 }}
          macos_development_password: ${{ secrets.CERTIFICATE_PASSWORD }}
          macos_codesign_identity: ${{ secrets.MAC_CODESIGN_IDENTITY }}
          macos_notarization_method: apple_id_password
          macos_apple_id: ${{ secrets.APPLE_ID }}
          macos_apple_password: ${{ secrets.APPLE_PASSWORD }}
          macos_apple_team_id: ${{ secrets.APPLE_TEAM_ID }}
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
