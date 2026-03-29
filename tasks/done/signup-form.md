# Signup Form Component

**Agent**: ui
**Priority**: high
**Output**: client/src/components/SignupForm.jsx

## Objective
Build a production-ready React SignupForm component using Tailwind CSS that handles user registration with proper validation, error handling, and loading states.

## Requirements
- Name, email, password, confirm password fields
- Client-side validation before submission
- Name: required, min 2 characters
- Email: required, valid format
- Password: required, min 8 characters
- Confirm Password: must match password
- Show validation errors inline below each field
- Loading state on submit button
- Disable form during submission
- Password visibility toggle on both password fields
- Call POST https://donut-wd2v.onrender.com/api/auth/register with name, email, password
- On success store token and user in localStorage
- On success redirect to /dashboard
- On error show error message above form
- Link to login page at bottom
- Use Tailwind CSS only, no inline styles
- Use react-router-dom useNavigate for redirect
- Default export
- Functional component with hooks only
