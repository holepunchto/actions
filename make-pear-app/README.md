# Make Pear Apps :pear:

GitHub Action to build Pear apps on Linux, macOS, and Windows, with code signing and artifact upload.

## Inputs

### Build Inputs

| Input         | Description                                                                      | Required |
| ------------- | -------------------------------------------------------------------------------- | -------- |
| `channel`     | Channel name (e.g. `preview`, `experimental`, `staging`)                         | Yes      |
| `upgrade_key` | Upgrade key (e.g. `pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o`) | No       |
| `standalone`  | Standalone executable to upload                                                  | No       |

### Windows

| Input                     | Description                                      | Required                                                       |
| ------------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `windows_msix`            | Windows MSIX to upload                           | No                                                             |
| `windows_zip`             | Windows ZIP to upload                            | No                                                             |
| `windows_signing_method`  | Signing method to use: `cert_sha1` or `cert_pfx` | Required on Windows                                            |
| `windows_cert_sha1`       | SHA1 thumbprint of the Windows cert              | Required on Windows if `windows_signing_method` is `cert_sha1` |
| `windows_cert_pfx_base64` | Base64-encoded Windows cert pfx file             | Required on Windows if `windows_signing_method` is `cert_pfx`  |
| `windows_cert_password`   | Password for the Windows certificate             | Required on Windows if `windows_signing_method` is `cert_pfx`  |

### macOS

| Input                       | Description                                                                    | Required                                                                |
| --------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `macos_dmg`                 | macOS DMG to upload                                                            | No                                                                      |
| `macos_app`                 | macOS app bundle tarball to upload                                             | No                                                                      |
| `macos_certificate_base64`  | Base64 Apple development certificate (P12)                                     | Required on macOS                                                       |
| `macos_p12_password`        | Password for the P12 certificate                                               | Required on macOS                                                       |
| `macos_codesign_identity`   | Code signing identity                                                          | Required on macOS                                                       |
| `macos_notarization_method` | Notarization method to use: `appstore_connect` or `apple_id_password`          | Required on macOS                                                       |
| `macos_apple_id`            | Apple ID email for notarization                                                | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_apple_password`      | Apple app-specific password                                                    | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_apple_team_id`       | Apple Developer Team ID                                                        | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_api_key_base64`      | Base64-encoded App Store Connect API key (like AuthKey_ABCD123456.p8)          | Required on macOS if `macos_notarization_method` is `appstore_connect`  |
| `macos_api_key_id`          | 10-character alphanumeric ID string of the App Store Connect (like ABCD123456) | Required on macOS if `macos_notarization_method` is `appstore_connect`  |
| `macos_api_issuer`          | UUID that identifies the API key issuer                                        | Required on macOS if `macos_notarization_method` is `appstore_connect`  |

### Linux

| Input            | Description              | Required             |
| ---------------- | ------------------------ | -------------------- |
| `linux_appimage` | Linux AppImage to upload | No, false by default |
| `linux_snap`     | Linux Snap to upload     | No, false by default |
| `linux_flatpak`  | Linux Flatpak to upload  | No, false by default |

## Usage

### Windows

```yaml
jobs:
  build-win32:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
          windows_msix: Keet.msix
          windows_zip: Keet-win32-x64-4.17.0.zip
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
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
          macos_dmg: Keet-4.17.0-arm64.dmg
          macos_app: Keet-4.17.0-arm64.app.tgz
          macos_certificate_base64: ${{ secrets.CERTIFICATE_P12 }}
          macos_p12_password: ${{ secrets.CERTIFICATE_PASSWORD }}
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
      - uses: holepunchto/actions/make-pear-app@v1
        with:
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
          linux_appimage: Keet-4.17.0-x64.AppImage
          linux_snap: keet_4.17.0_amd64.snap
          linux_flatpak: keet_4.17.0_x64_flatpak.tar.gz
```
