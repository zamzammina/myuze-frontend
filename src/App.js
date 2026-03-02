import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './screens/Home';
import TutorialDetail from './screens/TutorialDetail';
import TutorialViewer from './screens/TutorialViewer';
import MyKit from './screens/MyKit';
import Profile from './screens/Profile';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tutorial/:id" element={<TutorialDetail />} />
          <Route path="tutorial/:id/view" element={<TutorialViewer />} />
          <Route path="kit" element={<MyKit />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
