import { sub } from 'date-fns';
import { apiSlice } from '../api/apiSlice';
import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';

const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: responseData => {
        let minute = 1;

        const fetchedPosts = responseData.map(data => {
          if (!data?.createdAt) {
            data.createdAt = sub(new Date(), {
              minutes: minute++,
            }).toISOString();
          }

          if (!data?.reactions) {
            data.reactions = {
              like: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
            };
          }

          return data;
        });

        return postAdapter.setAll(initialState, fetchedPosts);
      },
      providesTags: (result, err, args) => [
        { type: 'Post', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'Post', id })),
      ],
    }),
    getPostsByUserId: builder.query({
      query: userId => `/posts?user=${userId}`,
      transformResponse: responseData => {
        let minute = 1;

        const fetchedPosts = responseData.map(data => {
          if (!data?.createdAt) {
            data.createdAt = sub(new Date(), {
              minutes: minute++,
            }).toISOString();
          }

          if (!data?.reactions) {
            data.reactions = {
              like: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
            };
          }

          return data;
        });

        return postAdapter.setAll(initialState, fetchedPosts);
      },
      providesTags: (result, err, args) => {
        return [...result.ids.map(id => ({ type: 'Post', id }))];
      },
    }),
    createNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          createdAt: new Date().toISOString(),
          reactions: {
            like: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
          },
        },
      }),
      invalidateTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: ({ postId, ...initialPost }) => ({
        url: `/posts/${postId}`,
        method: 'PATCH',
        body: {
          ...initialPost,
          createdAt: new Date().toISOString(),
        },
      }),
      invalidateTags: (result, error, args) => [{ type: 'Post', id: args.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          // updateQueryData takes three arguments: the name of the endpoint to update, the same cache key value used to identify the specific cached data, and a callback that updates the cached data.
          extendedApiSlice.util.updateQueryData(
            'getPosts',
            'getPosts',
            draft => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddReactionMutation,
  useGetPostsByUserIdQuery,
  useCreateNewPostMutation,
} = extendedApiSlice;

// returns the query result object
export const selectPostResult = extendedApiSlice.endpoints.getPosts.select();

// create memoized selector
const selectPostsData = createSelector(
  selectPostResult,
  postResult => postResult.data // returns normalized state with ids and entities
);

// getSelector creates these selectors by default and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // pass in a selector that returns posts slice of state
} = postAdapter.getSelectors(state => selectPostsData(state) ?? initialState);
