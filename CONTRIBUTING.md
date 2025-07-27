# Contributing to Al-Awael Educational Platform

Thank you for your interest in contributing to the Al-Awael Educational Platform! This document provides guidelines for contributing to this Arabic-first educational platform for Sudanese students.

## 🌍 Project Vision

Al-Awael aims to provide a comprehensive, Arabic-first educational experience for Sudanese students with modern web technologies and culturally appropriate design.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create detailed bug reports** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots for UI issues
   - Browser/device information
   - Arabic text rendering issues (if applicable)

### Suggesting Features

1. **Open a feature request** with:
   - Clear problem description
   - Proposed solution
   - Use cases for Sudanese educational context
   - Impact on Arabic RTL interface

### Code Contributions

#### Prerequisites
- Node.js 18+
- Basic understanding of React, TypeScript, and PostgreSQL
- Familiarity with Arabic text handling and RTL layouts
- Understanding of educational platform requirements

#### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/your-username/al-awael-platform.git
cd al-awael-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up development environment**
```bash
# Copy environment template
cp .env.example .env.local

# Update with your development credentials
# DATABASE_URL, SESSION_SECRET, etc.
```

4. **Run database migrations**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

#### Coding Standards

##### TypeScript Guidelines
- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Use Zod schemas for API validation
- Prefer type safety over convenience

##### React Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Follow React Query patterns for server state
- Use shadcn/ui components consistently

##### Arabic & RTL Guidelines
- **Always test RTL layout**: Ensure all components work in right-to-left mode
- **Arabic text handling**: Use proper Arabic fonts (Cairo, Tajawal)
- **Cultural sensitivity**: Respect Sudanese educational customs
- **Accessibility**: Ensure Arabic screen reader compatibility

##### Database Guidelines
- Use Drizzle ORM for all database operations
- Write type-safe queries
- Follow established schema patterns
- Add proper indexes for performance

#### Code Style

```typescript
// ✅ Good: Proper TypeScript interfaces
interface CourseData {
  id: string;
  titleArabic: string;
  titleEnglish?: string;
  teacherId: string;
  pointsCost: number;
}

// ✅ Good: Arabic-first labeling
const buttonLabels = {
  save: "حفظ",
  cancel: "إلغاء",
  submit: "إرسال"
};

// ✅ Good: RTL-aware styling
const styles = {
  container: "flex flex-row-reverse gap-4", // RTL layout
  text: "text-right", // Arabic text alignment
};
```

#### Testing

- Write unit tests for utility functions
- Test components with Arabic content
- Verify RTL layout behavior
- Test role-based access control
- Validate Arabic form inputs

#### Pull Request Process

1. **Create feature branch**
```bash
git checkout -b feature/course-management-enhancement
```

2. **Make your changes**
   - Follow coding standards
   - Add tests for new features
   - Update documentation
   - Test Arabic text rendering

3. **Commit with clear messages**
```bash
git commit -m "feat: add course enrollment with Arabic notifications

- Implement course enrollment workflow
- Add Arabic notification messages
- Update RTL layout for enrollment cards
- Add points deduction validation"
```

4. **Push and create PR**
```bash
git push origin feature/course-management-enhancement
```

5. **PR Guidelines**
   - Clear title and description
   - Link related issues
   - Include screenshots for UI changes
   - Demonstrate Arabic text handling
   - Test instructions for reviewers

#### Review Process

- **Code Review**: Technical implementation review
- **Arabic Review**: Native Arabic speaker review for text quality
- **RTL Testing**: Right-to-left layout verification
- **Educational Context**: Relevance to Sudanese education system

### Areas Needing Contribution

#### High Priority
- **Performance Optimization**: Database query optimization
- **Mobile Responsiveness**: Touch-friendly Arabic interface
- **Accessibility**: Screen reader support for Arabic
- **Exam Security**: Anti-cheating measures

#### Medium Priority
- **Advanced Analytics**: Teacher dashboard improvements
- **Notification System**: Real-time updates
- **Content Management**: Rich text editor for Arabic
- **Payment Integration**: Sudanese payment methods

#### Documentation
- API documentation in Arabic
- User guides for teachers and students
- Administrative documentation
- Deployment guides

### Translation Guidelines

#### Arabic Text Standards
- Use formal Arabic (Modern Standard Arabic)
- Consistent terminology across platform
- Educational terms appropriate for Sudanese context
- Clear, accessible language for all education levels

#### Translation Process
1. **Source Text**: Write in English first for technical review
2. **Translation**: Professional Arabic translation
3. **Review**: Native speaker review
4. **Context Testing**: Test in actual UI context
5. **Approval**: Educational expert approval

### Cultural Considerations

#### Sudanese Educational Context
- **Curriculum Alignment**: Align with Sudanese education standards
- **Cultural Sensitivity**: Respect local customs and values
- **Regional Variations**: Consider dialect differences
- **Economic Factors**: Appropriate pricing and payment methods

#### User Experience
- **Familiar Patterns**: Use familiar Arabic UI patterns
- **Educational Metaphors**: Use local educational concepts
- **Color Psychology**: Colors appropriate for Arabic culture
- **Typography**: Readable Arabic typography choices

### Community Guidelines

#### Code of Conduct
- **Respectful Communication**: Professional, respectful interactions
- **Inclusive Environment**: Welcome contributors from all backgrounds
- **Educational Focus**: Keep discussions focused on educational goals
- **Arabic Language Support**: Help non-Arabic speakers understand context

#### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code review and discussion
- **Documentation**: Wiki updates and guides
- **Community**: Respectful, educational-focused discussions

### Getting Help

#### Resources
- **Documentation**: Check README and wiki first
- **Issues**: Search existing issues for similar problems
- **Code Examples**: Review existing implementations
- **Arabic Resources**: Arabic typography and RTL guidelines

#### Contact
- **Maintainers**: Tag maintainers in issues for complex questions
- **Community**: Ask in discussions for general help
- **Arabic Language**: Request help with Arabic text and RTL issues

## 🎯 Quality Standards

### Definition of Done
- [ ] Code follows project standards
- [ ] Arabic text properly handled
- [ ] RTL layout tested and working
- [ ] Tests pass (unit and integration)
- [ ] Documentation updated
- [ ] No accessibility regressions
- [ ] Performance impact assessed
- [ ] Security considerations addressed

### Review Checklist
- [ ] **Functionality**: Feature works as intended
- [ ] **Arabic Support**: Proper Arabic text rendering
- [ ] **RTL Layout**: Right-to-left layout correct
- [ ] **Performance**: No significant performance regression
- [ ] **Security**: No security vulnerabilities
- [ ] **Accessibility**: Screen reader compatible
- [ ] **Mobile**: Works on mobile devices
- [ ] **Testing**: Adequate test coverage

Thank you for contributing to Al-Awael Educational Platform! Together, we're building better educational experiences for Sudanese students.

---

**شكراً لمساهمتك في منصة الأوائل التعليمية! معاً نبني تجارب تعليمية أفضل للطلاب السودانيين.**