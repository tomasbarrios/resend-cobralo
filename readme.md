# Latest updates
Implementation of cron in fly.io [Cron example for fly](https://github.com/hrumhurum/docker-recipes/tree/main/cron)

## Previous updates

# Run

`npm run dev` 

# Development

Not for everyday use, but must use when dealing with DB changes
## DB

#### To reflect any schema changes into the prisma client

`npx prisma generate`
> 

### Docker

exec bash ([stackoverflow](https://stackoverflow.com/questions/42353949/executing-bash-then-running-commands-in-docker))
`docker exec -it container mycommand`

## References

First approach is was to make a express server, the we realized is not needed.
- [Article (Lazy Panda)](https://lazypandatech.com/blog/NodeJS/45/How-to-create-a-Node-TypeScript-based-Scheduled-job-using-node-corn/)
- [Source](https://github.com/lazypanda-instance/corn-job-email-scheduler/blob/master/src/jobs/email-scheduler/emailScheduler.ts)
#### Resend
- [With express](https://github.com/resendlabs/resend-express-example/blob/main/index.ts)
- [With node (no express)](https://github.com/resendlabs/resend-node-example/blob/main/package.json)

#### Prisma

[Prisma with node](https://github.com/prisma/prisma-examples/tree/latest/javascript/script)
____

> Desde aca hacia abajo, el repo original
# Resend with Express

This example shows how to use Resend with [Express](https://expressjs.com).

## Prerequisites

To get the most out of this guide, you’ll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

## Instructions

1. Define environment variables in `.env` file.

2. Install dependencies:

  ```sh
npm install
# or
yarn
  ```

3. Run Express locally:

  ```sh
npm run dev
  ```

4. Open URL in the browser:

  ```
http://localhost:3000
  ```

## License

MIT License