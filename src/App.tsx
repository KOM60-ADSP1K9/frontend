import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <AppRouter />
    </>
  );
}

export default App;
