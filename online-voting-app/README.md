# Online Voting App

A fully static, self-contained online voting web application built with plain HTML, CSS, and ES6 JavaScript.

## Features

- Responsive modern UI with card-based layout
- Voting form with required fields
- Candidate selection from four options
- Real-time vote totals and percentage progress bars
- Expandable voter audit log
- Inline validation for form errors
- Age restriction: blocks users under 18
- Duplicate email prevention using `localStorage`
- Persistent vote storage in the browser
- No backend, database, or build tools required

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Browser `localStorage`

## Project Structure

```text
online-voting-app/
├── .gitignore
├── index.html
├── README.md
├── script.js
└── style.css
```

## Getting Started

### 1. Clone or download the repository

```bash
git clone https://github.com/your-username/online-voting-app.git
cd online-voting-app
```

### 2. Run locally

Since this is a static project, you can open `index.html` directly in your browser.

Alternatively, if you want a local development server, use one of the following:

#### Python

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

#### VS Code Live Server

Open the folder in VS Code and launch with the Live Server extension.

## Validation Rules

The app enforces the following rules:

- Full Name is required
- Age is required
- Age must be 18 or older
- Email is required
- Each email can vote only once
- Candidate selection is required

If an email already exists in `localStorage`, the app shows:

```text
This email address has already cast a vote!
```

## Data Storage

Votes are saved in browser `localStorage` under the key:

```text
onlineVotingAppVotes
```

Each stored vote record has the following structure:

```js
{
  name,
  age,
  email,
  vote,
  timestamp
}
```

## Notes

- This app is ideal for demos, prototypes, classroom exercises, and local browser-based usage.
- Because it uses only frontend storage, it is **not suitable for real-world secure elections**.
- `localStorage` is browser-specific, so votes are stored only on the current device/browser.

## Customization Ideas

You can extend this project with:

- Dark mode
- Candidate photos or cards
- Export audit log to CSV
- Clear/reset all stored votes button
- Search and filtering in the audit log
- Charts for visual analytics

## License

This project is free to use for learning and demo purposes.
