import { memo } from 'react';
import Home from './home';

const AppRouter = () => {
  return (
    <div className="AppRouter">
      <Home/>
    </div>
  );
};

export default memo(AppRouter);