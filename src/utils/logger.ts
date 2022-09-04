import chalk from 'chalk'

export const devLog = (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(chalk.green(message))
    console.log('\r\n')
    console.log(
      chalk.blue(
        'this log is just for development, will be removed on production environment!!!'
      )
    )
  }
}
