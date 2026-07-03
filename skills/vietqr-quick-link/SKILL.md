---
name: vietqr-quick-link
description: >
  VietQR payment QR code integration. Use this skill when working with VietQR
  Quick Links, QR code image generation, or any VietQR-related payment feature
  in Vietnam.
---

# VietQR Integration Guide

VietQR is the national QR payment standard in Vietnam, established by **NAPAS**
(National Payment Corporation of Vietnam) on June 15, 2021. **VietQR.io** (by
Casso Company) provides a developer-friendly Payment Kit to implement VietQR
via Quick Links.

Over **40+ banking apps** in Vietnam support scanning VietQR codes.

## Reference Documentation

| Reference                                                 | Contents                                                       |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| [quick-link.md](references/quick-link.md)                 | Quick Link syntax, parameters, templates, and image generation |
| [bank-list-api.md](references/bank-list-api.md)           | Public API to look up bank BIN codes, short names, NAPAS codes |
| [tax-code-api.md](references/tax-code-api.md)             | Public API to look up business info by tax code                |

## Quick Start

Generate a VietQR image via URL — **no API key needed**:

```
https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
```

Example:

```
https://img.vietqr.io/image/vietinbank-113366668888-compact2.jpg?amount=790000&addInfo=dong%20qop%20quy%20vac%20xin&accountName=Quy%20Vac%20Xin%20Covid
```

See [references/quick-link.md](references/quick-link.md) for full parameter details.
