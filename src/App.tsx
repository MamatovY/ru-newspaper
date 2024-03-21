import React from 'react';
import './App.css';
import Posts from 'components/posts';
import { Container } from 'components/Container';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Post from 'components/post';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Container>
          <Routes>
            <Route path='/' element={<Posts />} />
            <Route path='/posts/:id' element={<Post />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
