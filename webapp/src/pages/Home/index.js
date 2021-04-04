import React, { lazy, Suspense } from 'react';

const Painel = lazy(() => import('../../components/Painel'));
const Hero = lazy(() => import('../../components/Hero'));
const Container = lazy(() => import('../../common/Container'));
const ContentBlock = lazy(() => import('../../components/ContentBlock'));
const HierarchicalEdge = lazy(() =>
  import('../../components/HierarchicalEdge'),
);
const MapPainel = lazy(() => import('../../components/MapPainel'));

function Home() {
  return (
    <>
      <Hero />
      <Container>
        <Painel />
        <MapPainel />
      </Container>
    </>
  );
}

export default Home;
