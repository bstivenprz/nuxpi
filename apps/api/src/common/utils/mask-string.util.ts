export class MaskStringUtil {
  private mask: string;

  constructor(mask = '*') {
    this.mask = mask;
  }

  maskString(value: string, length: number) {
    const regx = new RegExp(`.(?<=.{${length}})`, 'g');
    return value
      .split(' ')
      .reduce((acc, crr) => acc + crr.replace(regx, this.mask) + ' ', '')
      .trim();
  }

  maskNumber(value: string, length: number) {
    const regx = new RegExp(`.(?=.{${length}})`, 'g');
    return value.replace(regx, this.mask);
  }

  maskEmail(value: string, length: number) {
    const arrValues = value.split('@');
    return (
      this.maskString(arrValues[0], length) +
      '@' +
      this.maskString(arrValues[1], length)
    );
  }
}
