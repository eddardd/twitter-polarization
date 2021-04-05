import React, { lazy, Suspense } from 'react';

const Painel = lazy(() => import('../../components/Painel'));
const Hero = lazy(() => import('../../components/Hero'));
const Container = lazy(() => import('../../common/Container'));
const ContentBlock = lazy(() => import('../../components/ContentBlock'));
const HierarchicalEdge = lazy(() =>
  import('../../components/HierarchicalEdge'),
);
const MapPainel = lazy(() => import('../../components/MapPainel'));
const BubblePainel = lazy(() => import('../../components/BubblePainel'));

const TextWrapper = lazy(() => import('../../components/TextWrapper'));
const Ref = lazy(() => import('../../components/Ref'));

const ScrollTo = lazy(() => import('../../common/ScrollToTop'));

function Home() {
  return (
    <>
      <Hero />
      <ScrollTo />
      <Container>
        <MapPainel />
        <BubblePainel />
        <Painel />
        <Ref />
      </Container>
    </>
  );
}

export default Home;
