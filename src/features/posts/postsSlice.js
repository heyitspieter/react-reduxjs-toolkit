import axios from 'axios';
import { sub } from 'date-fns';
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'; // Using normalized state

const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

// const initialState = { posts: [], status: 'idle', error: null };

const initialState = postAdapter.getInitialState({
  // returns normalized object with ids & entities fields
  status: 'idle',
  error: null,
});

/** Aysnc Thunks */
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

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async initialPost => {
    try {
    } catch (error) {
      return error;
    }
  }
);
/** Aysnc Thunks */

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
    },
    addReaction(state, action) {
      const { postId, reaction } = action.payload;
      const post = state.entities[postId];
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
        // state.posts = state.posts.concat(fetchedPosts);
        postAdapter.upsertMany(state, fetchedPosts);
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
        // state.posts.push(action.payload);
        postAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload.id) {
          return null;
        }

        // const { id } = action.payload;
        action.payload.createdAt = new Date().toISOString();
        // const posts = state.posts.filter(post => post.id !== id)
        // state.post = [...posts, action.payload]
        postAdapter.upsertOne(state, action.payload);
      });
  },
});

// getSelector creates these selectors by default and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // pass in a selector that returns posts slice of state
} = postAdapter.getSelectors(state => state.posts);

export const getPostsError = state => state.posts.error;
export const getPostsStatus = state => state.posts.status;

export const { addPost, addReaction } = postsSlice.actions;

export default postsSlice.reducer;
