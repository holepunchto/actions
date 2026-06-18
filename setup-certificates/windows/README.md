# Setup certificates on Windows

GitHub Action to setup certificates on Windows.

## Inputs

### Windows

| Input             | Description                                      | Required                                   |
| ----------------- | ------------------------------------------------ | ------------------------------------------ |
| `signing_method`  | Signing method to use: `cert_sha1` or `cert_pfx` | Required                                   |
| `cert_pfx_base64` | Base64-encoded Windows cert pfx file             | Required if `signing_method` is `cert_pfx` |
| `cert_password`   | Password for the Windows certificate             | Required if `signing_method` is `cert_pfx` |

## Outputs

| Output                   | Description            |
| ------------------------ | ---------------------- |
| `certificate-thumbprint` | Certificate thumbprint |

## Usage

```yaml

...
- name: 'Setup certificates on Windows'
  id: setup-certificates-windows
  uses: holepunchto/actions/setup-certificates/windows@v1
  with:
    signing_method: ${{ inputs.windows_signing_method }}
    cert_pfx_base64: ${{ inputs.windows_cert_pfx_base64 }}
    cert_password: ${{ inputs.windows_cert_password }}
...
WINDOWS_CERT_SHA1: "${{ inputs.windows_signing_method == 'cert_pfx' && steps.setup-certificates-windows.outputs.certificate-thumbprint || inputs.windows_cert_sha1 }}"
```
