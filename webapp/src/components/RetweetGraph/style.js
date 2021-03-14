import styled from 'styled-components';

export const GraphSection = styled.section`
  position: relative;
  padding: 10rem 0 8rem;

  @media only screen and (max-width: 768px) {
    padding: 4rem 0 4rem;
  }
`;

export const Svg = styled.svg`
  line.link {
    fill: none;
    stroke: #ddd;
    stroke-opacity: 0.8;
    stroke-width: 1.5px;
  }
`;

export const H1 = styled.h1`
  text-align: center;
`;
