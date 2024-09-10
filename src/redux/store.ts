import { configureStore } from '@reduxjs/toolkit'
import appReducer from './reducers/appSlice'
import chatReducer from './reducers/chatSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,    
    chat: chatReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch