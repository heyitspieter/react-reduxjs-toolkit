import { useAddReactionMutation } from '../../features/posts/postSlice_rtkQuery';

import './PostReactionBtns.css';

const emojis = { like: '👍️', wow: '😯', heart: '💙', rocket: '🚀' };

function PostReactions({ post }) {
  const [addReaction] = useAddReactionMutation();

  const onReactionClick = reaction => {
    const newValue = post.reactions[reaction] + 1;

    addReaction({
      postId: post.id,
      reactions: { ...post.reactions, [reaction]: newValue },
    });
  };

  const reactionButtons = Object.entries(emojis).map(([name, emoji]) => {
    return (
      <button
        key={name}
        name={name}
        className="reaction-btn"
        onClick={() => onReactionClick(name)}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div className="reaction-buttons">{reactionButtons}</div>;
}

export default PostReactions;
