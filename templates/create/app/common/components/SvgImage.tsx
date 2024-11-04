// requires @svgx/vite-plugin-react
export type SvgImageProps = {
  href: string;
} & JSX.IntrinsicElements['svg'];

export function SvgImage({ href, ...svgProps }: SvgImageProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <use href={href} />
    </svg>
  );
}
