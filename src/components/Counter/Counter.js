import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  increment,
  decrement,
  reset,
  incrementByValue,
} from '../../features/counter/counterSlice';

const Counter = () => {
  const dispatch = useDispatch();

  const [countValue, setCountValue] = useState(0);
  const counter = useSelector(state => state.counter);

  const onIncrement = () => {
    dispatch(increment());
  };

  const onDecrement = () => {
    dispatch(decrement());
  };

  const onReset = () => {
    dispatch(reset());
    setCountValue(0);
  };

  const onInputChange = e => {
    setCountValue(e.target.value);
  };

  const onAddValue = () => {
    dispatch(incrementByValue(Number(countValue) || 0));
  };

  return (
    <div>
      <h3>Count: {counter.value}</h3>
      <div>
        <button onClick={onIncrement}>+</button>{' '}
        <button onClick={onDecrement}>-</button>
      </div>
      <br />
      <div>
        <input
          type="text"
          value={countValue}
          onChange={e => onInputChange(e)}
        />
      </div>
      <br />
      <div>
        <button onClick={onAddValue}>Add Value</button>{' '}
        <button onClick={onReset}>Reset</button>
      </div>
    </div>
  );
};

export default Counter;
