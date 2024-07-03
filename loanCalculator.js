const messagePrompts = require('./loanMessages.json');
const readline = require('readline-sync');
const ask = readline.question;

const prompt = (message) => {
  return `=> ${console.log(message)}`;
};

const invalidNumber = number => Number.isNaN(Number(number)) || number.trimStart() === '' || Number(number) < 1;

const getValidNumber = () => {
  let number = ask();

  while (invalidNumber(number)) {
    console.clear();
    const notValid = `'${number}' ${messagePrompts.notValidNumber}`;
    prompt(notValid);
    prompt(messagePrompts.enterValidNumber);
    number = ask();
  }
  console.clear();
  number = Number(number);
  return number;
};

// convert APR input to decimal
const numberToDecimal = () => {
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

const calculateMonthlyPayment = (
  loanAmount, loanDuration, monthlyInterestRate
) => {
  console.clear();
  const denominator = 1 - Math.pow((1 + monthlyInterestRate), -loanDuration);
  const monthlyPayment = loanAmount * (monthlyInterestRate / denominator);
  return monthlyPayment;
};

// having some fun here
const reasonableMonthlyPayment = (monthlyPayment, totalPaid ,totalInterest) => {
  const scream = `Your monthly payment is $${monthlyPayment.toFixed(2)}!!! \nYour total interest paid would be $${totalInterest.toFixed(2)} over the life of the loan!! \nYou would pay $${totalPaid.toFixed(2)} in total! \nYou might want to reconsider!`;
  const reasonable = `Your monthly payment is $${monthlyPayment.toFixed(2)} \nYour total interest paid would be $${totalInterest.toFixed(2)} over the life of the loan.\nYou would pay $${totalPaid.toFixed(2)} in total!`;

  if (monthlyPayment >= 400) return scream.toUpperCase();
  return reasonable;
};

function runLoanCalculator() {
  prompt(messagePrompts.greeting);
  prompt(messagePrompts.askForLoanAmount);
  const loanAmount = getValidNumber();
  prompt(`Your loan amount is $${loanAmount.toLocaleString()}`);
  const annualPercentageRate = numberToDecimal();
  const monthlyInterestRate = annualPercentageRate / 12;
  const loanDurationInMonths = loanDuration();
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount, loanDurationInMonths, monthlyInterestRate
  );
  const totalPaidAfterInterest = monthlyPayment * loanDurationInMonths;
  const totalInterest = totalPaidAfterInterest - loanAmount;

  return reasonableMonthlyPayment(
    monthlyPayment, totalPaidAfterInterest, totalInterest
  );
}

console.log(runLoanCalculator());