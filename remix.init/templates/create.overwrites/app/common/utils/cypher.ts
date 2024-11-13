export const cypher = () => {
  // TODO: Sort out WebCrypto.crypto on Cloudflare
  return Math.floor(10000000 * Math.random()).toString();

  // const encodeBase64 = (data: Uint8Array): string => btoa(String.fromCharCode(...data));
  // const bytes = new Uint8Array(20);

  // crypto.getRandomValues(bytes);

  // return encodeBase64(bytes);
};
