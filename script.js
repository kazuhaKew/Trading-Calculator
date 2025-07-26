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
});
