import { lazy, Suspense } from 'react';

import IntroContent from '../../content/IntroContent.json';
import MiddleBlockContent from '../../content/MiddleBlockContent.json';
import AboutContent from '../../content/AboutContent.json';
import MissionContent from '../../content/MissionContent.json';
import ProductContent from '../../content/ProductContent.json';

const Hero = lazy(() => import('../../components/Hero'));
const RetweetGraph = lazy(() => import('../../components/RetweetGraph'));
const ContentBlock = lazy(() => import('../../components/ContentBlock'));
const MiddleBlock = lazy(() => import('../../components/MiddleBlock'));
const Container = lazy(() => import('../../common/Container'));
const ScrollTop = lazy(() => import('../../common/ScrollToTop'));

function Home() {
  return (
    <>
      <Hero />
      <Container>
        <ScrollTop />
        <Suspense fallback="<div>">
          <RetweetGraph />
        </Suspense>
        <MiddleBlock
          title={MiddleBlockContent.title}
          content={MiddleBlockContent.text}
          button={MiddleBlockContent.button}
        />
        <ContentBlock
          type="left"
          title={AboutContent.title}
          content={AboutContent.text}
          section={AboutContent.section}
          icon="graphs.svg"
          id="about"
        />
        <ContentBlock
          type="right"
          title={MissionContent.title}
          content={MissionContent.text}
          icon="product-launch.svg"
          id="mission"
        />
        <ContentBlock
          type="left"
          title={ProductContent.title}
          content={ProductContent.text}
          icon="waving.svg"
          id="product"
        />
      </Container>
    </>
  );
}

export default Home;
