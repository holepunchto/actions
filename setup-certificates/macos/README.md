# Setup certificates on macOS

GitHub Action to setup certificates on macOS.

## Inputs

### macOS

| Input                 | Description                                                                    | Required                                                 |
| --------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `certificate_base64`  | Base64 Apple development certificate (P12)                                     | Required                                                 |
| `p12_password`        | Password for the P12 certificate                                               | Required                                                 |
| `notarization_method` | Notarization method to use: `appstore_connect` or `apple_id_password`          | Required                                                 |
| `apple_id`            | Apple ID email for notarization                                                | Required if `notarization_method` is `apple_id_password` |
| `apple_password`      | Apple app-specific password                                                    | Required if `notarization_method` is `apple_id_password` |
| `apple_team_id`       | Apple Developer Team ID                                                        | Required if `notarization_method` is `apple_id_password` |
| `api_key_base64`      | Base64-encoded App Store Connect API key (like AuthKey_ABCD123456.p8)          | Required if `notarization_method` is `appstore_connect`  |
| `api_key_id`          | 10-character alphanumeric ID string of the App Store Connect (like ABCD123456) | Required if `notarization_method` is `appstore_connect`  |
| `api_issuer`          | UUID that identifies the API key issuer                                        | Required if `notarization_method` is `appstore_connect`  |

## Outputs

| Output             | Description      |
| ------------------ | ---------------- |
| `keychain-profile` | Keychain profile |

## Usage

```yaml

...
- name: 'Setup certificates on macOS'
  id: setup-certificates-macos
  uses: holepunchto/actions/setup-certificates/macos@v1
  with:
    certificate_base64: ${{ inputs.macos_certificate_base64 }}
    p12_password: ${{ inputs.macos_p12_password }}
    notarization_method: ${{ inputs.macos_notarization_method }}
    apple_id: ${{ inputs.macos_apple_id }}
    apple_password: ${{ inputs.macos_apple_password }}
    apple_team_id: ${{ inputs.macos_apple_team_id }}
    api_key_base64: ${{ inputs.macos_api_key_base64 }}
    api_key_id: ${{ inputs.macos_api_key_id }}
    api_issuer: ${{ inputs.macos_api_issuer }}
...
KEYCHAIN_PROFILE: ${{ steps.setup-certificates-macos.outputs.keychain-profile }}
```
