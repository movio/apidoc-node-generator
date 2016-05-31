
export const details = {
  key: 'reduxSaga',
  name: 'Redux Sagas',
};

export function generateCode(service) {
  // console.log(service.resources[0].operations)
  return {
    files: [
      {
        name: 'getGenerators',
        dir: 'generator',
        contents: 'Coming soon - redux sagas',
      },
      {
        name: 'getGeneratorsByKey',
        dir: 'generator',
        contents: 'Coming soon - redux sagas',
      },
    ],
  };
}
