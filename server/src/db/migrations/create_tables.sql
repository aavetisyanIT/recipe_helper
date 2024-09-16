-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
    "UserID" SERIAL PRIMARY KEY,
    "Username" VARCHAR(255) UNIQUE NOT NULL,
    "Email" VARCHAR(255) UNIQUE NOT NULL,
    "HashedPassword" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'recipes' table
CREATE TABLE IF NOT EXISTS recipes (
    "RecipeID" SERIAL PRIMARY KEY,
    "Title" VARCHAR(255) NOT NULL,
    "Ingredients" TEXT NOT NULL,
    "Instructions" TEXT NOT NULL,
    "AuthorID" INTEGER REFERENCES users("UserID"),
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);