import React, { useState, useEffect } from 'react';
import TradingViewAdvancedChart from '../components/dashboard/tradingview-advanced-chart';
import '../tailwind.css';

function Dashboard() {


    return (
        <div>
        <h1 class="text-3xl font-bold underline">Stock Dashboard</h1>
        
            <div>
                <h2>Portfolio</h2>
                <button>Desposit</button>
            </div>

            <div class="flex">
                <div class="w-3/5">
                    <TradingViewAdvancedChart />
                </div>
                
                <div class="w-1/5 border-2">
                    <div class="flex justify-center h-5/10 bg-sky-500">
                        <div class="h-8">
                            <h2 class="text-xl">Funds</h2>
                        </div>
                    
                    </div>
                    <div class="flex justify-center">
                        <h3 class="text-lg">Portfolio</h3>
                    </div>

                    <div>
                    </div>
                </div>

                <div class="w-1/5 border-2">
                    <input type="text" name="Search Bar" />
                    <div class="flex justify-center">
                        <h3 class="text-lg">Portfolio</h3>
                    </div>


                </div>

            </div>
        
        
        
            
        </div>
    );
}

export default Dashboard;
