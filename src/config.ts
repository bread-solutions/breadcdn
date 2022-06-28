const config = {
  debug: true,
  port: process.env.PORT || 18133,
  database: {
    host: process.env.DB_HOST || "cluster0.4mjy8qw.mongodb.net",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || "breadcdn",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "ghYdgC7AiLsvgQsi",
  },
};
export default config;
