const messagePrompts = require('./loanMessages.json');
const readline = require('readline-sync');
const ask = readline.question;

const prompt = (message) => {
  return `=> ${console.log(message)}`;
};

const invalidNumber = number => Number.isNaN(Number(number)) || number.trimStart() === '' || Number(number) < 0;

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
const positiveNumberToDecimal = () => {
  prompt(messagePrompts.askForAPR);
  let APR = getValidNumber();
  if (APR === 0) return APR;
  APR /= 100;
  prompt(`Which is ${APR}%`);
  return APR;
};

const loanDurationFromYearsToMonths = () => {
  prompt(messagePrompts.askForLoanDuration);
  const loanDuration = getValidNumber();
  const year = 12;
  return loanDuration * year;
};

const reasonableMonthlyPayment = (monthlyPayment, totalBeforeInterest ,totalInterest = 0) => {
  const scream = '\nYou might want to reconsider!'.toUpperCase();
  const paymentInfo = `Your monthly payment is $${monthlyPayment.toFixed(2)} \nYour total interest paid would be $${totalInterest.toFixed(2)} over the life of the loan.\nYou would pay $${(totalBeforeInterest + totalInterest).toFixed(2)} in total!`;

  if (monthlyPayment >= 400) {
    console.log(paymentInfo + scream);
    return;
  }
  console.log(paymentInfo);
};

const calculateMonthlyPaymentWithInterest = (
  loanAmount, loanDuration, monthlyInterestRate
) => {
  console.clear();
  const denominator = 1 - Math.pow((1 + monthlyInterestRate), -loanDuration);
  const monthlyPayment = loanAmount * (monthlyInterestRate / denominator);
  return monthlyPayment;
};

const calculateInterestFreeMonthlyPayment = (loanAmount, loanDuration) => {
  console.clear();
  const monthlyPayment = loanAmount / loanDuration;
  return reasonableMonthlyPayment(monthlyPayment, loanAmount);
};

const restartLoanCalculator = () => {
  prompt(messagePrompts.calculateAnotherLoan);
  const response = ask().toLowerCase();
  if (response === 'y' || response === "yes") {
    console.clear();
    return runLoanCalculator();
  } else if (response === 'n' || response === "no") {
    console.log('Take care!');
    return;
  }
  prompt(messagePrompts.enterValidSelection);
  return restartLoanCalculator();
};

function runLoanCalculator() {
  prompt(messagePrompts.askForLoanAmount);
  const loanAmount = getValidNumber();
  prompt(`Your loan amount is $${loanAmount.toLocaleString()}`);
  const loanDurationInMonths = loanDurationFromYearsToMonths();
  const annualPercentageRate = positiveNumberToDecimal();
  if (annualPercentageRate === 0) {
    calculateInterestFreeMonthlyPayment(loanAmount, loanDurationInMonths);
  } else {
    const monthlyInterestRate = annualPercentageRate / 12;
    const monthlyPayment = calculateMonthlyPaymentWithInterest(
      loanAmount, loanDurationInMonths, monthlyInterestRate);
    const totalPaidAfterInterest = monthlyPayment * loanDurationInMonths;
    const totalInterest = totalPaidAfterInterest - loanAmount;
    reasonableMonthlyPayment(
      monthlyPayment, loanAmount, totalInterest
    );
  }
  return restartLoanCalculator();
}
prompt(messagePrompts.greeting);
runLoanCalculator();