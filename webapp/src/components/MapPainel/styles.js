import styled from 'styled-components';

export const GraphSection = styled.section`
  position: relative;
  padding: 10rem 0 8rem;
  @media only screen and (max-width: 768px) {
    padding: 4rem 0 4rem;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .map-container.is-locked:after {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    content: '';
    display: block;
  }

  @media only screen and (max-width: 768px) {
    display: block;
  }

  .leaflet-container {
    width: 700px;
    height: 700px;

    @media only screen and (max-width: 768px) {
      width: 350px;
      height: 350px;
    }
  }

  div {
    flex: 1;
    @media only screen and (max-width: 768px) {
      flex: 0;
    }
  }

  .right {
    padding-left: 3%;
  }

  .left {
    @media only screen and (max-width: 768px) {
      padding-left: 0%;
    }
  }
`;
