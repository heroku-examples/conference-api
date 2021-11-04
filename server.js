// Load .env config files if present
require('dotenv').config()

// Require `core` modules and assign them to constants
// Require the `fs/promises` module, all the methods will return Promises.
const fs = require('fs/promises')
const path = require('path')

// Require the fastify framework and instantiate it
const fastify = require('fastify')({ logger: true })
// Define the HTTP Port
const PORT = process.env.PORT || 3000

// Define the filename by joining the current directory and data/sessions.json
const sessionsFilename = path.join(__dirname, 'data', 'sessions.json')

// Register CORS Plugin
fastify.register(require('fastify-cors'))

// Declare the /api/sessions route
fastify.get('/api/sessions', async (request, reply) => {
  // Read the file using async/await as an `utf8` string
  const sessionsFile = await fs.readFile(sessionsFilename, 'utf8')
  // Parse the `utf8` string as a JSON object
  const sessions = JSON.parse(sessionsFile)
  return sessions
})

// Run the server!
async function start () {
  try {
    await fastify.listen(PORT, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
