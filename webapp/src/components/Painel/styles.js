import styled from 'styled-components';

export const GraphSection = styled.section`
  position: relative;
  padding: 10rem 0 8rem;
  @media only screen and (max-width: 768px) {
    padding: 4rem 0 4rem;
  }

  .column {
    flex: 33.33%;
    padding: 5px;
  }

  .row {
    display: flex;
  }

  .row img {
    width: 80%;
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
    padding-left: 3rem;
    padding-top: 9%;
    @media only screen and (max-width: 768px) {
      padding-top: 0;
    }
  }

  img {
    border-radius: 50%;
    height: 48px;
  }

  .left {
    @media only screen and (max-width: 768px) {
      padding-left: 0%;

      svg {
        width: 100%;
      }
    }
  }

  .userInfo {
    padding-top: 1rem;
    display: inline-flex;

    p {
      padding-top: 1rem;
      padding-right: 1rem;
    }
  }
`;

export const SpanHighlight = styled.span`
  padding: 2px;
  font-weight: 600;
  font-style: italic;
`;
