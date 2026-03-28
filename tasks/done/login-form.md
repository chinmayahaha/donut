# Login Form Component Task

**Agent**: ui
**Priority**: high
**Output**: client/src/components/LoginForm.jsx

---

## Objective
Build a production-ready, accessible React LoginForm component using Tailwind CSS that handles user authentication with proper validation, error handling, and loading states.

## Component Requirements

### Core Functionality
- Email/password login form
- Client-side validation before submission
- Real-time validation feedback
- Loading state during API calls
- Error message display
- Success handling with redirect capability
- Accessibility compliance (ARIA labels, keyboard navigation)

### Props Interface
```javascript
interface LoginFormProps {
  onSuccess?: (user: object) => void;  // Callback after successful login
  redirectPath?: string;                // Optional redirect path (default: '/dashboard')
  showSignupLink?: boolean;             // Show link to signup page (default: true)
}
```

### State Management
The component should manage the following local state:
- `email` (string) - user's email input
- `password` (string) - user's password input
- `isLoading` (boolean) - API call in progress
- `error` (string | null) - error message to display
- `validationErrors` (object) - field-level validation errors

### Form Validation Rules
- **Email**: 
  - Required field
  - Valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
  - Error: "Please enter a valid email address"
  
- **Password**: 
  - Required field
  - Minimum 6 characters
  - Error: "Password must be at least 6 characters"

### API Integration

**Endpoint**: `POST http://localhost:5000/api/auth/login`

**Request Headers**:
```javascript
{
  'Content-Type': 'application/json'
}
```

**Request Body**:
```javascript
{
  email: string,
  password: string
}
```

**Success Response** (200):
```javascript
{
  success: true,
  user: {
    id: string,
    email: string,
    name: string
  },
  token: string
}
```

**Error Responses**:
- 400: Invalid credentials
- 401: User not found
- 500: Server error

### Error Handling Strategy
1. **Network Errors**: Display "Unable to connect. Please check your connection."
2. **401/400 Errors**: Display "Invalid email or password"
3. **500 Errors**: Display "Server error. Please try again later."
4. **Validation Errors**: Display inline below each field
5. Clear errors when user starts typing in a field

### Loading State Behavior
- Disable form inputs during submission
- Disable submit button with loading text
- Show loading spinner on submit button
- Prevent form re-submission while loading

### UI/UX Requirements

**Design Specifications**:
- Clean, modern design using Tailwind CSS
- Responsive (mobile-first approach)
- Centered card layout with shadow
- Smooth transitions for error messages
- Focus states for accessibility
- Password visibility toggle (eye icon)

**Color Scheme**:
- Primary button: `bg-blue-600 hover:bg-blue-700`
- Error messages: `text-red-600`
- Input borders: `border-gray-300 focus:border-blue-500`
- Background: `bg-gray-50`

**Typography**:
- Form title: `text-2xl font-bold`
- Labels: `text-sm font-medium text-gray-700`
- Inputs: `text-base`
- Error text: `text-xs`

### Expected Component Structure
```jsx
import React, { useState } from 'react';

const LoginForm = ({ onSuccess, redirectPath = '/dashboard', showSignupLink = true }) => {
  // State declarations
  // Validation functions
  // Form submit handler
  // Error handling
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {/* Form title */}
        {/* Error message display */}
        {/* Email input with validation */}
        {/* Password input with validation and toggle */}
        {/* Submit button with loading state */}
        {/* Optional signup link */}
      </div>
    </div>
  );
};

export default LoginForm;
```

### Token Storage
On successful login:
1. Store JWT token in localStorage: `localStorage.setItem('token', response.token)`
2. Store user data in localStorage: `localStorage.setItem('user', JSON.stringify(response.user))`
3. Call `onSuccess` callback if provided
4. Redirect to `redirectPath` using React Router's `useNavigate`

### Dependencies Required
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x"
}
```

### Accessibility Checklist
- [ ] All inputs have associated labels
- [ ] Form has proper `aria-label` or `aria-labelledby`
- [ ] Error messages have `role="alert"`
- [ ] Submit button shows loading state to screen readers
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Focus visible on all interactive elements

### Testing Considerations
- Test with valid credentials
- Test with invalid email format
- Test with empty fields
- Test with network failure
- Test with 401/500 server responses
- Test password visibility toggle
- Test keyboard navigation

### Output File Location
`client/src/components/LoginForm.jsx`

### Additional Notes
- Use functional components with hooks (no class components)
- Follow React best practices (avoid inline functions in JSX where possible)
- Use meaningful variable names
- Add JSDoc comments for the component and complex functions
- Ensure the component is a default export
- Do not include any backend code or API implementation
- Component should be framework-agnostic (can work with any routing solution)

---

**Success Criteria**: The component should be production-ready, fully functional, accessible, and require no modifications before deployment.
