module.exports = function (plop) {
  // Add a helper to convert to kebab case
  plop.setHelper("kebabCase", (text) => {
    return text.replace(/\s+/g, "-").toLowerCase();
  });

  // Create an application generator
  plop.setGenerator("application", {
    description: "Create a new application",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of your application? (in kebab-case format)",
        validate: (value) => {
          if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
            return true;
          }
          return "Name must be in kebab-case format (e.g., my-app-name)";
        },
      },
      {
        type: "list",
        name: "type",
        message: "Which type of application would you like to create?",
        choices: [
          "nextjs-app-router-flowbite",
          "ui-component-library",
          "nodejs-library",
          "node-fastify-bff-service",
        ],
      },
      {
        type: "input",
        name: "port",
        message: "Which port would you like to use for the dev server?",
        default: "3001",
        when: (answers) => answers.type === "nextjs-app-router-flowbite",
        validate: (value) => {
          if (
            /^\d+$/.test(value) &&
            parseInt(value) > 0 &&
            parseInt(value) < 65536
          ) {
            return true;
          }
          return "Port must be a valid number between 1 and 65535";
        },
      },
      {
        type: "input",
        name: "servicePort",
        message: "Which port would you like to use for the Fastify service?",
        default: "3000",
        when: (answers) => answers.type === "node-fastify-bff-service",
        validate: (value) => {
          if (
            /^\d+$/.test(value) &&
            parseInt(value) > 0 &&
            parseInt(value) < 65536
          ) {
            return true;
          }
          return "Port must be a valid number between 1 and 65535";
        },
      },
    ],
    actions: function (data) {
      const actions = [];

      if (data.type === "nextjs-app-router-flowbite") {
        // Create a Next.js app with App Router and Flowbite
        actions.push({
          type: "addMany",
          destination: "apps/{{name}}",
          base: "tools/templates/nextjs-app-router-flowbite",
          templateFiles: "tools/templates/nextjs-app-router-flowbite/**/*.hbs",
          globOptions: {
            dot: true, // Include files that start with a dot
          },
          data: {
            name: data.name,
            kebabName: data.name, // Already in kebab case due to validation
            port: data.port || "3001", // Use the provided port or default to 3001
          },
        });

        // Update package.json in the new app
        actions.push({
          type: "modify",
          path: "apps/{{name}}/package.json",
          pattern: /"name": ".*"/,
          template: '"name": "@repo/{{name}}"',
        });

        // Update turbo.json to include the new app in pipeline if needed
        actions.push({
          type: "modify",
          path: "turbo.json",
          pattern: /"pipeline": {/,
          template:
            '"pipeline": {\n    // Make sure {{name}} is included in the pipeline',
          skip: () =>
            "No need to modify turbo.json as it already includes all apps",
        });
      } else if (data.type === "ui-component-library") {
        // Create a UI component library
        actions.push({
          type: "addMany",
          destination: "packages/{{name}}",
          base: "tools/templates/ui-component-library",
          templateFiles: "tools/templates/ui-component-library/**/*.hbs",
          globOptions: {
            dot: true, // Include files that start with a dot
          },
          data: {
            name: data.name,
            kebabName: data.name, // Already in kebab case due to validation
          },
        });

        // Update package.json in the new library
        actions.push({
          type: "modify",
          path: "packages/{{name}}/package.json",
          pattern: /"name": ".*"/,
          template: '"name": "@repo/{{name}}"',
        });

        // Update turbo.json to include the new package in pipeline if needed
        actions.push({
          type: "modify",
          path: "turbo.json",
          pattern: /"pipeline": {/,
          template:
            '"pipeline": {\n    // Make sure {{name}} is included in the pipeline',
          skip: () =>
            "No need to modify turbo.json as it already includes all packages",
        });
      } else if (data.type === "nodejs-library") {
        // Create a Node.js library
        actions.push({
          type: "addMany",
          destination: "packages/{{name}}",
          base: "tools/templates/nodejs-library",
          templateFiles: "tools/templates/nodejs-library/**/*.hbs",
          globOptions: {
            dot: true, // Include files that start with a dot
          },
          data: {
            name: data.name,
            kebabName: data.name, // Already in kebab case due to validation
          },
        });

        // Update package.json in the new library
        actions.push({
          type: "modify",
          path: "packages/{{name}}/package.json",
          pattern: /"name": ".*"/,
          template: '"name": "@repo/{{name}}"',
        });

        // Update turbo.json to include the new package in pipeline if needed
        actions.push({
          type: "modify",
          path: "turbo.json",
          pattern: /"pipeline": {/,
          template:
            '"pipeline": {\n    // Make sure {{name}} is included in the pipeline',
          skip: () =>
            "No need to modify turbo.json as it already includes all packages",
        });
      } else if (data.type === "node-fastify-bff-service") {
        // Create a Node.js Fastify BFF service
        actions.push({
          type: "addMany",
          destination: "services/{{name}}",
          base: "tools/templates/node-fastify-bff-service",
          templateFiles: "tools/templates/node-fastify-bff-service/**/*.hbs",
          globOptions: {
            dot: true, // Include files that start with a dot
          },
          data: {
            name: data.name,
            kebabName: data.name, // Already in kebab case due to validation
            servicePort: data.servicePort || "3000", // Use the provided service port or default to 3000
          },
        });

        // Update package.json in the new service
        actions.push({
          type: "modify",
          path: "services/{{name}}/package.json",
          pattern: /"name": ".*"/,
          template: '"name": "@repo/{{name}}"',
        });

        // Update turbo.json to include the new service in pipeline if needed
        actions.push({
          type: "modify",
          path: "turbo.json",
          pattern: /"pipeline": {/,
          template:
            '"pipeline": {\n    // Make sure {{name}} is included in the pipeline',
          skip: () =>
            "No need to modify turbo.json as it already includes all services",
        });
      }

      console.log(
        `\nSuccessfully created ${data.type} application: ${data.name}\n`
      );

      return actions;
    },
  });
};
