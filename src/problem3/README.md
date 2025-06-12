# 💡 Problem 3 - React Performance and Clean Code Review

## 🧩 Description

This component is a React functional component using TypeScript, React Hooks, and external hooks (`useWalletBalances`, `usePrices`). Its purpose is to display wallet balances sorted by blockchain priority.

---

## 🚫 Problems & Anti-patterns

### 1. ❌ Incorrect usage of `useMemo`
- `prices` is included in the dependency array of `useMemo`, even though it's unused.
- ➤ **Fix**: Remove `prices` from the dependency list.

---

### 2. 🐛 Undefined variable `lhsPriority`
- Used inside `filter()` but never declared.
- ➤ **Fix**: Replace with `balancePriority`.

---

### 3. 🔄 Inefficient filtering logic
- Filters items where `amount <= 0` but only if priority > -99. It seems backwards.
- ➤ **Fix**: Keep items with `amount > 0` and valid priority.

---

### 4. 🧮 Unused computed variable
- `formattedBalances` is created but never used.
- ➤ **Fix**: Use it instead of recomputing formatted strings later.

---

### 5. 📦 Incorrect type in `.map()`
- Mapping `WalletBalance[]` with type `FormattedWalletBalance`.
- ➤ **Fix**: Properly type after mapping.

---

### 6. 🔑 Using index as key in React
- Anti-pattern: leads to rendering issues.
- ➤ **Fix**: Use `balance.currency` as a unique key.

---

### 7. 🔢 Magic numbers in `getPriority`
- Priority values are hardcoded and scattered.
- ➤ **Fix**: Replace with a constant `PRIORITY_MAP`.

---

### 8. 🧠 Business logic inside component
- `getPriority()` should be outside to avoid redefining on every render.
- ➤ **Fix**: Move it out of the component.

---

### 9. ⛓️ Chaining `.filter().sort()` causes double iteration
- While not terrible, it's inefficient.
- ➤ **Fix**: Consider using `reduce` if performance is critical.

---

## ✅ Refactored Version

See [`WalletPage.after.tsx`](./WalletPage.after.tsx) for the final improved version.

---

## 🧾 Summary Table

| Issue | Type | Fix |
|-------|------|-----|
| `lhsPriority` not defined | Bug | Use `balancePriority` |
| Inefficient `filter().sort()` | Optimization | Use `reduce` or merge logic |
| Wrong key in map | Anti-pattern | Use `balance.currency` |
| Magic numbers | Maintainability | Replace with constant object |
| Unused variable | Clean Code | Remove or use correctly |
| Incorrect hook dependency | Performance | Adjust dependency list |

---

## 📂 Files

- [`WalletPage.before.tsx`](./WalletPage.before.tsx) — original code
- [`WalletPage.after.tsx`](./WalletPage.after.tsx) — cleaned and optimized version

