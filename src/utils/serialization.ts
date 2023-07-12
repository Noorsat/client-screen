export const eraseFromObject = <T extends {}>(target: T, ...erase: string[]): T =>
    Object.assign({}, ...Object.keys(target)
        .filter((n: string) => !erase.includes(n))
        .map((n: string) => (
          // @ts-ignore
          { [n]: target[n] }
        )));

export const removeLettersFromSeat = (seatText: string) => seatText.replace(/\D/g, '');
