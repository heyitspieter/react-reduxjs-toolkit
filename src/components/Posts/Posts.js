import { useEffect } from 'react';
import PostsItem from '../PostsItem/PostsItem';
import { useSelector, useDispatch } from 'react-redux';
import {
  allPosts,
  fetchPosts,
  getPostsError,
  getPostsStatus,
} from '../../features/posts/postsSlice';

import './Posts.css';

const Posts = () => {
  const dispatch = useDispatch();

  const posts = useSelector(allPosts);
  const status = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  let content = '';

  if (status === 'pending') {
    content = 'Loading posts..';
  }

  if (status === 'successful') {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    content = orderedPosts.map((post, idx) => (
      <PostsItem key={idx} post={post} />
    ));
  }

  if (status === 'failed') {
    content = <p>{error.message}</p>;
  }

  return (
    <div className="posts">
      <h2>Posts</h2>
      <div className="posts__content">{content}</div>
    </div>
  );
};

export default Posts;
