import { memo } from 'react';
import AppRouter from "./pages"

const App = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default memo(App);