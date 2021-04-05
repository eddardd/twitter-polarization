import { withTranslation } from 'react-i18next';
import { HeroDiv } from './styles';
import { Parallax } from 'react-parallax';

import cover from '../../assets/cover.jpg';

function Hero() {
  return (
    <Parallax bgImage={cover} strength={-300} blur={{ min: -15, max: 15 }}>
      <HeroDiv className="hero">
        <h1>
          Polarização na Política Brasileira: uma abordagem através de
          visualização de dados
        </h1>
      </HeroDiv>
    </Parallax>
  );
}

export default withTranslation()(Hero);
