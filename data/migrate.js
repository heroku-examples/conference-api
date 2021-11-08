require('dotenv').config()

// Require PostgreSQL client
const { Client } = require('pg')

// Load sessions from JSON file
const path = require('path')
const sessions = require(path.join(__dirname, './sessions.json'))

// Create a database client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

async function migrate () {
  try {
    // Connect to the database
    await client.connect()

    // Loop through each session
    for (const session of sessions.data) {
      // Insert session into database
      const { id: sessionId, name: sessionName, description, room, dateTime } = session

      console.log(`Creating session: ${sessionName}`)
      await client.query(`
        INSERT INTO sessions (id, name, description, room, datetime)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [sessionId, sessionName, description, room, dateTime]
      ).catch(err => console.error(err))

      // Check if session has speakers
      if (Array.isArray(session.speakers)) {
        // Loop through each speaker
        for (const speaker of session.speakers) {
          // Insert speaker into database
          const { id: speakerId, name: speakerName, bio, email, pictureUrl } = speaker

          console.log(`  Adding speaker: ${speakerName}`)
          await client.query(`
            INSERT INTO speakers (id, name, bio, email, picture_url)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING
          `, [speakerId, speakerName, bio, email, pictureUrl]
          )

          // Add relationship between session and speaker
          await client.query(`
            INSERT INTO sessions_speakers (session_id, speaker_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [sessionId, speakerId]
          )
        }
      }
    }
    console.log('Data migrated successfully')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

// Run the migration
migrate()
