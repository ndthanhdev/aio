# VietQR Bank List API

Returns the list of banks supported by VietQR. Use this to look up bank BIN
codes, short names, and NAPAS codes needed for Quick Links.

## Endpoint

```
GET https://api.vietqr.io/v2/banks
```

> **No authentication required.**

## Response

### Success Response (HTTP 200)

```json
{
  "code": "00",
  "desc": "Get Bank list successful! Total 55 banks",
  "data": [
    {
      "id": 1,
      "name": "Ngân hàng TMCP An Bình",
      "code": "ABB",
      "bin": "970425",
      "shortName": "ABBANK",
      "logo": "https://api.vietqr.io/img/ABB.png",
      "transferSupported": 1,
      "lookupSupported": 1
    },
    {
      "id": 2,
      "name": "Ngân hàng TMCP Á Châu",
      "code": "ACB",
      "bin": "970416",
      "shortName": "ACB",
      "logo": "https://api.vietqr.io/img/ACB.png",
      "transferSupported": 1,
      "lookupSupported": 1
    }
  ]
}
```

### Response Fields

| Field                | Type    | Description                                                         |
| -------------------- | ------- | ------------------------------------------------------------------- |
| `id`                 | integer | Internal bank identifier                                            |
| `name`               | string  | Full official bank name (in Vietnamese)                             |
| `code`               | string  | NAPAS-assigned bank abbreviation (e.g., `ACB`, `ICB`, `VCB`)       |
| `bin`                | string  | 6-digit bank BIN code assigned by the State Bank of Vietnam         |
| `shortName`          | string  | Common short name / popular abbreviation                            |
| `logo`               | string  | URL to the bank's logo image                                        |
| `transferSupported`  | integer | `1` if the bank supports VietQR transfers, `0` otherwise           |
| `lookupSupported`    | integer | `1` if the bank supports account name lookup, `0` otherwise        |

## Usage in Quick Link

Any of these fields can be used as `<BANK_ID>` in a Quick Link URL:

- **`bin`** (e.g., `970415`) — the BIN code
- **`shortName`** (e.g., `Vietinbank`) — the common name
- **`code`** (e.g., `ICB`) — the NAPAS code

```
https://img.vietqr.io/image/970415-113366668888-compact.png
https://img.vietqr.io/image/vietinbank-113366668888-compact.png
https://img.vietqr.io/image/ICB-113366668888-compact.png
```

All three URLs above generate the same QR code.

## Caching Advice

The bank list may change over time (banks added, removed, or updated).
If you cache the response, **refresh it daily** to stay up to date.
