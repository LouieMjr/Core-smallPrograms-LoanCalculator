const messagePrompts = require('./loanMessages.json')
const readline = require('readline-sync')
const ask = readline.question;

const prompt = (message) => {
  return `=> ${console.log(message)}`
}

const invalidNumber = number => Number.isNaN(Number(number)) || number.trimStart() === '';

const getNumber = () => {
  prompt(messagePrompts.askForLoanAmount);
  let loanAmount = ask();
  const notValid = `'${loanAmount}' ${messagePrompts.notValidNumber}`
  
  while (invalidNumber(loanAmount)) {
    console.clear();
    prompt(notValid);
    prompt(messagePrompts.askForLoanAmount);
    loanAmount = ask();
  }
  loanAmount = Number(loanAmount)
  return loanAmount

};

function runLoanCalculator() {
  prompt(messagePrompts.greeting)
  return getNumber()
}
console.log(runLoanCalculator());