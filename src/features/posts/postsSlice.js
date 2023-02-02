import axios from 'axios';
import { sub } from 'date-fns';
import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';

const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = { posts: [], status: 'idle', error: null };

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const res = await axios.get(POST_URL);
    return res.data;
  } catch (error) {
    return error;
  }
});

export const createNewPost = createAsyncThunk(
  'posts/createNewPost',
  async initialPost => {
    try {
      const res = await axios.post(POST_URL, initialPost);
      return res.data;
    } catch (error) {
      return error;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      // Prepare callback: Used for formatting action payload received in reducer
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            createdAt: new Date().toISOString(),
            userId,
            reactions: {
              like: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
            },
          },
        };
      },
    },
    addReaction(state, action) {
      const { postId, reaction } = action.payload;
      const post = state.posts.find(({ id }) => id === postId);
      if (post) {
        post.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'successful';

        //Add date and reactions
        let minute = 1;

        const fetchedPosts = action.payload.map(post => {
          post.createdAt = sub(new Date(), { minutes: minute++ }).toISOString();
          post.reactions = {
            like: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
          };

          return post;
        });

        // Add fetched posts to the array
        state.posts = state.posts.concat(fetchedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.createdAt = new Date().toISOString();
        action.payload.reactions = {
          like: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
        };

        // Can mutate state directly because of emmer js library under the hood.
        state.posts.push(action.payload);
      });
  },
});

export const allPosts = state => state.posts.posts;
export const getPostsError = state => state.posts.error;
export const getPostsStatus = state => state.posts.status;

export const { addPost, addReaction } = postsSlice.actions;

export default postsSlice.reducer;
