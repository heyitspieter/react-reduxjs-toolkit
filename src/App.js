import Posts from './components/Posts/Posts';
import AddPostForm from './components/AddPostForm/AddPostForm';

import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <Posts />
        <AddPostForm />
      </div>
    </div>
  );
}

export default App;
