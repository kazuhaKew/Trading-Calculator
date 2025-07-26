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
    
    // Set up the balance preset buttons
    const balanceButtons = document.querySelectorAll('.balance-btn');
    balanceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('initialBalance').value = this.dataset.value;
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
        
        // Run simulation with detailed tracking
        let finalBalance = initialBalance;
        let winCount = 0;
        let tradeLog = [];
        
        for (let i = 0; i < numberOfTrades; i++) {
            const tradeRiskAmount = finalBalance * riskPerTrade;
            const tradeRewardAmount = tradeRiskAmount * riskRewardRatio;
            
            // Use specific seed based on current time and trade number to ensure variation
            const randomValue = Math.random();
            const isWin = randomValue < winRate;
            
            let tradeResult;
            if (isWin) {
                // Win
                finalBalance += tradeRewardAmount;
                winCount++;
                tradeResult = {
                    tradeNumber: i + 1,
                    result: 'Win',
                    amount: `+$${tradeRewardAmount.toFixed(2)}`,
                    balanceAfter: finalBalance.toFixed(2)
                };
            } else {
                // Loss
                finalBalance -= tradeRiskAmount;
                tradeResult = {
                    tradeNumber: i + 1,
                    result: 'Loss',
                    amount: `-$${tradeRiskAmount.toFixed(2)}`,
                    balanceAfter: finalBalance.toFixed(2)
                };
            }
            
            tradeLog.push(tradeResult);
            
            // If account is wiped out, stop calculations
            if (finalBalance <= 0) {
                finalBalance = 0;
                break;
            }
        }
        
        const profit = finalBalance - initialBalance;
        const profitPercentage = (profit / initialBalance) * 100;
        const actualWinRate = (winCount / tradeLog.length) * 100;
        
        // Build the result HTML
        let resultHTML = '<div class="trade-summary">';
        
        if (profit >= 0) {
            resultHTML += `<h3>Ожидаемая прибыль: $${profit.toFixed(2)} (${profitPercentage.toFixed(2)}%)</h3>`;
        } else {
            resultHTML += `<h3>Ожидаемый убыток: $${Math.abs(profit).toFixed(2)} (${Math.abs(profitPercentage).toFixed(2)}%)</h3>`;
        }
        
        resultHTML += `<p>Начальный баланс: $${initialBalance.toFixed(2)}</p>`;
        resultHTML += `<p>Конечный баланс: $${finalBalance.toFixed(2)}</p>`;
        resultHTML += `<p>Фактический % выигрышей: ${actualWinRate.toFixed(1)}% (${winCount} из ${tradeLog.length})</p>`;
        
        // Add a sample of trades (to keep it manageable)
        const maxTradesShown = Math.min(10, tradeLog.length);
        resultHTML += `<details>
            <summary>Показать детали сделок (${maxTradesShown} из ${tradeLog.length})</summary>
            <div class="trade-details">`;
        
        for (let i = 0; i < maxTradesShown; i++) {
            const trade = tradeLog[i];
            const colorClass = trade.result === 'Win' ? 'win-trade' : 'loss-trade';
            resultHTML += `<div class="trade-item ${colorClass}">
                #${trade.tradeNumber}: ${trade.result} ${trade.amount} → Баланс: $${trade.balanceAfter}
            </div>`;
        }
        
        resultHTML += '</div></details></div>';
        
        document.getElementById('profitabilityResult').innerHTML = resultHTML;
    });
});
