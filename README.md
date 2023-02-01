# Auth core

### Purpose 

The application is a solution for unified authentication methods across many applications.
It's based of asymmetric hashing of JWT tokens, with support for sessions and roles

### Content

- [Auth Core](./apps/auth/README.md)
- [Nestjs library](./libs/nestjs-auth/README.md)
- [Recipes](./docs/recipes.md)
- [Plugins](./docs/plugins.md)

### Development

To run the core locally for development purposes, there are a couple steps you have to follow:

1. Install dependencies using `npm install` or `yarn`.
2. Copy the file `.env.example` to `.env` in the `apps/auth` directory
3. Bring up the development database by using `docker-compose up -d`
4. Run the app using `nx serve`

If everything went according to plan, you should have the app running on port 3333

### Contributing 

To make a code contribution, create a PR from your own repository to the master branch.
