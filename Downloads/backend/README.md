# MedWise Backend

## Recommended Folder Structure

```
backend/
  src/
    index.ts            # Entry point
    users.ts            # User routes/controllers
    medications.ts      # Medication routes/controllers
    middlewares/        # Custom Express middlewares
    utils/              # Utility/helper functions
    prisma/             # (optional) Prisma helpers
  prisma/
    schema.prisma       # Prisma schema
    migrations/         # Prisma migrations
  .env                  # Environment variables
  package.json
  tsconfig.json
  README.md
```

- **Each resource (User, Medication, etc.) gets its own file or folder.**
- **Use routers for modular route definitions.**
- **Keep business logic in controllers/services if app grows.**
- **Add middlewares and utils as needed.** 