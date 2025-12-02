export enum StringType {
  /** Generate a random string from uppercase and lowercase letters. */
  ALPHABETIC = 'ALPHABETIC',

  /** Generate a random string from uppercase, lowercase and numbers. */
  ALPHANUMERIC = 'ALPHANUMERIC',

  /** Generate a random string from just numeric characters. */
  NUMERIC = 'NUMERIC',
}

const STRINGS = {
  LOWER: 'abcdefghijklmnopqrstuvwxyz',
  UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
};

const CHARACTERS = {
  ALPHABETIC: STRINGS.UPPER + STRINGS.LOWER,
  ALPHANUMERIC: STRINGS.UPPER + STRINGS.LOWER + STRINGS.NUMBERS,
  NUMERIC: STRINGS.NUMBERS,
};

export function randomString(
  /** Max length of the unique string of characters. */
  length: number = 6,

  /** String type from alphabetic characters and number characters. */
  type: StringType = StringType.ALPHANUMERIC,
) {
  const chars = CHARACTERS[type];
  return [...Array(length)].reduce(
    (a: string) => a + chars[~~(Math.random() * chars.length)],
    '',
  );
}
