# VietQR Quick Link

Quick Link is the simplest way to generate a VietQR payment QR code image — no
API key required. It returns an image (PNG/JPG) that can be embedded directly
in `<img>` tags, emails, documents, etc.

## Full Syntax

```
https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.<FORMAT>?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
```

> Use a hyphen (`-`) as the separator between parameters.

### Example

```
https://img.vietqr.io/image/vietinbank-113366668888-compact2.jpg?amount=790000&addInfo=dong%20qop%20quy%20vac%20xin&accountName=Quy%20Vac%20Xin%20Covid
```

---

## Parameter Reference

### 1. `<BANK_ID>` (required)

The bank identifier. Accepts any of the following formats:

| Format              | Example      | Description                                      |
| ------------------- | ------------ | ------------------------------------------------ |
| BIN code            | `970415`     | 6-digit bank BIN assigned by the State Bank       |
| Common short name   | `vietinbank` | Popular abbreviated name                          |
| NAPAS code          | `ICB`        | Official NAPAS-assigned abbreviation              |

> Look up BIN (`bin`), short name (`shortName`), and code (`code`) via the
> [Bank List API](bank-list-api.md).

### 2. `<ACCOUNT_NO>` (required)

The beneficiary's bank account number.

- Alphanumeric characters only (letters or digits)
- Maximum **19 characters**
- Also supports **Alias Names** and **Virtual Account Numbers**

### 3. `<TEMPLATE>` (required)

Determines the visual layout of the generated QR image.

| Template     | Size (px)   | Description                                                       |
| ------------ | ----------- | ----------------------------------------------------------------- |
| `compact2`   | 540 × 640   | QR code + logos + transfer details                                |
| `compact`    | 540 × 540   | QR code + VietQR, NAPAS, and bank logos                           |
| `qr_only`    | 480 × 480   | Plain QR code only                                                |
| `print`      | 600 × 776   | QR code + logos + full transfer details (print-friendly)          |
| `loax2`      | 583 × 3719  | QR code + logos + transfer info, for payment speaker products     |

> For production use, create a **custom template** at
> [my.vietqr.io](https://my.vietqr.io) inheriting from one of the base themes
> above, then use its template ID in the Quick Link.

### 4. `<AMOUNT>` (optional, query parameter)

The transfer amount.

- Must be a **positive integer**
- Maximum **13 digits**

### 5. `<DESCRIPTION>` (optional, query parameter `addInfo`)

The transfer description / memo.

- Maximum **50 characters**
- No special characters allowed

### 6. `<ACCOUNT_NAME>` (optional, query parameter)

The beneficiary name displayed on the QR image.

> This field is for **display purposes only** and is not part of the VietQR
> standard QR data payload.

---

## Image Format

The file extension in the URL determines the output format:

| Extension | Format |
| --------- | ------ |
| `.png`    | PNG    |
| `.jpg`    | JPEG   |

---

## Custom Templates

To use Quick Link in production projects, create your own branded template:

1. Go to [my.vietqr.io](https://my.vietqr.io) and register a new account
2. Create a new template
3. Choose a base theme, update logo, and customize colors to match your brand
4. Replace `<TEMPLATE>` in the Quick Link URL with your new template's ID
