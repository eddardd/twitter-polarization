import { withTranslation } from 'react-i18next';
import { HeroDiv } from './styles';
import { Parallax } from 'react-parallax';

import cover from '../../assets/cover.jpg';

function Hero() {
  return (
    <Parallax bgImage={cover} strength={-300} blur={{ min: -15, max: 15 }}>
      <HeroDiv className="hero">
        <h1>Polarização Politica</h1>
      </HeroDiv>
    </Parallax>
  );
}

export default withTranslation()(Hero);
