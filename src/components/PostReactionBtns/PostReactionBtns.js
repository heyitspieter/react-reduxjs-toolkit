import { useDispatch } from 'react-redux';
import { addReaction } from '../../features/posts/postsSlice';

import './PostReactionBtns.css';

const emojis = { like: '👍️', wow: '😯', heart: '💙', rocket: '🚀' };

function PostReactions({ post }) {
  const dispatch = useDispatch();

  const onReactionClick = (post, reaction) => {
    dispatch(addReaction({ postId: post.id, reaction }));
  };

  const reactionButtons = Object.entries(emojis).map(([name, emoji]) => {
    return (
      <button
        key={name}
        name={name}
        className="reaction-btn"
        onClick={() => onReactionClick(post, name)}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div className="reaction-buttons">{reactionButtons}</div>;
}

export default PostReactions;
