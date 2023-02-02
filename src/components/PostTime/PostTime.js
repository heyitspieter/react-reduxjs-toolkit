import { parseISO, formatDistanceToNow } from 'date-fns';

const PostTime = ({ timestamp }) => {
  let time = '';

  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);

    time = `${timePeriod} ago`;
  }

  return (
    <span>
      &nbsp; <i>{time}</i>
    </span>
  );
};

export default PostTime;
