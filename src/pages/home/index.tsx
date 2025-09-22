import { memo } from 'react';
import Phone from '../../components/phone';

const Home = () => {
  return (
    <div className="Home">
      <Phone />
    </div>
  );
};

export default memo(Home);