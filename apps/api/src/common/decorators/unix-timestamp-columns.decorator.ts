import {
  Column,
  ColumnOptions,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

const unixTransformer = {
  to: (value?: Date) => (!value ? value : Math.round(value.getTime() / 1000)),
  from: (value?: number) => (!value ? value : new Date(value * 1000)),
};

export function UnixTimestampColumn(
  options: ColumnOptions = {},
): PropertyDecorator {
  return Column({
    type: 'bigint',
    transformer: unixTransformer,
    ...options,
  });
}

export function UnixCreateTimestampColumn(
  options: ColumnOptions = {},
): PropertyDecorator {
  return CreateDateColumn({
    type: 'bigint',
    default: () => 'EXTRACT(EPOCH FROM now())',
    transformer: unixTransformer,
    ...options,
  });
}

export function UnixUpdateTimestampColumn(
  options: ColumnOptions = {},
): PropertyDecorator {
  return UpdateDateColumn({
    type: 'bigint',
    default: () => 'EXTRACT(EPOCH FROM now())',
    transformer: unixTransformer,
    ...options,
  });
}

export function UnixDeleteTimestampColumn(
  options: ColumnOptions = {},
): PropertyDecorator {
  return DeleteDateColumn({
    type: 'bigint',
    transformer: unixTransformer,
    ...options,
  });
}
