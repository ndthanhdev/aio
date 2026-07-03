# VietQR Tax Code Lookup API

Look up business information by Vietnamese tax code (Mã số thuế). Useful for
retrieving invoice details when a customer makes a payment.

## Endpoint

```
GET https://api.vietqr.io/v2/business/{taxCode}
```

> **No authentication required.**

### Path Parameters

| Parameter  | Required | Type   | Description                |
| ---------- | -------- | ------ | -------------------------- |
| `taxCode`  | Yes      | string | Business tax code          |

## Response

### Success Response (HTTP 200)

```json
{
  "code": "00",
  "desc": "Success",
  "data": {
    "id": "0316794479",
    "name": "CÔNG TY TNHH CASSO",
    "internationalName": "CASSO COMPANY LIMITED",
    "shortName": "CASSO",
    "address": "I.102D, Nhà A, Khu Công Nghệ Phần Mềm, ..."
  }
}
```

### Response Fields

| Field               | Type   | Description                                      |
| ------------------- | ------ | ------------------------------------------------ |
| `code`              | string | Response code. `"00"` = success                  |
| `desc`              | string | Human-readable result description                |
| `data.id`           | string | Tax code                                         |
| `data.name`         | string | Official business name (Vietnamese)              |
| `data.internationalName` | string | International / English business name       |
| `data.shortName`    | string | Abbreviated business name                        |
| `data.address`      | string | Registered business address                      |
