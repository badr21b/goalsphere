import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FootballNews } from '@/lib/types'

interface BestNewsState {
  bestNewsByCategory: Record<string, FootballNews | null>
  loading: boolean
  error: string | null
  lastFetched: Record<string, number>
}

const initialState: BestNewsState = {
  bestNewsByCategory: {},
  loading: false,
  error: null,
  lastFetched: {}
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const bestNewsSlice = createSlice({
  name: 'bestNews',
  initialState,
  reducers: {
    setBestNews: (state, action: PayloadAction<{ category: string; news: FootballNews | null }>) => {
      const { category, news } = action.payload
      state.bestNewsByCategory[category] = news
      state.lastFetched[category] = Date.now()
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
    clearCache: (state) => {
      state.bestNewsByCategory = {}
      state.lastFetched = {}
    }
  }
})

export const { setBestNews, setLoading, setError, clearCache } = bestNewsSlice.actions

// Selectors
export const selectBestNews = (state: { bestNews: BestNewsState }, category: string) => 
  state.bestNews.bestNewsByCategory[category]

export const selectIsLoading = (state: { bestNews: BestNewsState }) => 
  state.bestNews.loading

export const selectError = (state: { bestNews: BestNewsState }) => 
  state.bestNews.error

export const selectIsCacheValid = (state: { bestNews: BestNewsState }, category: string) => {
  const lastFetched = state.bestNews.lastFetched[category]
  if (!lastFetched) return false
  return Date.now() - lastFetched < CACHE_DURATION
}

export default bestNewsSlice.reducer
