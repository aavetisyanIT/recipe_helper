import "dotenv/config";

export const grantUserPermissions = `
  GRANT CREATE ON SCHEMA public TO ${process.env.DB_USER};
  GRANT USAGE ON SCHEMA public TO ${process.env.DB_USER};
`;
