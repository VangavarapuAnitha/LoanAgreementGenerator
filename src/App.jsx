import { useState } from "react";
import { calculateInterest } from "./utils/calculateInterest";
import "./App.css";
import { lenderDetails } from "./config/lenderConfig";
import { generateDocument } from "./utils/generateDocument";
import { calculateMaturityDate } from "./utils/calculateMaturityDate";

const initialForm = {
  agreementDate: new Date().toISOString().split("T")[0],
  borrowerName: "",
  borrowerAddress: "",
  principalAmount: "",
  interestRate: "",
  duration: "",
  durationUnit: "months",
  startDate: "",
  interestType: "simple",
};

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const { interest, totalAmount } = calculateInterest({
    principal: formData.principalAmount,
    interestRate: formData.interestRate,
    duration: formData.duration,
    durationUnit: formData.durationUnit,
  });

  const maturityDate = calculateMaturityDate(
    formData.startDate,
    formData.duration,
    formData.durationUnit,
  );

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const documentData = {
    ...formData,
    ...lenderDetails,

    agreementDate: formatDate(formData.agreementDate),
    startDate: formatDate(formData.startDate),
    maturityDate,

    interestType: "Simple Interest",
    interestAmount: interest.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
  };

  const handleGenerateDocument = async () => {
    setError("");

    if (
      !formData.borrowerName.trim() ||
      !formData.borrowerAddress.trim() ||
      !formData.principalAmount ||
      !formData.interestRate ||
      !formData.duration ||
      !formData.startDate
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!maturityDate) {
      setError("Please enter a valid loan duration.");
      return;
    }

    try {
      setIsGenerating(true);
      await generateDocument(documentData);
    } catch (err) {
      setError("Unable to generate the document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialForm,
      agreementDate: new Date().toISOString().split("T")[0],
    });

    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <main className="app-container">
      <header className="app-header">
        <div>
          <h1>Loan Agreement Generator</h1>
          <p>Create personalized loan agreements in Word format.</p>
        </div>
        <span className="header-label">DOCUMENT GENERATOR</span>
      </header>

      <div className="content-layout">
        <section className="form-section">
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="section-heading">
              <h2>Agreement Details</h2>
              <p>Enter the agreement information.</p>
            </div>

            <div className="form-group">
              <label htmlFor="agreementDate">Agreement Date</label>
              <input
                type="date"
                id="agreementDate"
                name="agreementDate"
                value={formData.agreementDate}
                onChange={handleChange}
              />
            </div>

            <div className="section-heading">
              <h2>Party Details</h2>
            </div>

            <div className="form-group">
              <label htmlFor="borrowerName">Borrower Name</label>
              <input
                id="borrowerName"
                name="borrowerName"
                value={formData.borrowerName}
                onChange={handleChange}
                placeholder="Enter borrower name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="borrowerAddress">Borrower Address</label>
              <textarea
                id="borrowerAddress"
                name="borrowerAddress"
                value={formData.borrowerAddress}
                onChange={handleChange}
                placeholder="Enter borrower address"
              />
            </div>

            <div className="section-heading">
              <h2>Loan Details</h2>
              <p>Enter principal, interest rate and duration.</p>
            </div>

            <div className="form-group">
              <label htmlFor="principalAmount">Principal Amount (₹)</label>
              <input
                type="number"
                id="principalAmount"
                name="principalAmount"
                min="0"
                step="0.01"
                value={formData.principalAmount}
                onChange={handleChange}
                placeholder="Enter principal amount"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="interestRate">Interest Rate (%)</label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  min="0"
                  step="0.01"
                  value={formData.interestRate}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="0"
                  step="1"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter duration"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="durationUnit">Duration Unit</label>
              <select
                id="durationUnit"
                name="durationUnit"
                value={formData.durationUnit}
                onChange={handleChange}
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Loan Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </form>
        </section>

        <aside className="summary-section">
          <div className="summary-card">
            <h2>Calculation Summary</h2>
            <p className="summary-description">
              Interest calculation updates automatically.
            </p>

            <div className="summary-item">
              <span>Principal Amount</span>
              <strong>
                {formatCurrency(Number(formData.principalAmount) || 0)}
              </strong>
            </div>

            <div className="summary-item">
              <span>Interest Rate</span>
              <strong>{formData.interestRate || 0}% p.a.</strong>
            </div>

            <div className="summary-item">
              <span>Duration</span>
              <strong>
                {formData.duration || 0} {formData.durationUnit}
              </strong>
            </div>

            <div className="summary-item">
              <span>Interest Amount</span>
              <strong>{formatCurrency(interest)}</strong>
            </div>

            <div className="total-amount">
              <span>Total Payable Amount</span>
              <h2>{formatCurrency(totalAmount)}</h2>
            </div>
          </div>
        </aside>
        <div className="button-group">
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>

          <button
            type="button"
            className="generate-button"
            onClick={handleGenerateDocument}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Document"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </main>
  );
}

export default App;
