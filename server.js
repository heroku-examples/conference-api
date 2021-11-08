// Load .env config files if present
require('dotenv').config()

const { Pool } = require('pg')
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Require the fastify framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Define the HTTP Port
const PORT = process.env.PORT || 3000

// Register CORS Plugin
fastify.register(require('fastify-cors'))

// Declare the /api/sessions route
fastify.get('/api/sessions', async (request, reply) => {
  const { rows } = await client.query(`
    SELECT json_build_object(
      'id', t.id,
      'name', t.name,
      'description', t.description,
      'room', t.room,
      'dateTime', t.datetime,
      'speakers', json_agg(json_build_object(
        'id', s.id,
        'name', s.name,
        'bio', s.bio,
        'pictureUrl', s.picture_url
        ))
      ) as session
    FROM sessions t
    INNER JOIN sessions_speakers ts ON ts.session_id = t.id
    INNER JOIN speakers s ON ts.speaker_id = s.id
    GROUP BY t.id
    ORDER BY t.id
  `)
  return rows
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
