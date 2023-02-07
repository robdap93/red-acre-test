import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';

import Home from './pages/Home';
import Data from './pages/Data';
import Test from './pages/Test';

function App() {
  return (
    <Router>
    <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/data' element={<Data/>} />
        <Route path='/test' element={<Test/>} />
    </Routes>
    </Router>
  );
}

export default App;
