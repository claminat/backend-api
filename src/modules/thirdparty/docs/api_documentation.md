# File Sharing API

## POST /api/file/upload

### Request
- Content-Type: multipart/form-data
- Fields:
  - `file`: file upload
  - `service`: one of ['imgbb', 'transfer.sh']

### Response
```json
{
  "success": true,
  "data": {
    "url": "https://..."
  }
}
```
