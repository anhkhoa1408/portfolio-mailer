const dev = {
  app: {
    port: process.env.PORT || 9080,
  },
};

const production = {
  app: {
    port: process.env.PORT || 9080,
  },
};

const configs = { dev, production };
const env: keyof typeof configs = (process.env.NODE_ENV as keyof typeof configs) || "dev";

export default configs[env];
