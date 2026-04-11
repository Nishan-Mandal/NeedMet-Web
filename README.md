# 🚀 NeedMet Git Collaboration Guide





\

---

## 👋 Welcome

Welcome to the **NeedMet project**!
This guide explains how to **clone, work, commit, push, and manage code safely** using Git & GitHub.

---

# 📥 1. Clone the Repository

```bash
git clone https://github.com/your-username/NeedMet.git
cd NeedMet
```

---

# 🌿 2. Branch Overview

| Branch      | Purpose                        |
| ----------- | ------------------------------ |
| `main`      | Production (live code)         |
| `develop`   | Latest stable development code |
| `feature/*` | New features                   |
| `bugfix/*`  | Bug fixes                      |
| `hotfix/*`  | Urgent production fixes        |

---

# 🔄 3. Daily Workflow

## ✅ Step 1: Pull Latest Code

```bash
git checkout develop
git pull origin develop
```

---

## ✅ Step 2: Create a New Branch

```bash
git checkout -b feature/<feature-name>
```

**Example:**

```bash
git checkout -b feature/login-api
```

---

## ✅ Step 3: Make Changes & Commit

```bash
git add .
git commit -m "feat: add login API"
```

---

## ✅ Step 4: Push Your Branch

```bash
git push origin feature/<feature-name>
```

---

# 🔁 4. Keep Your Branch Updated

Before pushing new changes:

```bash
git checkout develop
git pull origin develop
git checkout feature/<your-branch>
git rebase develop
```

Then push safely:

```bash
git push --force-with-lease
```

---

# 🔍 5. Create Pull Request (PR)

* Go to GitHub
* Create PR:

  ```
  feature/... → develop
  ```
* Add reviewer(s)
* Resolve comments

---

# ✅ 6. Merge Strategy

### Feature Completion:

```
feature → develop
```

### Release:

```
develop → main
```

🚫 **Never push directly to ****`main`**

---

# 🚑 7. Hotfix Workflow

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<issue-name>
```

Push fix:

```bash
git push origin hotfix/<issue-name>
```

Then:

* Create PR → `main`
* Merge same fix → `develop`

---

# ⚠️ 8. Force Push Rules

✅ Allowed:

* Only on your own branch

```bash
git push --force-with-lease
```

❌ Not allowed:

* `main`
* `develop`

---

# 🧹 9. Commit Message Guidelines

| Type     | Example                           |
| -------- | --------------------------------- |
| feat     | feat: add search feature          |
| fix      | fix: resolve login crash          |
| refactor | refactor: improve API performance |
| docs     | docs: update README               |

---

# 🔐 10. Important Rules

* ❌ Do NOT push directly to `main`
* ❌ Do NOT commit secrets (API keys, tokens)
* ✅ Always create Pull Requests
* ✅ Always pull latest code before working
* ✅ Keep PRs small and meaningful

---

# 🧠 11. Quick Workflow Summary

```bash
clone → develop → feature → commit → push → PR → develop → main
```

---

# 🎯 12. Best Practices

* Pull code daily
* Communicate with your team
* Test before raising PR
* Use clear branch names
* Avoid long-running branches

---

# 📌 13. Contribution Checklist

Before creating a PR:

* [ ] Code compiles successfully
* [ ] Tested locally
* [ ] No secrets committed
* [ ] Branch is up to date
* [ ] Proper commit messages used

---

# ❤️ Happy Coding!

Let’s build **NeedMet** together 🚀
