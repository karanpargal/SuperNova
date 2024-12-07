export const minimizeAddress = (address: string) => {
  return (
    address.slice(0, 4) +
    "..." +
    address.slice(address.length - 5, address.length - 1)
  );
};
