import * as React from 'react';
import './App.css';
import './Button.scss';
import { useEffect, useState } from 'react/cjs/react.production.min';
import { useDrag } from 'react-use-gesture';
import { useLocalStorage } from './hookLocalStorage';

import Select from 'react-select'
import styles from './Sel.module.css';

import { instance } from './api/backend';
import { instanceModel } from './api/apiModel';
import { instanceMake } from './api/apiMake';
import { instanceYear } from './api/apiYear';

const typeGas = [
  {value: 'Regular', label: 'Regular'},
  {value: 'Mid-Grade', label: 'Mid-Grade'},
  {value: 'Premium', label: 'Premium'},
  {value: 'Diesel', label: 'Diesel'},
  {value: 'UK', label: 'UK'},
]

const App = () => {
  const [dragWidget, setDragWidget] = useState({x: 0, y: 0});

  const [gasPrice, setGasPrice] = useLocalStorage('Gas_price', 0);
  const [carbonConsumption, setCarbonConsumption] = useLocalStorage('CO2', 0);

  const [makeListFromServer, setMakeListFromServer] = useState([]);
  const [modelListFromServer, setModelListFromServer] = useState([]);
  const [yearListFromServer, setYearListFromServer] = useState([]);

  const [distance, setDistance] = useLocalStorage('Distance', '0');
  const [city, setCity] = useLocalStorage('City', '');

  const [carMake, setCarMake] = useLocalStorage("Make", '');
  const [carModel, setCarModel] = useLocalStorage("Model", '');
  const [carYear, setCarYear] = useLocalStorage("Model_year", 0);
  const [gasType, setGasType] = useLocalStorage("Type_of_Gasoline", '');
  const [selectorsData, setSelectorsData] = useState([carMake, carModel, carYear, gasType]);

  const getGasPrice = async () => {
      const response = await instance(
        selectorsData[0],
        selectorsData[1],
        selectorsData[2],
        selectorsData[3],
        distance,
        city
      ).get('/api/gas_consumption');

      if (response.data.error === 'wrong_car_options') {
        alert('Wrong vehicle options selected. Please enter the options indicated in the dropdown menu.')
      }

      if (response.data.error === 'wrong_gas_type') {
        alert('Wrong Type of Gasoline selected for the current city/country.')
      }

      if (response.status === 200) {
        setGasPrice(response.data.gas_price);
        setCarbonConsumption(response.data.c02_kg);
      } else {
        alert('Something went wrong... Please, refresh the page!');
      }
  }

  const getMake = async () => {
    const response = await instanceMake().get('/api/make');
    setMakeListFromServer(response.data.filterer_make_list);
  }

  useEffect(() => {
    getMake();
  }, [])

  const getModel = async () => {
    const response = await instanceModel(carMake).get('/api/model')
    setModelListFromServer(response.data.filterer_model_list)
  }

  useEffect(() => {
    getModel();
  }, [carMake])

  const getYear = async () => {
    const response = await instanceYear(carModel, carMake).get('/api/year')
    setYearListFromServer(response.data.vehicle_year_list)
  }

  useEffect(() => {
    getYear();
  }, [carModel])

  const getValueFromSite = () => {
    // Get distance value from DOM elements
    // Get block elements with all distance routes (main and alternative)

    const firstRout = document.querySelector("#section-directions-trip-0");
    const secondRout = document.querySelector("#section-directions-trip-1");
    const thirdRout = document.querySelector("#section-directions-trip-2");

    if (firstRout !== null && firstRout !== undefined) {
      if (firstRout.className.includes('selected') === true) {
        const routValue = document.querySelector("#section-directions-trip-0 > div.MespJc > div:nth-child(1) > div.XdKEzd > div.ivN21e.tUEI8e.fontBodyMedium > div").textContent;
        setDistance(routValue);
      }
    }
    if (secondRout !== null && secondRout !== undefined) {
      if (secondRout.className.includes('selected') === true) {
        const routValue = document.querySelector("#section-directions-trip-1 > div.MespJc > div:nth-child(1) > div.XdKEzd > div.ivN21e.tUEI8e.fontBodyMedium > div").textContent;
        setDistance(routValue);
      }
    }
    if (thirdRout !== null && thirdRout !== undefined) {
      if (thirdRout.className.includes('selected') === true) {
        const routValue = document.querySelector("#section-directions-trip-2 > div.MespJc > div:nth-child(1) > div.XdKEzd > div.ivN21e.tUEI8e.fontBodyMedium > div").textContent;
        setDistance(routValue);
      }
    }

    // Get city name from DOM input
    const country = document.querySelector("#fqBGh > div > div > button:nth-child(11)");
    console.log('country', country);

    if (country !== null && country !== undefined) {
      const countryText = country.textContent;

      if (countryText.includes('United Kingdom') === true) {
        console.log('countryText', countryText);
        setCity(countryText)
        getCity('Canada')
      }

      if (countryText.includes('Canada') === true) {
        console.log('countryText', countryText);
        getCity('InCanada')
      }
    }
  }

  const getCity = (mark) => {
    const startCityElement = document.querySelector('html > body > div > div > div > div > div > div > div > div > div > div > div > div > input');
    console.log('startCityElement --- ', startCityElement);

    if (startCityElement !== null && startCityElement !== undefined) {
      const textFromAttribute = startCityElement.getAttribute('aria-label')
      console.log('textFromAttribute --- ', textFromAttribute);

      if (textFromAttribute.includes(mark) === true || mark === 'no') {
      // instead switch case or if else
        if (textFromAttribute !== null) {
          const statusMap = new Map([
            [textFromAttribute.includes('Toronto'), 'Toronto'],
            [textFromAttribute.includes('Barrie'), 'Barrie'],
            [textFromAttribute.includes('Guelph'), 'Guelph'],
            [textFromAttribute.includes('Hamilton'), 'Hamilton'],
            [textFromAttribute.includes('Kitchener'), 'Kitchener'],
            [textFromAttribute.includes('Oshawa'), 'Oshawa'],
            [textFromAttribute.includes('Peterborough'), 'Peterborough'],
            [textFromAttribute.includes('Brantford'), 'Brantford'],
            [textFromAttribute.includes('United Kingdom'), 'United Kingdom'],
            [textFromAttribute.includes('UK'), 'UK'],
        ]);

          function getStatusByMap() {
              return statusMap.get(true) || 'Average';
          }
          console.log(' ----setCity --- ', getStatusByMap());
          setCity(getStatusByMap());
        }
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getValueFromSite();

    setSelectorsData([carMake, carModel, carYear, gasType])
  }

  useEffect(() => {
    getGasPrice();
  }, [distance, selectorsData[0], selectorsData[1], selectorsData[2], selectorsData[3]])

  const getSelectedMakeValue = (option) => {
    if (option === null || option === undefined) {
      setCarMake('');
    } else {
      setCarMake(option.value);
    }
  };

  const getSelectedModelValue = (option) => {
    if (option === null || option === undefined) {
      setCarModel('');
    } else {
      setCarModel(option.value);
    }
  };

  const getSelectedYearValue = (option) => {
    if (option === null || option === undefined) {
      setCarYear('');
    } else {
      setCarYear(option.value);
    }
  };

  const getSelectedGasTypeValue = (option) => {
    if (option === null || option === undefined) {
      setGasType('');
    } else {
      setGasType(option.value);
    }
  };

  const setWidgetCoords = useDrag((params) => {
    setDragWidget({
      x: params.offset[0],
      y: params.offset[1],
    });
  });

  return (
    <div
      className="App"
      {...setWidgetCoords()}
      style={{
        position: 'relative',
        top: dragWidget.y,
        left: dragWidget.x,
      }}
    >
      <header className="App-header">
        <div
          className="selectors"
        >
          <form className="selector-form" onSubmit={handleSubmit}>
          <label>
            <h2 className="title">Make</h2>

            <div className={styles.reactselector}>
              <Select
                onChange={getSelectedMakeValue}
                options={makeListFromServer}
                defaultValue={{ value: carMake, label: carMake }}
                isClearable
              />
            </div>
          </label>

          <label>
              <h2 className="title">Model</h2>

              <div className={styles.reactselector}>
                <Select
                  onChange={getSelectedModelValue}
                  options={modelListFromServer}
                  defaultValue={{ value: carModel, label: carModel }}
                  isClearable
                  />
              </div>

            </label>

          <label>
            <h2 className="title">Year</h2>

            <div className={styles.reactselector}>
              <Select
                onChange={getSelectedYearValue}
                options={yearListFromServer}
                defaultValue={{ value: carYear, label: carYear }}
                isClearable
              />
            </div>
          </label>

          <label>
            <h2 className="title">Type of Gasoline</h2>

            <div className={styles.reactselector}>
              <Select
                onChange={getSelectedGasTypeValue}
                options={typeGas}
                defaultValue={{ value: gasType, label: gasType }}
                isClearable
              />
            </div>
          </label>

          <button className="submit-button" type="submit">Calculate</button>
          </form>
        </div>
        <span className="result-title result-title-margin">Gas Price for a Trip: <br/>
          <span className="display-result">{gasPrice} &#36;</span>
        </span>
        <span className="result-title">CO2 Produced: <br/>
          <span className="display-result">{carbonConsumption} kg</span>
        </span>
      </header>
    </div>
  );
}

export default App;
