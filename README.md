# 🌸 Kawaiify 🌸

A delightful CLI tool to help you generate concise and descriptive commit messages using OpenAI! ✨ Automate your commit message crafting and make your Git logs super kawaii~ 💖

---

## 🐾 Features

- **Cute and Concise Commit Messages:** Get OpenAI-suggested commit messages based on your git diffs.
- **Configurable:** Easily customize the AI prompt and settings.
- **Interactive:** Review and confirm commit messages before committing.
- **Handy Options:** Initialize configuration and display help right from the CLI.

---

## 🍙 Installation

You can run Kawaiify without installing by using:

```bash
npx kawaiify
```

Or you can install it globally:

```bash
npm install -g kawaiify
```

---

## 🧸 Usage

```bash
npx kawaiify [options] [additional context]
```

### Options:
- `-i` : Initialize a default configuration file (`.kawaiify.json`).
- `-h` : Display this help message.

### Additional Context:
Provide extra context to improve your commit message suggestions by adding a single string at the end.

Example:

```bash
npx kawaiify "Fixing the login flow issues"
```

---

## 🎀 Getting Started

### 1. Initialize Configuration
Create the `.kawaiify.json` configuration file:

```bash
npx kawaiify -i
```

Edit the file to add your OpenAI API key:

```json
{
  "apiKey": "your-openai-api-key",
  "model": "gpt-4",
  "prompt": [
    {
      "role": "system",
      "content": "You are an assistant that suggests concise and descriptive commit messages for git diffs."
    }
  ]
}
```

### 2. Generate Commit Messages
Fetch uncommitted git diffs and request a commit message suggestion:

```bash
npx kawaiify
```

Optionally, add extra context:

```bash
npx kawaiify "Refactoring authentication flow"
```

### 3. Confirm and Commit
The suggested commit message will be displayed, and you'll be prompted to confirm it before committing.

---

## 🍡 Example Output

```bash
Fetching uncommitted diffs from git...
Requesting commit message suggestion from OpenAI...
Suggested commit message:

Fix login flow by updating validation logic and error handling

Do you want to commit with this message? (y/n):
```

---

## 🌷 Contributing

We welcome contributions to make Kawaiify even cuter and more useful! Feel free to:

- Report bugs 🐛
- Suggest new features 🌟
- Submit pull requests 🤗

---

## 🍥 License

Kawaiify is open-source and licensed under the MIT License. 🧸

---

## 🌸 Stay Cute, Stay Productive!

Happy coding with Kawaiify! 💕
