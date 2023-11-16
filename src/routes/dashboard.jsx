import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TradingViewAdvancedChart from '../components/dashboard/tradingview-advanced-chart';

// Get Firebase config settings from environment file
const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID } = import.meta.env;

// Firebase configuration object
const firebaseConfig = {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_FIREBASE_PROJECT_ID,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function Dashboard() {
    const [stockTickerInput, setStockTickerInput] = useState('');
    const [stockTicker, setStockTicker] = useState('APPL');
    const [stockPrice, setStockPrice] = useState(187);

    const [accountBalance, setAccountBalance] = useState(0);
    const [accountPortfolio, setAccountPortfolio] = useState({});

    const [depositModalActive, setDepositModalActive] = useState(false);
    const [purchaseModalActive, setPurchaseModalActive] = useState(false);
    const [sellModalActive, setSellModalActive] = useState(false);

    const navigate = useNavigate();

    const getAccount = async () => {
        const uid = localStorage.getItem('uid');
        const docRef = doc(db, 'accounts', uid);
        const docSnap = await getDoc(docRef);
        const account = docSnap.data();
        if (account.balance) {
            setAccountBalance(account.balance);
        }

        const portfolioRef = doc(db, 'portfolios', uid);
        const portfolioSnap = await getDoc(portfolioRef);
        const portfolio = portfolioSnap.data();
        if (portfolio) {
            setAccountPortfolio(portfolio);
        }

    }



    useEffect(() => {
        getAccount();
    }, []);



    const handleStockInputChange = (event) => {
        setStockTickerInput(event.target.value);
    }
    const searchStock = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/search_stock/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock_ticker: stockTickerInput })
            }).then(response => response.json()).then(data => { console.log(data)});

            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }

            // const data = await response.json();
            // console.log(data);
            // setStockTicker(data.stock_ticker);
            // setStockPrice(data.stock_price);


        } catch (error) {
            console.log('Error during fetch:', error);
        }

    }



    const openDepositModal = () => {
        setDepositModalActive(true);
        console.log("Deposit Modal Opened");
    }

    const depositCash = async (event) => {
        event.preventDefault();

        const depositAmount = event.target.depositAmount.value;
        console.log(depositAmount);

        const uid = localStorage.getItem('uid');

        let newBalance;


        try {
            const accountRef = doc(db, 'accounts', uid);
            const docSnap = await getDoc(accountRef);
            if (docSnap.exists()) {
                const account = docSnap.data();
                const currentBalance = account.balance ? account.balance : 0;
                newBalance = currentBalance + parseFloat(depositAmount);
                await updateDoc(accountRef, {
                    balance: newBalance
                });
            } else {
                console.log("No such document!");
            }

        } catch (error) {
            console.log('Error during fetch:', error);
        }
        setDepositModalActive(false);
        setAccountBalance(newBalance);
    }

    const purchaseStock = async (event) => {
        event.preventDefault();

        const shareAmount = parseInt(event.target.shareCount.value);
        const purchaseAmount = shareAmount * stockPrice;

        const uid = localStorage.getItem('uid');

        let newBalance;

        try {
            const accountRef = doc(db, 'accounts', uid);
            const portfolioRef = doc(db, 'portfolios', uid);

            const accountSnap = await getDoc(accountRef);
            const portfolioSnap = await getDoc(portfolioRef);
            let currentStockShares;
            if (portfolioSnap.exists()) {
                currentStockShares = portfolioSnap.data()[stockTicker] ? parseInt(portfolioSnap.data()[stockTicker]) : 0
            }
            console.log(typeof currentStockShares)

            if (accountSnap.data().balance && (accountSnap.data().balance >= purchaseAmount)) {

                const account = accountSnap.data();

                const currentBalance = account.balance;
                newBalance = currentBalance - purchaseAmount;



                await updateDoc(accountRef, {
                    balance: newBalance
                });
                if (currentStockShares) {
                    const newShareAmount = currentStockShares + shareAmount;
                    await updateDoc(portfolioRef, {
                        [stockTicker]: newShareAmount
                    })
                } else {
                    await setDoc(portfolioRef, {
                        [stockTicker]: shareAmount
                    })
                }

                const portfolio = accountPortfolio;
                portfolio[stockTicker] = currentStockShares + shareAmount;

                setAccountPortfolio(portfolio);
                console.log(portfolio);


            } else {
                console.log("Not enough funds");
            }

        } catch (error) {
            console.log('Error during fetch:', error);
        }
        setPurchaseModalActive(false);
        setAccountBalance(newBalance);
    }

    const sellStock = async (event) => {
        event.preventDefault();

        const shareAmount = parseInt(event.target.sellShareCount.value);
        const sellAmount = shareAmount * stockPrice;

        const uid = localStorage.getItem('uid');

        let newBalance;

        try {
            const accountRef = doc(db, 'accounts', uid);
            const portfolioRef = doc(db, 'portfolios', uid);

            const accountSnap = await getDoc(accountRef);
            const portfolioSnap = await getDoc(portfolioRef);
            let currentStockShares;
            if (portfolioSnap.exists()) {
                currentStockShares = portfolioSnap.data()[stockTicker] ? parseInt(portfolioSnap.data()[stockTicker]) : 0
            }

            if (portfolioSnap.data()[stockTicker] && (parseInt(portfolioSnap.data()[stockTicker]) >= shareAmount)) {

                const account = accountSnap.data();

                const currentBalance = parseInt(account.balance);
                newBalance = currentBalance + sellAmount;



                await updateDoc(accountRef, {
                    balance: newBalance
                });
                if (portfolioSnap.exists()) {
                    
                    const newShareAmount = currentStockShares - shareAmount
                    await updateDoc(portfolioRef, {
                        [stockTicker]: newShareAmount
                    })
                    const portfolio = accountPortfolio;
                    portfolio[stockTicker] = currentStockShares - shareAmount;
                    setAccountPortfolio(portfolio);
                } else {
                    console.log("You do not own any of this stock");
                }

            } else {
                console.log("Not enough funds");
            }

        } catch (error) {
            console.log('Error during fetch:', error);
        }
        setSellModalActive(false);
        setAccountBalance(newBalance);
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
        
        navigate('/login');
    };

    return (
        <div>
            <div className="dashboardContainer p-5">
                <header className="header text-center mb-5 bg-[#007bff] text-white py-2.5 rounded-md shadow-md">
                    <h1 className="title text-4xl font-bold m-0">Stock Dashboard</h1>
                </header>

                <button onClick={logout} className="p-2 bg-red-500 text-white rounded">Logout</button>


                <main className="mainContent flex gap-5">
                    {/* <section className="w-3/5"> */}
                    <section className="chartSection flex-1 p-5 bg-[#333] rounded-lg shadow-md h-[90vh] overflow-y-auto">
                        <TradingViewAdvancedChart />
                    </section>

                    <aside className="sidebar flex-1 flex flex-col gap-5">
                        <div className="p-4 border border-[#444] rounded-lg bg-[#333] shadow-md">
                            <form onSubmit={searchStock}>
                                <input
                                    type="text"
                                    placeholder="Search Bar"
                                    name="searchBar"
                                    className="w-full py-2.5 border border-[#555] rounded-md outline-none transition duration-300 ease-in-out bg-[#444] text-white focus:border-[#ff9800]"
                                    value={stockTickerInput}
                                    onChange={handleStockInputChange}
                                />
                                <button type="submit" className="w-full py-2.5 px-4 border-none rounded-md bg-[#ff9800] text-white cursor-pointer transition duration-300 ease-in-out hover:bg-[#ff7700]">Search</button>
                            </form>
                            <div className="flex justify-center">

                                { stockTicker && stockPrice && (
                                    <div className="mt-5 bg-[#444] p-2.5 rounded-md">
                                        <div >
                                            <h3 className="text-lg">Current Stock Price</h3>
                                            <p>{ stockTicker } : { stockPrice }</p>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full p-2 bg-blue-500 text-white"
                                                onClick={() => setPurchaseModalActive(true)}
                                            >
                                                Purchase Stock
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full p-2 bg-blue-500 text-white"
                                                onClick={() => setSellModalActive(true)}
                                            >
                                                Sell Stock
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div>

                                </div>
                            </div>
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
                                <p>Balance: ${accountBalance}</p>
                            </div>
                            { accountPortfolio && Object.entries(accountPortfolio).map(([ticker, shares]) => (
                                <div className="flex justify-center" key={ticker}>
                                    <p>{ticker}: {shares} shares</p>
                                </div>
                            ))}
                            <div className="flex justify-center">
                                <button onClick={openDepositModal}>Desposit</button>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>

            <div>
                { depositModalActive && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-lg shadow-lg z-50">
                            <div className="flex justify-between items-center mb-4">
                                <h2>Deposit Cash</h2>
                                <button onClick={() => setDepositModalActive(false)} >Close</button>
                            </div>

                            <form onSubmit={depositCash}>
                                <label htmlFor="depositAmount">Deposit Amount: $</label>
                                <input type="number" name="depositAmount" />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div>
                { purchaseModalActive && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-lg shadow-lg z-50">
                            <div className="flex justify-between items-center mb-4">
                                <h2>Purchase Stock</h2>
                                <button onClick={() => setPurchaseModalActive(false)} >Close</button>
                            </div>

                            <form onSubmit={purchaseStock}>
                                <label htmlFor="shareCount">Share Count: </label>
                                <input type="number" name="shareCount" />
                                <button type="submit">Buy</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div>
                { sellModalActive && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-lg shadow-lg z-50">
                            <div className="flex justify-between items-center mb-4">
                                <h2>Sell Stock</h2>
                                <button onClick={() => setSellModalActive(false)} >Close</button>
                            </div>

                            <form onSubmit={sellStock}>
                                <label htmlFor="sellShareCount">Share Count: </label>
                                <input type="number" name="sellShareCount" />
                                <button type="submit">Sell</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
