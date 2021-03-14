import { withTranslation } from 'react-i18next';
import { HeroDiv } from './styles';
import Parallax from 'react-parallax';

function Hero() {
  return (
    <HeroDiv className="hero">
      <h1>Polarização Politica</h1>
    </HeroDiv>
  );
}

export default withTranslation()(Hero);
