module.exports = {
   testEnvironment: 'node',
   moduleFileExtensions: ['js', 'json', 'ts'],
   rootDir: 'test',
   testRegex: '^.+\\.spec\\.(t|j)s$',
   transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
   },
   collectCoverageFrom: ['**/*.(t|j)s'],
};
