import React, { useState, useEffect } from 'react';
import TradingViewAdvancedChart from '../components/dashboard/tradingview-advanced-chart';

function Dashboard() {
    const [stockTickerInput, setStockTickerInput] = useState('');
    const [stockTicker, setStockTicker] = useState('');
    const [stockPrice, setStockPrice] = useState(0);

    
    const handleStockInputChange = (event) => {
        setStockTickerInput(event.target.value);
    }
    const searchStock = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/search_stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock_ticker: stockTickerInput })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setStockTicker(data.stock_ticker);
            setStockPrice(data.stock_price);


        } catch (error) {
            console.log('Error during fetch:', error);
        }
        
    }

    

    return (
        <div>
        <h1 className="text-3xl font-bold underline">Stock Dashboard</h1>
        
            <div>
                <h2>Portfolio</h2>
                
            </div>

            <div className="flex min-h-screen">
                <div className="w-3/5">
                    <TradingViewAdvancedChart />
                </div>
                
                <div className="w-1/5 border-2">
                    <div className="flex justify-center h-5/10 bg-sky-500">
                        <div className="h-8">
                            <h2 className="text-xl">Funds</h2>
                        </div>
                    
                    </div>
                    <div className="flex justify-center">
                        <h3 className="text-lg">Portfolio</h3>
                    </div>

                    <div className="flex justify-center">
                        <button>Desposit</button>
                    </div>
                </div>

                <div className="w-1/5 border-2">
                    <form onSubmit={searchStock}>
                        <input 
                            type="text" 
                            placeholder="Search Bar" 
                            name="searchBar" 
                            className="w-full p-2" 
                            value={stockTickerInput}
                            onChange={handleStockInputChange}
                        />
                        <button type="submit" className="w-full p-2 bg-blue-500 text-white">Search</button>
                    </form>
                    <div className="flex justify-center">
                        
                        {stockTicker && stockPrice && (
                            <div>
                                <h3 className="text-lg">Current Stock Price</h3>
                                <p>{stockTicker} : {stockPrice}</p>
                            </div>
                        )}
                        <div>
                            
                        </div>
                    </div>


                </div>

            </div>
        
        
        
            
        </div>
    );
}

export default Dashboard;
