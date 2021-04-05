function SvgIcon({ src, width, height }) {
  return (
    <img
      src={`/twitter-polarization/img/svg/${src}`}
      alt={src}
      with={width}
      height={height}
    />
  );
}

export default SvgIcon;
