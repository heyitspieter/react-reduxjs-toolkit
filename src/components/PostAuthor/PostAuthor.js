import { useSelector } from 'react-redux';
import { allUsers } from '../../features/users/usersSlice';

const PostAuthor = ({ userId }) => {
  const users = useSelector(allUsers);

  const author = users.find(({ id }) => id === userId);

  return <span>by {author ? author.name : 'Unknown author'}</span>;
};

export default PostAuthor;
