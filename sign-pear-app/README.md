# Sign Pear App

Sign artifacts built by [`make-pear-app`](../make-pear-app) in a separate job.

The build job runs the app's dependency code (node modules), so it gets no signing credentials. The signing job only downloads the built artifact, signs it with platform tools (no checkout of app code, no npm install), and re-uploads it under the same name.

- `sign-pear-app/macos`: unzips the `.app` from a `macos_app` artifact (refusing paths or symlinks that lead outside it), signs it with `codesign`, nested code first, then for `darwin` notarizes and staples it, or for `mas` embeds the provisioning profile and optionally builds a signed `.pkg` with `productbuild`.
- `sign-pear-app/windows`: signs every file in the artifact with the Windows SDK `signtool`.

## Inputs

### macOS

| Input                                                                                  | Description                                                                                                                                                                        | Required                |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `artifact`                                                                             | Artifact holding one `.zip` of one `.app`                                                                                                                                          | Yes                     |
| `platform`                                                                             | `darwin` (hardened runtime, notarized) or `mas` (`darwin` by default)                                                                                                              | No                      |
| `identity`                                                                             | Code signing identity                                                                                                                                                              | Yes                     |
| `entitlements`                                                                         | Entitlements rules file in the workspace: one `<regex> <plist>` per line, first match against the path inside the `.app` (like `/Contents/MacOS/App`) wins, the app itself is `""` | Yes                     |
| `certificate_base64`, `certificate_password`                                           | Signing certificate (P12)                                                                                                                                                          | Yes                     |
| `notarization_method`                                                                  | `appstore_connect` or `apple_id_password`                                                                                                                                          | For `darwin`            |
| `apple_id`, `apple_password`, `apple_team_id`                                          | Credentials for `apple_id_password`                                                                                                                                                | For `apple_id_password` |
| `api_key_base64`, `api_key_id`, `api_issuer`                                           | Credentials for `appstore_connect`                                                                                                                                                 | For `appstore_connect`  |
| `provisioning_profile_base64`                                                          | Provisioning profile to embed                                                                                                                                                      | For `mas`               |
| `pkg`                                                                                  | Name of a signed `.pkg` to build and upload                                                                                                                                        | No                      |
| `installer_identity`, `installer_certificate_base64`, `installer_certificate_password` | Installer identity and certificate for the `.pkg`                                                                                                                                  | With `pkg`              |

### Windows

| Input             | Description                                                        | Required        |
| ----------------- | ------------------------------------------------------------------ | --------------- |
| `artifact`        | Artifact whose files are signed                                    | Yes             |
| `signing_method`  | `cert_sha1` (certificate already installed, default) or `cert_pfx` | No              |
| `cert_sha1`       | SHA1 thumbprint of the installed certificate                       | For `cert_sha1` |
| `cert_pfx_base64` | Base64-encoded pfx certificate                                     | For `cert_pfx`  |
| `cert_password`   | Password for the pfx certificate                                   | For `cert_pfx`  |

## Usage

```yaml
jobs:
  package-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/actions/node-base-extended@v1
        with:
          clean-install: true
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          script: package
          channel: production
          macos_app: Keet-4.17.0-arm64.app.zip

  sign-macos:
    needs: package-macos
    runs-on: macos-latest
    environment: signing
    steps:
      - uses: actions/checkout@v4
        with:
          sparse-checkout: entitlements
          persist-credentials: false
      - uses: holepunchto/actions/sign-pear-app/macos@v1
        with:
          artifact: Keet-4.17.0-arm64.app.zip
          identity: ${{ secrets.MAC_CODESIGN_IDENTITY }}
          entitlements: entitlements/darwin.rules
          certificate_base64: ${{ secrets.CERTIFICATE_P12 }}
          certificate_password: ${{ secrets.CERTIFICATE_PASSWORD }}
          notarization_method: apple_id_password
          apple_id: ${{ secrets.APPLE_ID }}
          apple_password: ${{ secrets.APPLE_PASSWORD }}
          apple_team_id: ${{ secrets.APPLE_TEAM_ID }}

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/actions/node-base-extended@v1
        with:
          clean-install: true
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          channel: production
          windows_msix: Keet-win32-x64-4.17.0.msix

  sign-windows:
    needs: build-windows
    runs-on: windows-signer
    environment: signing
    steps:
      - uses: holepunchto/actions/sign-pear-app/windows@v1
        with:
          artifact: Keet-win32-x64-4.17.0.msix
          cert_sha1: ${{ secrets.WINDOWS_CERT_SHA1 }}
```

Keep signing secrets in an environment that only signing jobs use, and don't run builds on runners that hold signing certificates.
