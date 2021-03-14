import * as S from './styles';

function Button({ color, width, children, onClick }) {
  return (
    <S.Button color={color} width={width} onClick={onClick}>
      {children}
    </S.Button>
  );
}

export default Button;
