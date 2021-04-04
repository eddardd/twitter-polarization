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

  .left {
    padding-left: 15%;
    @media only screen and (max-width: 768px) {
      padding-left: 0%;
    }
  }
`;
