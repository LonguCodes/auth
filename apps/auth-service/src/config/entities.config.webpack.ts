const importAllFunctions = (
  requireContext: ReturnType<typeof require.context>
) => {
  return requireContext
    .keys()
    .sort()
    .map((filename) => {
      const required = requireContext(filename);
      return Object.keys(required).reduce((result, exportedKey) => {
        const exported = required[exportedKey];
        if (typeof exported === 'function') return result.concat(exported);
        return result;
      }, []);
    })
    .flat();
};

export const entities = importAllFunctions(
  require.context('../../', true, /\.entity\.[tj]s$/, 'sync')
);

export const migrations = importAllFunctions(
  require.context('../../migrations', true, /\.ts$/, 'sync')
);
export const subscribers = importAllFunctions(
  require.context('../../', true, /\.subscriber\.[tj]s$/, 'sync')
);
