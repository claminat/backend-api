# 📦 Jest Testing Setup Guide for Media Manager Tool

This document provides setup instructions, usage tips, and common issues related to using Jest for testing the Media Repository in your project.

---

## ✅ 1. Install Jest

Ensure you are in the root folder of your Node.js project and run:

```bash
npm install --save-dev jest
```

If you're using Node.js version lower than 18, you may see warnings like:

```
npm WARN EBADENGINE Unsupported engine...
```

You can ignore these warnings for now if you're not directly using the affected packages.

---

## ✅ 2. Create a Test Script

In your `package.json`, add the following under `"scripts"`:

```json
"scripts": {
  "test": "jest"
}
```

---

## 🧪 3. Run Your Test

### Option 1: Using `npx`

Run your test with:

```bash
npx jest src/modules/media/tests/media.repository.test.js
```

### Option 2: Using NPM Script

```bash
npm test
```

You can also specify the test file:

```bash
npm test -- src/modules/media/tests/media.repository.test.js
```

---

## ⚠️ 4. Common Issues & Notes

### ❌ Error: `zsh: command not found: jest`

This means `jest` is not installed globally. Use `npx jest` or `npm test` instead.

---

### ⚠️ Warning: `npm WARN EBADENGINE`

Some packages like `bcrypt` require Node.js 18+. If possible, upgrade your Node version:

```bash
nvm install 18
nvm use 18
```

Otherwise, continue using Jest normally, the test should still run.

---

## 📂 5. Project Test Structure

Your test file is located at:

```
src/modules/media/tests/media.repository.test.js
```

You can write test cases to validate importing from different adapters (`local`, `s3`, etc.).

---

## 📘 References

- [Jest Official Docs](https://jestjs.io/docs/getting-started)