        const manualAmountInput = document.getElementById('manualAmount');
        const amountSlider = document.getElementById('amountSlider');
        const selectedAmountDiv = document.getElementById('selectedAmount');
        const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
        amountSlider.addEventListener('input', function() {
            const amount = this.value;
            manualAmountInput.value = amount;
            selectedAmountDiv.textContent = `${amount} usd`;
            updateQuickAmountButtons(parseInt(amount));
        });
        manualAmountInput.addEventListener('input', function() {
            let amount = parseInt(this.value);
            if (isNaN(amount) || amount < 5) { amount = 5; this.value = 5; }
            if (amount > 500) { amount = 500; this.value = 500; }
            amountSlider.value = amount;
            selectedAmountDiv.textContent = `${amount} usd`;
            updateQuickAmountButtons(amount);
        });
        quickAmountBtns.forEach(button => {
            button.addEventListener('click', function() {
                const amount = parseInt(this.getAttribute('data-amount'));
                manualAmountInput.value = amount;
                amountSlider.value = amount;
                selectedAmountDiv.textContent = `${amount} usd`;
                updateQuickAmountButtons(amount);
            });
        });
        function updateQuickAmountButtons(selectedAmount) {
            quickAmountBtns.forEach(button => {
                const amount = parseInt(button.getAttribute('data-amount'));
                if (amount === selectedAmount) {
                    button.classList.add('selected');
                } else {
                    button.classList.remove('selected');
                }
            });
        }
        updateQuickAmountButtons(parseInt(manualAmountInput.value));

        function showNotification(message, isInfo = false) {
            const notification = document.getElementById('copyNotification');
            notification.textContent = message;
            notification.style.backgroundColor = isInfo ? '#3498db' : '#4CAF50';
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        function toggleTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme');
            const themeIcon = document.querySelector('.theme-toggle i');
            const themeBtn = document.querySelector('.theme-toggle');
            themeBtn.classList.add('animated');
            void themeBtn.offsetHeight;
            setTimeout(() => themeBtn.classList.remove('animated'), 600);
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
        document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            const themeIcon = document.querySelector('.theme-toggle i');
            if (savedTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
