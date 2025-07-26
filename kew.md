Размер лота: (0.01 > 0.1$), (0.1 > 1$) , (1 > 10$)


```js
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
```