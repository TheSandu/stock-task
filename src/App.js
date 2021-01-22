import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from './config.json'

import SearchHistoryList from './Components/SearchHistoryList'
import Notifications from './Components/Notifications'

function App( props ) {

  let [curentItem, setCurentItem] = useState('');
  let [price, setPrice] = useState('');
  let [notification, setNotification] = useState([]);
  let [fetchedData, setFetchedData] = useState([]);

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    let raw = localStorage.getItem("items");
    let visitedItems = JSON.parse(raw);
    setFetchedData( visitedItems );

    setInterval(async () => {

      let update = [];

      for (let item of visitedItems) {
        console.log(`Delay start:${item.name}`);
        await delay( 20000 );
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${item.name}&interval=5min&apikey=${config.apiKey}`)
        const json = await response.json();

        console.log( json );

        if( json["Time Series (5min)"] === undefined ) {
          continue;
        }

        let price = json["Time Series (5min)"][Object.keys(json["Time Series (5min)"])[0]]["1. open"];


        if( item && item.price !== price ) {
          update.push({ name: item.name, price: price });
          setNotification(update);
        }
      }
      
    }, 300000);
  }, []);

  useEffect(() => {
    localStorage.setItem( "items", JSON.stringify(fetchedData) );
  }, [fetchedData]);

  const clearNotifications = () => {
    setNotification([]);
  }
  
  const serchItem = async ( event ) => {
    if( event.key !== "Enter" )
      return;

    let itemFromHistory = fetchedData.find(( history ) => history.name === curentItem);

    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${curentItem}&interval=5min&apikey=${config.apiKey}`)
    const json = await response.json()

    if( json["Time Series (5min)"] === undefined ) {
      setPrice( "Not Found" );
      return;
    }

    let price = json["Time Series (5min)"][Object.keys(json["Time Series (5min)"])[0]]["1. open"];

    if(  price === undefined ) {
      setPrice( "Not Found" );
      return;
    }
    setPrice( price );

    if( itemFromHistory && itemFromHistory.price !== price ) {
      itemFromHistory.price = price;
      fetchedData = fetchedData.map(x => ( x.price === price ) ? itemFromHistory : x);
      setFetchedData(fetchedData);
      return;
    }

    setFetchedData([...fetchedData, { name: curentItem, price: price } ]);
  };
  
  return (
      <div className="container">
        <div className="row p-5">

          <div className="col-md-8">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Prices</span>

            </h4>
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">{curentItem || "Item Name"}</h6>
                </div>
                <span className="text-muted">{price}</span>
              </li>
            </ul>

            <div className="input-group">
              <input
                type="text" 
                className="form-control" 
                placeholder="Promo code"
                onChange={ event => setCurentItem( event.target.value )}
                onKeyPress={ serchItem }
              />
            </div>

          </div>
          <div className="col-md-4">
            
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Recent Visited</span>
              <span className="badge bg-secondary rounded-pill"></span>
            </h4>

            <SearchHistoryList historyList={fetchedData} ></SearchHistoryList>
          </div>
        </div>
        <div>

          {/* 5 API calls per minute, delay 20 sec for checking each item, f***ing api restrictions */}
          <Notifications notifications={ notification } ></Notifications>
          <button className="btn btn-secondary" onClick={clearNotifications} > Clear Notifications </button>
        </div>
      </div>
  );
}

export default App;