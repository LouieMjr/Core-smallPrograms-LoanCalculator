const messagePrompts = require('./loanMessages.json');
const readline = require('readline-sync');
const ask = readline.question;

const prompt = (message) => {
  return `=> ${console.log(message)}`;
};

const invalidNumber = number => Number.isNaN(Number(number)) || number.trimStart() === '';

const getValidNumber = () => {
  let number = ask();

  while (invalidNumber(number)) {
    console.clear();
    const notValid = `'${number}' ${messagePrompts.notValidNumber}`;
    prompt(notValid);
    prompt(messagePrompts.enterValidNumber);
    number = ask();
  }
  number = Number(number);
  return number;
};

const numberToPercentageRate = () => {
  prompt(messagePrompts.askForAPR);
  let APR = getValidNumber();
  APR /= 100;
  prompt(`Which is ${APR}%`);
  return APR;
};

const loanDuration = () => {
  prompt(messagePrompts.askForLoanDuration);
  const loanDuration = getValidNumber();
  return loanDuration;
};

const calculateMonthlyPayment = (loanAmount, loanDuration, monthlyInterestRate) => {
  const denominator = 1 - Math.pow((1 + monthlyInterestRate), -loanDuration);
  const monthlyPayment = loanAmount * (monthlyInterestRate / denominator);
  return monthlyPayment;
};

function runLoanCalculator() {
  prompt(messagePrompts.greeting);
  prompt(messagePrompts.askForLoanAmount);
  const loanAmount = getValidNumber();
  prompt(`Your loan amount is $${loanAmount.toLocaleString()}`);
  const annualPercentageRate = numberToPercentageRate();
  const monthlyInterestRate = annualPercentageRate / 12;
  const loanDurationInMonths = loanDuration();
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount, loanDurationInMonths, monthlyInterestRate
  );
  return `Your monthly payment is ${monthlyPayment.toFixed(2)}`;

}

console.log(runLoanCalculator());