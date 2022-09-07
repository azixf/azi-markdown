import chalk from 'chalk'

export const devLog = (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      chalk.green(message) + chalk.red('[ log will be remove on production ]')
    )
  }
}
