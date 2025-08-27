const { getDMMF } = require('@prisma/internals');

module.exports = async (options) => {
  console.log("DTO Generator running with options:", options);

  // your generation logic...
  // e.g. write DTOs to options.output

  // make sure to exit
  process.exit(0);
};
