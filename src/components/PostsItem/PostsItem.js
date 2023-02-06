import React from 'react';
import PostTime from '../PostTime/PostTime';
import PostAuthor from '../PostAuthor/PostAuthor';
import PostReactionBtns from '../PostReactionBtns/PostReactionBtns';
import { useGetPostsQuery } from '../../features/posts/postSlice_rtkQuery';

const PostsItem = ({ postId }) => {
  const { post } = useGetPostsQuery('getPosts', {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });

  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.body.substring(0, 100)}</p>
      <p className="post-author">
        <PostAuthor userId={post.userId} />
        <PostTime timestamp={post.createdAt} />
      </p>
      <PostReactionBtns post={post} />
    </article>
  );
};

export default PostsItem;
