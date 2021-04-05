import styled from 'styled-components';

export const GraphSection = styled.section`
  position: relative;
  padding: 10rem 0 8rem;
  @media only screen and (max-width: 768px) {
    padding: 4rem 0 4rem;
  }
`;

export const Container = styled.div`
  .column {
    flex: 33.33%;
    padding: 5px;
  }

  .row {
    display: flex;
  }

  iframe {
    top: 0;
    margin: auto;
    left: 0;
    border: none;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

export const SpanHighlight = styled.span`
  padding: 2px;
  font-weight: 600;
  font-style: italic;
`;
