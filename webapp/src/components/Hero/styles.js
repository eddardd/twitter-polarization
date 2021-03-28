import styled from 'styled-components';
import cover from '../../assets/cover.jpg';

export const HeroDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  //background-image: url(${cover});
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

  h1,
  p {
    color: white;
    text-align: center;
    justify-content: center;
  }
`;
