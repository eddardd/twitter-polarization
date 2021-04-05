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
