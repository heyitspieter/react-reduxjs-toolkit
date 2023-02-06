import PostsItem from '../PostsItem/PostsItem';
import { useGetPostsQuery } from '../../features/posts/postSlice_rtkQuery';

import './Posts.css';

const Posts = () => {
  const {
    data: posts,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetPostsQuery('getPosts');

  let content = '';

  if (isLoading) {
    content = 'Loading posts..';
  }

  if (isSuccess) {
    content = posts.ids.map(postId => (
      <PostsItem key={postId} postId={postId} />
    ));
  }

  if (isError) {
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
