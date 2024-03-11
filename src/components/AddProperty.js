import React, { useState } from "react";

const PropertyMortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculateMortgage = (e) => {
    e.preventDefault();
    const monthlyInterestRate = interestRate / 100 / 12;
    const loanTermMonths = loanTerm * 12;

    const monthlyPaymentValue =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

    setMonthlyPayment(monthlyPaymentValue.toFixed(2));
  };

  return (
    <div className="mortgage-calculator">
      <h2>Property Mortgage Calculator</h2>
      <form onSubmit={calculateMortgage} className="form-user-add">
        <div className="form-user-add-wrapper">
          <div className="form-user-add-inner-wrap">
            <label>
              Loan Amount:
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </label>
          </div>
          <div className="form-user-add-inner-wrap">
            <label>
              Interest Rate (%):
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </label>
          </div>
          <div className="form-user-add-inner-wrap">
            <label>
              Loan Term (years):
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="form-user-add-inner-btm-btn-wrap">
          <button type="submit">Calculate</button>
        </div>
      </form>
      {monthlyPayment && (
        <div className="mortgage-result">
          <h3>Monthly Payment:</h3>
          <p>${monthlyPayment}</p>
          <p>Total Payment: ${(monthlyPayment * loanTerm * 12).toFixed(2)}</p>
          <p>Total Interest: ${(monthlyPayment * loanTerm * 12 - loanAmount).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default PropertyMortgageCalculator;
