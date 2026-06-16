# Make Pear Apps :pear:

GitHub Action to build Pear apps on Linux, macOS, and Windows, with code signing and artifact upload.

## Inputs

### Build Inputs

| Input         | Description                                                                      | Required |
| ------------- | -------------------------------------------------------------------------------- | -------- |
| `name`        | App name                                                                         | Yes      |
| `version`     | Version                                                                          | Yes      |
| `arch`        | Architecture                                                                     | Yes      |
| `channel`     | Channel name (e.g. `preview`, `experimental`, `staging`)                         | Yes      |
| `upgrade_key` | Upgrade key (e.g. `pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o`) | No       |

### Windows

| Input                     | Description                                                      | Required                                                               |
| ------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `windows_signing_method`  | Signing method to use: `windows_cert_sha1` or `windows_cert_pfx` | Required on Windows                                                    |
| `windows_cert_sha1`       | SHA1 thumbprint of the Windows cert                              | Required on Windows if `windows_signing_method` is `windows_cert_sha1` |
| `windows_cert_pfx_base64` | Base64-encoded Windows cert pfx file                             | Required on Windows if `windows_signing_method` is `windows_cert_pfx`  |
| `windows_cert_password`   | Password for the Windows certificate                             | Required on Windows if `windows_signing_method` is `windows_cert_pfx`  |

### macOS

| Input                       | Description                                                                    | Required                                                                |
| --------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
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

| Input           | Description              | Required            |
| --------------- | ------------------------ | ------------------- |
| `build_snap`    | Whether to build Snap    | No, true by default |
| `build_flatpak` | Whether to build Flatpak | No, true by default |

## Usage

### Windows

```yaml
jobs:
  build-win32:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/make-pear-app
        with:
          name: Keet
          version: 4.18.0
          arch: x64
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
          windows_signing_method: windows_cert_sha1
          windows_cert_sha1: ${{ secrets.WINDOWS_CERT_SHA1 }}
```

### macOS

```yaml
jobs:
  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: holepunchto/make-pear-app
        with:
          name: Keet
          version: 4.18.0
          arch: arm64
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
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
      - uses: holepunchto/make-pear-app
        with:
          name: Keet
          version: 4.18.0
          arch: x64
          channel: production
          upgrade_key: pear://jj7jywoj83pswtcf5asywbm4ngro3xikgg1zcaqq3kdyhghats6o
```
