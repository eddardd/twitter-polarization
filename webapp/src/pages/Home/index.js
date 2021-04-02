import React, { lazy, Suspense } from 'react';

const Painel = lazy(() => import('../../components/Painel'));
const Hero = lazy(() => import('../../components/Hero'));
const Container = lazy(() => import('../../common/Container'));
const ContentBlock = lazy(() => import('../../components/ContentBlock'));
const HierarchicalEdge = lazy(() =>
  import('../../components/HierarchicalEdge'),
);

function Home() {
  return (
    <>
      <Hero />
      <Container>
        <Suspense fallback="<div>">
          <Painel />
        </Suspense>
      </Container>
    </>
  );
}

export default Home;
