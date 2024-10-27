/**
 * @module
 * Encode utility - from honojs/hono/../utils/encode.ts.
 */

export const decodeBase64Url = (str: string): Uint8Array => {
  return decodeBase64(str.replace(/_|-/g, (m) => ({ _: '/', '-': '+' })[m] ?? m));
};

export const encodeBase64Url = (buf: ArrayBufferLike): string => encodeBase64(buf).replace(/\/|\+/g, (m) => ({ '/': '_', '+': '-' })[m] ?? m);

// This approach is written in MDN.
// btoa does not support utf-8 characters. So we need a little bit hack.
export const encodeBase64 = (buf: ArrayBufferLike): string => {
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0, len = bytes.length; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// atob does not support utf-8 characters. So we need a little bit hack.
export const decodeBase64 = (str: string): Uint8Array => {
  const binary = atob(str);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i);
    bytes[j] = binary.charCodeAt(j);
  }
  return bytes;
};

export const asyncIterableToArrayBuffer = async (asyncIterable: AsyncIterable<Uint8Array>) => {
  const chunks = [];

  for await (const chunk of asyncIterable) {
    chunks.push(chunk);
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const buffer = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }

  return buffer.buffer;
};
