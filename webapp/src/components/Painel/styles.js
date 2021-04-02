import styled from 'styled-components';

export const GraphSection = styled.section`
  position: relative;
  padding: 10rem 0 8rem;
  @media only screen and (max-width: 768px) {
    padding: 4rem 0 4rem;
  }
`;

export const Svg = styled.svg``;

export const Container = styled.div`
  display: flex;

  @media only screen and (max-width: 768px) {
    display: block;
  }

  div {
    flex: 1;
    @media only screen and (max-width: 768px) {
      flex: 0;
    }
  }

  .right {
    padding-top: 9%;
    @media only screen and (max-width: 768px) {
      padding-top: 0;
    }
  }

  img {
    border-radius: 50%;
    height: 48px;
  }

  .userInfo {
    padding-top: 1rem;
    display: inline-flex;

    p {
      padding-top: 1rem;
      padding-right: 1rem;
    }
  }

  #hierarchical svg {
    width: 100%;
  }
`;
