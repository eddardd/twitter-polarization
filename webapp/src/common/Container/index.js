import * as S from './styles';

function Container({ padding, border, children }) {
  return (
    <S.Container padding={padding} border={border}>
      {children}
    </S.Container>
  );
}

export default Container;
