export const splitNumber = (num: number) => {
  return String(num).replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
};
