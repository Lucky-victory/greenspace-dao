export function resolveIPFSURI(
  ipfsURI: string,
  addGateWayUrl = true,
  gatewayUrl = "https://cloudflare-ipfs.com/"
): string {
  // Check if the URI starts with 'ipfs://'
  if (ipfsURI.startsWith("ipfs://")) {
    // Remove 'ipfs://' and return the modified URI
    const modifiedURI = ipfsURI.replace("ipfs://", "ipfs/");
    return addGateWayUrl ? gatewayUrl + modifiedURI : modifiedURI;
  } else {
    // If the URI doesn't start with 'ipfs://', return as it is
    return addGateWayUrl ? gatewayUrl + ipfsURI : ipfsURI;
  }
}
