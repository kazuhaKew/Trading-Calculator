document.addEventListener('DOMContentLoaded', function() {    
    // Profit/Loss Calculator
    document.getElementById('calculatePL').addEventListener('click', function() {
        const positionSize = parseFloat(document.getElementById('positionSize').value);
        const entryPrice = parseFloat(document.getElementById('entryPricePL').value);
        const exitPrice = parseFloat(document.getElementById('exitPrice').value);
        const isBuyPosition = document.getElementById('buyPosition').checked;
        
        if (isNaN(positionSize) || isNaN(entryPrice) || isNaN(exitPrice)) {
            document.getElementById('profitLossResult').textContent = 'Please fill in all fields with valid numbers';
            return;
        }
        
        let profitLoss;
        if (isBuyPosition) {
            // Buy (Long) position: profit when exit price > entry price
            profitLoss = (exitPrice - entryPrice) * positionSize;
        } else {
            // Sell (Short) position: profit when entry price > exit price
            profitLoss = (entryPrice - exitPrice) * positionSize;
        }
        
        const profitLossPercentage = (Math.abs(profitLoss) / (entryPrice * positionSize)) * 100;
        
        const resultText = profitLoss >= 0 ? 
            `Profit: $${Math.abs(profitLoss).toFixed(2)} (${profitLossPercentage.toFixed(2)}%)` : 
            `Loss: $${Math.abs(profitLoss).toFixed(2)} (${profitLossPercentage.toFixed(2)}%)`;
        
        document.getElementById('profitLossResult').textContent = resultText;
    });
    
    // Trading Profitability Calculator
    // Set up quick select buttons
    document.querySelectorAll('.balance-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('initialBalance').value = this.dataset.value;
        });
    });
    
    document.querySelectorAll('.lot-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('lotSize').value = this.dataset.value;
        });
    });
    
    document.querySelectorAll('.ratio-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('riskRewardRatio').value = this.dataset.value;
        });
    });
    
    // Calculate profitability
    document.getElementById('calculateProfitability').addEventListener('click', function() {
        const initialBalance = parseFloat(document.getElementById('initialBalance').value);
        const lotSize = parseFloat(document.getElementById('lotSize').value);
        const numberOfTrades = parseInt(document.getElementById('numberOfTrades').value);
        const riskPerTrade = parseFloat(document.getElementById('riskPerTrade').value);
        const riskRewardRatio = parseFloat(document.getElementById('riskRewardRatio').value);
        const winPercentage = parseFloat(document.getElementById('winPercentage').value);
        
        if (isNaN(initialBalance) || isNaN(lotSize) || isNaN(numberOfTrades) || 
            isNaN(riskPerTrade) || isNaN(riskRewardRatio) || isNaN(winPercentage)) {
            document.getElementById('profitabilityResult').innerHTML = '<p>Пожалуйста, заполните все поля корректными значениями</p>';
            return;
        }
        
        if (numberOfTrades < 1 || numberOfTrades > 100) {
            document.getElementById('profitabilityResult').innerHTML = '<p>Количество сделок должно быть от 1 до 100</p>';
            return;
        }
        
        if (winPercentage < 0 || winPercentage > 100) {
            document.getElementById('profitabilityResult').innerHTML = '<p>Процент выигрыша должен быть от 0 до 100</p>';
            return;
        }
        
        // Calculate expected value per trade
        const winRate = winPercentage / 100;
        const lossRate = 1 - winRate;
        const riskAmount = initialBalance * (riskPerTrade / 100);
        const rewardAmount = riskAmount * riskRewardRatio;
        
        const expectedValue = (winRate * rewardAmount) - (lossRate * riskAmount);
        const expectedValuePercentage = (expectedValue / initialBalance) * 100;
        
        // Calculate total profit/loss after all trades
        let totalProfit = 0;
        let currentBalance = initialBalance;
        let finalBalance = initialBalance;
        let winTrades = Math.round(numberOfTrades * winRate);
        let lossTrades = numberOfTrades - winTrades;
        
        // Simulate trades in sequence
        for (let i = 0; i < numberOfTrades; i++) {
            const isWinTrade = i < winTrades;
            const tradeRiskAmount = currentBalance * (riskPerTrade / 100);
            
            if (isWinTrade) {
                const tradeRewardAmount = tradeRiskAmount * riskRewardRatio;
                currentBalance += tradeRewardAmount;
                totalProfit += tradeRewardAmount;
            } else {
                currentBalance -= tradeRiskAmount;
                totalProfit -= tradeRiskAmount;
            }
        }
        
        finalBalance = initialBalance + totalProfit;
        const totalProfitPercentage = (totalProfit / initialBalance) * 100;
        
        // Create a detailed result message
        let resultHTML = '';
        
        if (expectedValuePercentage >= 0) {
            resultHTML += `<p>Ожидаемая доходность на сделку: +${expectedValuePercentage.toFixed(2)}%</p>`;
        } else {
            resultHTML += `<p>Ожидаемая доходность на сделку: ${expectedValuePercentage.toFixed(2)}%</p>`;
        }
        
        if (totalProfit >= 0) {
            resultHTML += `<p>Итоговая прибыль после ${numberOfTrades} сделок: $${totalProfit.toFixed(2)} (${totalProfitPercentage.toFixed(2)}%)</p>`;
            resultHTML += `<p>Конечный баланс: $${finalBalance.toFixed(2)}</p>`;
        } else {
            resultHTML += `<p>Итоговый убыток после ${numberOfTrades} сделок: $${Math.abs(totalProfit).toFixed(2)} (${Math.abs(totalProfitPercentage).toFixed(2)}%)</p>`;
            resultHTML += `<p>Конечный баланс: $${finalBalance.toFixed(2)}</p>`;
        }
        
        document.getElementById('profitabilityResult').innerHTML = resultHTML;
    });
});
