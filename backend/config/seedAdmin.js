import Employee from '../models/Employee.js'

// Ensures exactly one admin account exists so the app is usable on first run.
// Credentials come from environment variables — nothing is hardcoded here.
// Everything else (employees, tasks) is created dynamically at runtime through
// the real API (/api/employees, /api/tasks) once an admin can log in.
const seedAdmin = async () => {
  const alreadyHasAdmin = await Employee.exists({ role: 'admin' })
  if (alreadyHasAdmin) return

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn(
      'No admin account exists yet and ADMIN_EMAIL / ADMIN_PASSWORD are not set in .env.\n' +
        '  Set them and restart the server to auto-create the first admin,\n' +
        '  or POST to /api/auth/register with "role": "admin" to create one manually.'
    )
    return
  }

  await Employee.create({
    name: ADMIN_NAME || 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  })

  console.log(`Admin account ready: ${ADMIN_EMAIL}`)
}

export default seedAdmin
