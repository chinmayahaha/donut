# Authentication API Routes

**Agent**: backend
**Priority**: high
**Output**: server/routes/auth.routes.js

---

## Objective
Implement Express.js authentication routes for user registration, login, and token verification with MongoDB integration.

## Required Routes

### 1. POST /api/auth/register
**Purpose**: Register new user account

**Request Body**:
```javascript
{
  name: string,      // Min 2 chars, required
  email: string,     // Valid email, unique, required
  password: string   // Min 6 chars, required
}
```

**Validation Rules**:
- Email must be unique (check MongoDB before insertion)
- Password must be hashed using bcrypt (salt rounds: 10)
- All fields required and validated

**Success Response** (201):
```javascript
{
  success: true,
  message: "User registered successfully",
  user: {
    id: string,
    name: string,
    email: string
  },
  token: string  // JWT token valid for 24h
}
```

**Error Responses**:
- 400: Validation errors or email already exists
- 500: Server error

### 2. POST /api/auth/login
**Purpose**: Authenticate user and return JWT token

**Request Body**:
```javascript
{
  email: string,
  password: string
}
```

**Authentication Flow**:
1. Find user by email in MongoDB
2. Compare password with bcrypt
3. Generate JWT token if valid
4. Return user data + token

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
- 400: Missing email or password
- 401: Invalid credentials
- 500: Server error

### 3. GET /api/auth/verify
**Purpose**: Verify JWT token validity

**Headers Required**:
```javascript
{
  'Authorization': 'Bearer <token>'
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
  }
}
```

**Error Responses**:
- 401: Invalid or expired token
- 403: No token provided

## Dependencies

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
```

## Environment Variables Required

```bash
JWT_SECRET=your-secret-key-here  # Used for token signing
JWT_EXPIRE=24h                   # Token expiration time
```

## MongoDB User Model Schema

```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Hashed
  createdAt: { type: Date, default: Date.now }
}
```

## Error Handling Requirements

- Use try-catch blocks for all async operations
- Return consistent error format:
```javascript
{
  success: false,
  message: "Error description",
  error: "Detailed error (only in development)"
}
```

- Log errors to console with stack trace
- Never expose sensitive information in error messages

## JWT Token Structure

```javascript
const payload = {
  user: {
    id: user._id,
    email: user.email
  }
};

const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE || '24h'
});
```

## Security Considerations

1. **Password Hashing**: Always use bcrypt with salt rounds >= 10
2. **JWT Secret**: Use strong, random secret from environment variables
3. **Input Sanitization**: Validate and sanitize all inputs
4. **Rate Limiting**: Consider adding rate limiting middleware (not implemented in this task)
5. **CORS**: Ensure proper CORS configuration for frontend access

## Expected Code Structure

```javascript
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // Validation
    // Check if user exists
    // Hash password
    // Create user
    // Generate token
    // Return response
  } catch (error) {
    // Error handling
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  // Implementation
});

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private (requires auth middleware)
router.get('/verify', authMiddleware, async (req, res) => {
  // Implementation
});

module.exports = router;
```

## Testing Checklist

- [ ] Register with valid data succeeds
- [ ] Register with duplicate email fails
- [ ] Register with invalid email fails
- [ ] Register with short password fails
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong password fails
- [ ] Login with non-existent email fails
- [ ] Verify with valid token succeeds
- [ ] Verify with invalid token fails
- [ ] Verify without token fails

## Integration Points

- **Frontend**: LoginForm component will call POST /api/auth/login
- **Database**: Requires User model at `server/models/User.model.js`
- **Middleware**: Requires auth middleware at `server/middleware/auth.middleware.js`

## Output File Location
`server/routes/auth.routes.js`

## Additional Notes

- Use async/await syntax (no callbacks)
- Follow RESTful conventions
- Include JSDoc comments for each route
- Ensure CORS is configured to accept requests from http://localhost:3000 (frontend)
- Add input validation using express-validator if available
- Return consistent response structure across all routes

---

**Success Criteria**: Routes should be production-ready, secure, and fully functional with proper error handling and validation.
