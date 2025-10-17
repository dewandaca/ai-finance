# Contributing to Finance with AI

Thank you for considering contributing to Finance with AI! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and beginners
- Accept constructive criticism gracefully
- Focus on what's best for the community

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment** (OS, browser, Node version)

Example:

```markdown
**Bug**: Transaction not saving on mobile

**Steps to reproduce**:

1. Open app on mobile browser
2. Click "Add Manually"
3. Fill form
4. Click save

**Expected**: Transaction saved
**Actual**: Nothing happens

**Environment**: iOS 16, Safari
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear title and description**
- **Motivation**: Why this would be useful
- **Examples**: How it would work
- **Alternatives**: Other ways to achieve this

### Your First Code Contribution

Unsure where to start? Look for issues labeled:

- `good first issue` - Small, beginner-friendly changes
- `help wanted` - Issues needing assistance

## 🛠 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account
- Gemini API key

### Setup Steps

1. **Fork the repository**

   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-finansial.git
   cd ai-finansial
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ai-finansial.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Setup environment**

   ```bash
   cp .env.local.example .env.local
   # Fill in your credentials
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

### Development Workflow

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**

   - Write code
   - Test thoroughly
   - Add/update tests if needed

3. **Test your changes**

   ```bash
   npm run build  # Ensure build passes
   npm run lint   # Fix any linting issues
   ```

4. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Build passes without errors
- [ ] All tests pass
- [ ] Comments added for complex logic
- [ ] Documentation updated if needed
- [ ] No console.logs or debugging code

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How to test the changes

## Screenshots (if applicable)

Add screenshots

## Checklist

- [ ] Code builds without errors
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainer will review within 1-2 weeks
2. Address any requested changes
3. Once approved, it will be merged

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
}

// ❌ Bad
interface Transaction {
  id: any;
  amount: any;
  type: string;
}
```

### React Components

```typescript
// ✅ Good - Functional component with proper types
interface Props {
  onClose: () => void;
  title: string;
}

export default function Modal({ onClose, title }: Props) {
  return <div>{title}</div>;
}

// ❌ Bad - No types
export default function Modal({ onClose, title }) {
  return <div>{title}</div>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `TransactionModal.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatCurrency.ts`)
- Types: `PascalCase.ts` (e.g., `Transaction.ts`)

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **semicolons**
- Use **arrow functions** for callbacks
- Keep functions **small and focused**
- Use **meaningful variable names**

### Imports Order

```typescript
// 1. External imports
import { useState } from "react";
import { motion } from "framer-motion";

// 2. Internal imports
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/constants";

// 3. Component imports
import Modal from "@/components/Modal";

// 4. Types
import type { Transaction } from "@/types";
```

## 💬 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
feat(chat): add voice input support

# Bug fix
fix(auth): resolve login redirect issue

# Documentation
docs(readme): update setup instructions

# Style
style(dashboard): format code with prettier

# Refactor
refactor(api): simplify transaction parsing logic
```

## 🧪 Testing

### Manual Testing

Before submitting PR, test:

- [ ] Registration flow
- [ ] Login/logout
- [ ] Add transaction (manual)
- [ ] Add transaction (AI chat)
- [ ] View dashboard
- [ ] Charts display correctly
- [ ] Mobile responsiveness
- [ ] Dark mode

### Writing Tests (Future)

When test suite is added, ensure:

- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical flows

## 📚 Documentation

### Code Comments

```typescript
// ✅ Good - Explains WHY
// Calculate balance by summing income minus expenses
// This needs to be done client-side for real-time updates
const balance = transactions.reduce(...);

// ❌ Bad - Explains WHAT (obvious from code)
// Loop through transactions
transactions.forEach(...);
```

### Component Documentation

```typescript
/**
 * Modal for adding transactions via chat interface
 *
 * @param onClose - Callback when modal is closed
 * @param onSave - Callback when transaction is saved
 *
 * @example
 * <ChatModal
 *   onClose={() => setShow(false)}
 *   onSave={handleSave}
 * />
 */
export default function ChatModal({ onClose, onSave }: Props) {
  // ...
}
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Mobile-first**: Design for mobile, enhance for desktop
- **Accessibility**: Use semantic HTML, ARIA labels
- **Performance**: Lazy load heavy components
- **Consistency**: Follow existing design patterns

### Color Palette

```css
/* Use existing Tailwind colors */
--income: #10b981 (green-500)
--expense: #ef4444 (red-500)
--primary: #3b82f6 (blue-600)
--background: #f8fafc (slate-50)
```

## 🐛 Debugging Tips

### Common Issues

**Build fails**

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Types errors**

```bash
# Regenerate types
npm run build
```

**Supabase connection**

```bash
# Verify env variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

## 🆘 Getting Help

Stuck? Here's how to get help:

1. **Check documentation**: README, SETUP.md
2. **Search issues**: Might be already answered
3. **Ask in discussions**: GitHub Discussions
4. **Create issue**: If it's a bug or feature request

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution helps make this project better. Thank you for your time and effort!

---

**Happy Coding!** 🚀
