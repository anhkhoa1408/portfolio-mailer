const dev = {
  app: {
    port: process.env.PORT || 9080,
  },
};

const configs = { dev };
const env: keyof typeof configs = (process.env.NODE_ENV as keyof typeof configs) || "dev";

export default configs[env];
