
# ✨ Highlight Text Extension

Bring your browsing to life by **highlighting important text** anywhere on the web — just like you would with a real highlighter!

**Highlight Text Extension** is a lightweight and intuitive Chrome extension that allows you to easily select and mark text across any website. Whether you're researching, studying, or just organizing your reading, keep track of what's important without ever leaving the page.

## 🚀 Features

- 🖍️ **Highlight Text Anywhere** — Select and instantly highlight text on any webpage.
- 🎨 **Customizable Colors** — Choose your favorite highlighter colors (coming soon!).
- 📚 **Persistent Highlights** — Your highlights stay even after you refresh (future feature in progress).
- ⚡ **Minimal & Fast** — No bloated permissions, just a simple tool that does its job.

## 🛠️ Installation

1. Clone or download this repository:
    ```bash
    git clone https://github.com/devdeadviz/highlight-text-extension.git
    ```
2. Open **Chrome** and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle at top-right).
4. Click **Load unpacked** and select the `highlight-text-extension` directory.
5. You're ready to highlight!

## 🧩 How to Use

1. Install and enable the extension.
2. Highlight any text on a webpage.
3. Right-click and select **"Highlight Text"** from the context menu.
4. Voilà! Your text is now highlighted.

*(Tip: Future versions will allow double-click highlights and keyboard shortcuts!)*

## 📂 Project Structure

```
highlight-text-extension/
├── manifest.json        # Extension configuration
├── background.js        # Background script
├── content.js           # Handles highlighting logic
├── popup.html           # (Optional) Extension popup
├── icons/               # Extension icons
└── styles/              # Highlighting styles
```

## 📈 Roadmap

- [ ] Persistent Highlights with LocalStorage
- [ ] Highlight color picker
- [ ] Manage highlights (view/delete)
- [ ] Cross-device sync (using Chrome Sync API)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check [issues](https://github.com/devdeadviz/highlight-text-extension/issues) and submit a PR.

If you have suggestions for improvements, open an issue or fork the repo and create a pull request.

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

> Made with 💛 by [@devdeadviz](https://github.com/devdeadviz)
