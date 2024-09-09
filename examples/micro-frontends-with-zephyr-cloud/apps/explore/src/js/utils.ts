export function src(image: string, size: number) {
  return image.replace('[size]', `${size}`);
}

export function srcset(image: string, sizes: Array<number> = []) {
  return sizes.map((size) => `${src(image, size)} ${size}w`).join(', ');
}

export function fmtprice(price: number) {
  return `${price},00 Ø`;
}
