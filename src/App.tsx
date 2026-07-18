import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tuner from './pages/Tuner';
import ChordLibrary from './pages/ChordLibrary';
import Practice from './pages/Practice';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tuner" element={<Tuner />} />
          <Route path="chords" element={<ChordLibrary />} />
          <Route path="practice" element={<Practice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
