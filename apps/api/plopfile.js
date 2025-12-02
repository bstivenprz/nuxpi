const generators = [
  'command',
  'controller',
  'domain-exception',
  'entity',
  'event',
  'mapper',
  'module',
  'query',
  'repository',
  'repository-interface',
];

/** @param {import("plop").NodePlopAPI} plop */
module.exports = function main(plop) {
  generators.forEach((generator) => {
    plop.setGenerator(generator, {
      description: `Generates a ${generator}`,
      prompts: [
        {
          type: 'input',
          name: `${generator}`,
          message: `Enter ${generator} name:`,

          validate: (value) => {
            if (!value) {
              return `${generator} name is required`;
            }

            // cannot have spaces
            if (value.includes(' ')) {
              return `${generator} name cannot have spaces`;
            }

            return true;
          },
        },
        {
          type: 'input',
          name: 'location',
          message: `Enter ${generator} location:`,
          validate: (value) => {
            if (!value) {
              return `${generator} location is required`;
            }

            // cannot have spaces
            if (value.includes(' ')) {
              return `${generator} location cannot have spaces`;
            }

            return true;
          },
        },
      ],
      actions(answers) {
        const actions = [];

        if (!answers) return actions;
        const { location } = answers;

        const data = {
          generator,
          location,
        };

        actions.push({
          type: 'addMany',
          templateFiles: `plop/${generator}/**`,
          destination: `./src/${location}/`,
          base: `plop/${generator}`,
          data,
          abortOnFail: true,
          skipIfExists: true,
        });

        return actions;
      },
    });
  });
};
