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

function Home() {
  return (
    <>
      <Hero />
      <Container>
        <TextWrapper />
        <MapPainel />
        <BubblePainel />
        <Painel />
      </Container>
    </>
  );
}

export default Home;
