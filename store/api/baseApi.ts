import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createClient } from '@supabase/supabase-js'
import type { RootState } from '../index'

// Supabase configuration (with fallbacks for UI development)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Only create Supabase client if we're in the browser or have valid config
export const supabase = typeof window !== 'undefined' || supabaseUrl !== 'https://placeholder.supabase.co' 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Base query with Supabase integration
export const baseQuery = fetchBaseQuery({
  baseUrl: supabaseUrl !== 'https://placeholder.supabase.co' ? `${supabaseUrl}/rest/v1/` : '/api/',
  prepareHeaders: (headers, { getState }) => {
    // Add Supabase headers only if we have valid config
    if (supabaseUrl !== 'https://placeholder.supabase.co') {
      headers.set('apikey', supabaseAnonKey)
      headers.set('Authorization', `Bearer ${supabaseAnonKey}`)
      headers.set('Content-Type', 'application/json')
      headers.set('Prefer', 'return=representation')
    }
    
    return headers
  },
  // Handle placeholder URLs gracefully
  fetchFn: async (...args) => {
    try {
      return await fetch(...args)
    } catch (error) {
      // If it's a network error with placeholder URL, return empty response
      if (error instanceof TypeError && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        return {
          data: [],
          meta: { request: args[0], response: { status: 200 } }
        }
      }
      throw error
    }
  }
})

// Base API slice
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: ['Article', 'Team', 'LiveScore', 'AdUnit', 'ContentIngestion'],
  endpoints: () => ({}),
})
