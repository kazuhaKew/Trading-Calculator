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
    // Set up the ratio buttons
    const ratioButtons = document.querySelectorAll('.ratio-btn');
    ratioButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('riskRewardRatio').value = this.dataset.value;
        });
    });
    
    // Calculate profitability
    document.getElementById('calculateProfitability').addEventListener('click', function() {
        const initialBalance = parseFloat(document.getElementById('initialBalance').value);
        const numberOfTrades = parseInt(document.getElementById('numberOfTrades').value);
        const riskPerTrade = parseFloat(document.getElementById('riskPerTrade').value) / 100;
        const riskRewardRatio = parseFloat(document.getElementById('riskRewardRatio').value);
        const winRate = parseFloat(document.getElementById('winRate').value) / 100;
        
        // Validation
        if (isNaN(initialBalance) || isNaN(numberOfTrades) || isNaN(riskPerTrade) || 
            isNaN(riskRewardRatio) || isNaN(winRate)) {
            document.getElementById('profitabilityResult').textContent = 
                'Пожалуйста, заполните все поля корректными числами';
            return;
        }
        
        if (numberOfTrades < 1 || numberOfTrades > 100) {
            document.getElementById('profitabilityResult').textContent = 
                'Количество сделок должно быть от 1 до 100';
            return;
        }
        
        if (winRate < 0 || winRate > 1) {
            document.getElementById('profitabilityResult').textContent = 
                'Процент выигрыша должен быть от 0 до 100';
            return;
        }
        
        // Calculate expected profit/loss
        let finalBalance = initialBalance;
        for (let i = 0; i < numberOfTrades; i++) {
            const tradeRiskAmount = finalBalance * riskPerTrade;
            const tradeRewardAmount = tradeRiskAmount * riskRewardRatio;
            
            // Determine if the trade is a win or loss based on win rate
            if (Math.random() < winRate) {
                // Win
                finalBalance += tradeRewardAmount;
            } else {
                // Loss
                finalBalance -= tradeRiskAmount;
            }
            
            // If account is wiped out, stop calculations
            if (finalBalance <= 0) {
                finalBalance = 0;
                break;
            }
        }
        
        const profit = finalBalance - initialBalance;
        const profitPercentage = (profit / initialBalance) * 100;
        
        let resultText;
        if (profit >= 0) {
            resultText = `Ожидаемая прибыль: $${profit.toFixed(2)} (${profitPercentage.toFixed(2)}%)`;
        } else {
            resultText = `Ожидаемый убыток: $${Math.abs(profit).toFixed(2)} (${Math.abs(profitPercentage).toFixed(2)}%)`;
        }
        
        document.getElementById('profitabilityResult').textContent = resultText;
    });
});
