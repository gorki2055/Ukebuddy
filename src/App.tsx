import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tuner from './pages/Tuner';
import ChordLibrary from './pages/ChordLibrary';
import Practice from './pages/Practice';
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tuner" element={<Tuner />} />
            <Route path="chords" element={<ChordLibrary />} />
            <Route path="practice" element={<Practice />} />
            <Route path="auth" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
