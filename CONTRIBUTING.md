# Contributing to Aura Bot

Thank you for your interest in contributing to Aura Bot! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, etc.)

### Suggesting Features

Feature requests are welcome! Please include:
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Whether you can help implement it

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the code style
   - Add tests if applicable
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

## Development Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/ElBrido/rebe.git
   cd rebe
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use enums for fixed sets of values

### Naming Conventions
- **Files**: camelCase for utilities, PascalCase for classes
- **Classes**: PascalCase (e.g., `AuraClient`)
- **Functions**: camelCase (e.g., `loadCommands`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_QUEUE_SIZE`)
- **Interfaces**: PascalCase with 'I' prefix (e.g., `IGuild`)

### Code Organization
```typescript
// 1. Imports
import { Client } from 'discord.js';
import { logger } from './utils/logger';

// 2. Interfaces/Types
interface MyInterface {
  prop: string;
}

// 3. Constants
const MAX_VALUE = 100;

// 4. Main code
export class MyClass {
  // ...
}
```

### Comments
- Use JSDoc for functions and classes
- Add inline comments for complex logic
- Keep comments up to date with code changes

```typescript
/**
 * Loads all commands from the commands directory
 * @returns Promise that resolves when loading is complete
 */
async function loadCommands(): Promise<void> {
  // Implementation
}
```

## Project Structure

```
src/
├── bot/
│   ├── client/        # Bot client initialization
│   ├── commands/      # Command files by category
│   ├── events/        # Event handlers
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
├── dashboard/
│   ├── routes/        # Express routes
│   ├── views/         # EJS templates
│   ├── public/        # Static assets
│   └── middleware/    # Express middleware
└── database/
    ├── models/        # Mongoose models
    └── migrations/    # Database migrations (future)
```

## Adding New Features

### Adding a Command

1. **Create command file** in appropriate category:
   ```typescript
   // src/bot/commands/utility/mycommand.ts
   import { SlashCommandBuilder } from 'discord.js';

   export default {
     data: new SlashCommandBuilder()
       .setName('mycommand')
       .setDescription('My command description'),
     
     async execute(interaction) {
       // Command logic
     }
   };
   ```

2. **Test locally**
3. **Update documentation**

### Adding a Dashboard Route

1. **Create route file**:
   ```typescript
   // src/dashboard/routes/myroute.ts
   import express from 'express';
   const router = express.Router();

   router.get('/myroute', (req, res) => {
     res.render('myview', { user: req.user });
   });

   export default router;
   ```

2. **Create view template**:
   ```html
   <!-- src/dashboard/views/myview.ejs -->
   <%- include('partials/header') %>
   <!-- Content -->
   <%- include('partials/footer') %>
   ```

3. **Register in dashboard index**

### Adding a Database Model

1. **Create model file**:
   ```typescript
   // src/database/models/MyModel.ts
   import mongoose, { Document, Schema } from 'mongoose';

   export interface IMyModel extends Document {
     field: string;
   }

   const MyModelSchema = new Schema({
     field: { type: String, required: true }
   }, { timestamps: true });

   export default mongoose.model<IMyModel>('MyModel', MyModelSchema);
   ```

2. **Use in commands/routes**

## Testing

Currently, the project doesn't have automated tests. Contributions to add testing are welcome!

### Manual Testing Checklist
- [ ] Command works as expected
- [ ] Error handling works
- [ ] Permissions are checked
- [ ] Database updates correctly
- [ ] Dashboard displays correctly
- [ ] No console errors

## Documentation

When adding features, update:
- `README.md` - Main documentation
- `FEATURES.md` - Feature list
- `QUICKSTART.md` - If affects setup
- Inline code comments
- Command help text

## Commit Message Guidelines

Use conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add leveling system
fix: resolve ban command permission issue
docs: update installation guide
```

## Priority Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- [ ] Music system implementation
- [ ] Giveaway system
- [ ] Advanced custom commands
- [ ] Automated testing
- [ ] More dashboard pages

### Medium Priority
- [ ] More fun commands
- [ ] Economy features
- [ ] Custom embed builder
- [ ] Backup system
- [ ] API documentation

### Nice to Have
- [ ] Multi-language support
- [ ] Slash command permissions v2
- [ ] Advanced statistics
- [ ] Custom themes for dashboard
- [ ] Mobile app

## Questions?

If you have questions:
- Open a Discussion on GitHub
- Join our support server
- Ask in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to Aura Bot! 🌟
