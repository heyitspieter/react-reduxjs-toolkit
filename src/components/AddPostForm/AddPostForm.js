import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers } from '../../features/users/usersSlice';
import { createNewPost } from '../../features/posts/postsSlice';

import './AddPostForm.css';

const AddPostForm = () => {
  const [inputs, setInputs] = useState({
    title: '',
    content: '',
  });

  const [userId, setUserId] = useState('');

  const [reqStatus, setReqStatus] = useState('idle');

  const users = useSelector(allUsers);

  const { title, content } = inputs;

  const dispatch = useDispatch();

  useEffect(() => {
    if (reqStatus !== 'idle') {
      alert(reqStatus);
    }
  }, [reqStatus]);

  const inputChangeHandler = (key, e) => {
    const value = e.target.value;

    setInputs(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onSelectUser = e => {
    setUserId(e.target.value);
  };

  const onSavePost = e => {
    e.preventDefault();

    for (const key in inputs) {
      if (inputs[key].trim().length <= 0) {
        return;
      }
    }

    try {
      setReqStatus('pending');

      // Dispatch reducer action creator
      dispatch(createNewPost({ title, body: content, userId })).unwrap();

      setUserId('');

      setInputs({ title: '', content: '' });
    } catch (error) {
      console.log('Failed to save post', error);
    } finally {
      setReqStatus('idle');
    }
  };

  const userOptions = users.map(user => {
    return (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    );
  });

  return (
    <div className="new-post">
      <h2>Add a new post</h2>
      <form onSubmit={e => onSavePost(e)} className="form">
        <div className="form-group">
          <label htmlFor="title" className="form-group__label">
            Post Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            className="form-group__input"
            onChange={e => inputChangeHandler('title', e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content" className="form-group__label">
            Post Content
          </label>
          <textarea
            id="content"
            type="text"
            value={content}
            className="form-group__input"
            onChange={e => inputChangeHandler('content', e)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="author" className="form-group__label">
            Post Author
          </label>
          <select
            id="author"
            value={userId}
            className="form-group__input"
            onChange={e => onSelectUser(e)}
          >
            <option value="">-- Select Author --</option>
            {userOptions}
          </select>
        </div>
        <div className="form-group">
          <button className="form-group__btn">Create Post</button>
        </div>
      </form>
    </div>
  );
};

export default AddPostForm;
