import mongoose from "mongoose"
import * as dotenv from 'dotenv'

// Configure dotenv
dotenv.config()

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI

// Define the cached mongoose connection type
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Declare the global type
declare global {
  var mongoose: MongooseCache | undefined
}

// Use the cached connection or initialize it
let cached = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

async function testConnection() {
  try {
    await dbConnect()
    console.log('✅ MongoDB connection successful')
    
    // Test the connection state
    const state = mongoose.connection.readyState
    console.log('Connection state:', getConnectionState(state))
    
    return true
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    return false
  }
}

// Helper function to get readable connection state
function getConnectionState(state: number): string {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }
  return states[state as keyof typeof states] || 'unknown'
}

export default dbConnect
export { testConnection }
