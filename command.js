import fs from 'fs'
import qoa from 'qoa'
import shell from 'shelljs'

/**
 * @desc
 * get func name use line
 */
const getDeployFunc = () => {
  let funcArr = []
  const file = fs.readFileSync('./index.mjs', 'utf-8')
  const splitFileLines = file.split('\n')

  for (const line of splitFileLines) {
    if (line.includes('async (event)')) {
      funcArr.push(line.split(' ')[2])
    }
  }

  return funcArr
}

/**
 * @desc
 * pick func name for deploy
 */
const pickGetDeployFunc = async (menu) => {
  const interactive = {
    type: 'interactive',
    query: 'What is Deploy func? ',
    handle: 'treat',
    symbol: '>',
    menu,
  }

  const result = await qoa.prompt([interactive])
  return result?.treat
}

/**
 * @desc
 * execute func use command
 */
const executeDeployCommand = (funcHandler) => {
  const isExist = JSON.parse(shell.exec('aws lambda list-functions'))['Functions'].some((item) => item['FunctionName'] === funcHandler)

  // make zip
  shell.exec(`rm -rf function.zip && zip function.zip ./* -x node_modules public *.json *.txt Makefile *.md command.js`)

  // if) check to exists func
  if (!isExist) {
    shell.exec(
      `aws lambda create-function --function-name ${funcHandler} --runtime nodejs14.x --zip-file fileb://function.zip --handler index.${funcHandler} --role arn:aws:iam::344513066772:role/lambda-ex`
    )

    console.log(`[CREATE] Function of ${funcHandler}`)
    return
  }

  shell.exec(
    `aws lambda update-function-configuration --function-name ${funcHandler} --environment 'Variables={env=dev, author=leedonggyu}'`
  )

  setTimeout(() => {
    // shell.exec(`aws lambda create-function-url-config --function-name ${funcHandler} --auth-type NONE`)
    shell.exec(`aws lambda update-function-code --function-name ${funcHandler} --zip-file fileb://function.zip`)
    console.log(`[UPDATE] Function of ${funcHandler}`)
  }, 5000)

  return
}

new Promise((res, rej) => {
  res(pickGetDeployFunc(getDeployFunc()))
}).then((result) => executeDeployCommand(result))
