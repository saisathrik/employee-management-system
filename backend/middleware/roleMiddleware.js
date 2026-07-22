// Generic role-based authorization.
// Usage: router.get('/', protect, authorize('admin'), handler)
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' })
    }
    next()
  }

// Convenience shortcut for the most common case in this app.
export const adminOnly = authorize('admin')
