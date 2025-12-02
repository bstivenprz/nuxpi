import { globSync } from 'glob';
import { join } from 'path';

import { Logger, Provider } from '@nestjs/common';

interface AutoProviderModuleOptions {
  directory: string;
  fileNameSuffix: string;
  patterns: { preffix?: string; suffix?: string }[];
}

export class DynamicProviderInjection {
  static logger: Logger = new Logger();

  static inject({
    directory,
    fileNameSuffix,
    patterns,
  }: AutoProviderModuleOptions): Provider[] {
    const path = join(directory, `**/*.${fileNameSuffix}.js`);
    const normalizedPath = path.replace(/\\/g, '/');
    const files = globSync(normalizedPath, { absolute: true });
    const providers: Provider[] = [];

    if (files.length === 0) {
      this.logger.warn(
        `Found ${files.length} files in "${normalizedPath}" with suffix "${fileNameSuffix}"`,
      );
      return [];
    }

    for (const file of files) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const moduleExports = require(file);

      for (const exportName in moduleExports) {
        const exported = moduleExports[exportName];

        if (typeof exported === 'function') {
          for (const pattern of patterns) {
            const matchesPrefix = pattern.preffix
              ? exportName.startsWith(pattern.preffix)
              : true;
            const matchesSuffix = pattern.suffix
              ? exportName.endsWith(pattern.suffix)
              : true;

            if (matchesPrefix && matchesSuffix) {
              providers.push(exported);
              break;
            }
          }
        }
      }
    }

    if (providers.length === 0) {
      this.logger.warn(
        `No providers found in ${directory} with suffix ${fileNameSuffix}`,
      );
      return [];
    }

    return providers;
  }

  static injectHandlers(directory: string): Provider[] {
    return DynamicProviderInjection.inject({
      directory,
      fileNameSuffix: 'handler',
      patterns: [
        {
          suffix: 'CommandHandler',
        },
        {
          suffix: 'QueryHandler',
        },
        {
          suffix: 'EventHandler',
        },
      ],
    });
  }
}
