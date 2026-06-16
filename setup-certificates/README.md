# Setup certificates

GitHub Action to setup certificates on Windows and macOS.

## Inputs

### Windows

| Input                     | Description                                                      | Required                                                              |
| ------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| `windows_signing_method`  | Signing method to use: `windows_cert_sha1` or `windows_cert_pfx` | Required on Windows                                                   |
| `windows_cert_pfx_base64` | Base64-encoded Windows cert pfx file                             | Required on Windows if `windows_signing_method` is `windows_cert_pfx` |
| `windows_cert_password`   | Password for the Windows certificate                             | Required on Windows if `windows_signing_method` is `windows_cert_pfx` |

### macOS

| Input                       | Description                                                                    | Required                                                                |
| --------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `macos_certificate_base64`  | Base64 Apple development certificate (P12)                                     | Required on macOS                                                       |
| `macos_p12_password`        | Password for the P12 certificate                                               | Required on macOS                                                       |
| `macos_notarization_method` | Notarization method to use: `appstore_connect` or `apple_id_password`          | Required on macOS                                                       |
| `macos_apple_id`            | Apple ID email for notarization                                                | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_apple_password`      | Apple app-specific password                                                    | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_apple_team_id`       | Apple Developer Team ID                                                        | Required on macOS if `macos_notarization_method` is `apple_id_password` |
| `macos_api_key_base64`      | Base64-encoded App Store Connect API key (like AuthKey_ABCD123456.p8)          | Required on macOS if `macos_notarization_method` is `appstore_connect`  |
| `macos_api_key_id`          | 10-character alphanumeric ID string of the App Store Connect (like ABCD123456) | Required on macOS if `macos_notarization_method` is `appstore_connect`  |
| `macos_api_issuer`          | UUID that identifies the API key issuer                                        | Required on macOS if `macos_notarization_method` is `appstore_connect`  |

## Outputs

| Output                           | Description                    |
| -------------------------------- | ------------------------------ |
| `macos-keychain-profile`         | macOS keychain profile         |
| `windows-certificate-thumbprint` | Windows certificate thumbprint |

## Usage

```yaml

...
- name: 'Setup certificate'
  id: setup-certificates
  uses: holepunchto/actions/setup-certificates@v1
  with:
    macos_certificate_base64: ${{ inputs.macos_certificate_base64 }}
    macos_p12_password: ${{ inputs.macos_p12_password }}
    macos_notarization_method: ${{ inputs.macos_notarization_method }}
    macos_apple_id: ${{ inputs.macos_apple_id }}
    macos_apple_password: ${{ inputs.macos_apple_password }}
    macos_apple_team_id: ${{ inputs.macos_apple_team_id }}
    macos_api_key_base64: ${{ inputs.macos_api_key_base64 }}
    macos_api_key_id: ${{ inputs.macos_api_key_id }}
    macos_api_issuer: ${{ inputs.macos_api_issuer }}
    windows_signing_method: ${{ inputs.windows_signing_method }}
    windows_cert_pfx_base64: ${{ inputs.windows_cert_pfx_base64 }}
    windows_cert_password: ${{ inputs.windows_cert_password }}
...
KEYCHAIN_PROFILE: ${{ steps.setup-certificates.outputs.macos-keychain-profile }}
...
WINDOWS_CERT_SHA1: "${{ inputs.windows_signing_method == 'windows_cert_pfx' && steps.setup-certificates.outputs.windows-certificate-thumbprint || inputs.windows_cert_sha1 }}"
```
