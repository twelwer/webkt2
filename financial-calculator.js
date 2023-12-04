class FinancialCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.setupEventListeners();
        console.log('Компонент создан');
    }
    connectedCallback() {
        console.log('Компонент добавлен в DOM');
    }
    disconnectedCallback() {
        console.log('Компонент удален из DOM');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Атрибут ${name} изменен: ${oldValue} -> ${newValue}`);
    }
    static get observedAttributes() {
        return ['loan-amount', 'interest-rate', 'loan-term'];
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Стили для изоляции компонента */
                /* ... */
            </style>
            <form id="calculator-form">
                <label for="loan-amount">Сумма кредита:</label>
                <input type="number" id="loan-amount" required>

                <label for="interest-rate">Процентная ставка:</label>
                <input type="number" id="interest-rate" required>

                <label for="loan-term">Срок кредита (в месяцах):</label>
                <input type="number" id="loan-term" required>

                <div>
                    <strong>Ежемесячный платеж:</strong> <span id="monthly-payment"></span>
                </div>

                <div>
                    <strong>Общая сумма к оплате:</strong> <span id="total-payment"></span>
                </div>

                <div>
                    <strong>Общий процент по кредиту:</strong> <span id="total-interest"></span>
                </div>
            </form>
        `;
    }

    setupEventListeners() {
        const form = this.shadowRoot.getElementById('calculator-form');
        form.addEventListener('input', () => this.calculateLoan());
    }
    calculateLoan() {
        const loanAmount = parseFloat(this.shadowRoot.getElementById('loan-amount').value);
        const interestRate = parseFloat(this.shadowRoot.getElementById('interest-rate').value);
        const loanTerm = parseFloat(this.shadowRoot.getElementById('loan-term').value);
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;
        const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - loanAmount;
        this.shadowRoot.getElementById('monthly-payment').textContent = monthlyPayment.toFixed(2);
        this.shadowRoot.getElementById('total-payment').textContent = totalPayment.toFixed(2);
        this.shadowRoot.getElementById('total-interest').textContent = totalInterest.toFixed(2);
    }
}
customElements.define('financial-calculator', FinancialCalculator);