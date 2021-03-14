function SvgIcon({ src, width, height }) {
  return <img src={`/img/svg/${src}`} alt={src} with={width} height={height} />;
}

export default SvgIcon;
