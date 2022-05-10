import * as React from 'react';
import './App.css';
import './Button.scss';
import { useEffect, useState } from 'react/cjs/react.production.min';
import { useDrag } from 'react-use-gesture';
import Select from 'react-select'
import styles from './Sel.module.css';
import { instance } from './api/backend';
import { instanceModel } from './api/apiModel';
import { instanceMake } from './api/apiMake';
import { instanceYear } from './api/apiYear';
import OutsideClickHandler from 'react-outside-click-handler';

const typeGas = [
  {value: 'Regular_Gas.xlsx', label: 'Regular'},
  {value: 'Mid-Grade_Gas.xlsx', label: 'Mid-Grade'},
  {value: 'Premium_Gas.xlsx', label: 'Premium'},
  {value: 'Diesel.xlsx', label: 'Diesel'},
]

const App = () => {
  const [dragWidget, setDragWidget] = useState({x: 0, y: 0});
  const [gasPrice, setGasPrice] = useState(0);

  const [makeListFromServer, setMakeListFromServer] = useState([]);
  const [modelListFromServer, setModelListFromServer] = useState([]);
  const [yearListFromServer, setYearListFromServer] = useState([]);

  const [distance, setDistance] = useState('0');
  const [carbonConsumption, setCarbonConsumption] = useState(0);

  const [carModel, setCarModel] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carYear, setCarYear] = useState(0);
  const [gasType, setGasType] = useState('');

  const [selectorsData, setSelectorsData] = useState(['', '', 0, '']);

  const [city, setCity] = useState('');

  const [click, setClick] = useState()

  const handleClick = (e) => {
    setClick(e)
  }

  const getGasPrice = async () => {
      const response = await instance(
        selectorsData[0],
        selectorsData[1],
        selectorsData[2],
        city,
        distance,
        selectorsData[3]
      ).get('/api/gas_consumption');

      setGasPrice(response.data.gas_price);
      setCarbonConsumption(response.data.c02_kg);
  }

  const getMake = async () => {
    const response = await instanceMake().get('/api/make')
    setMakeListFromServer(response.data.filterer_make_list);
  }

  const getModel = async () => {
    const response = await instanceModel(carMake).get('/api/model')
    setModelListFromServer(response.data.filterer_model_list)
  }

  useEffect(() => {
    getModel()
  }, [carMake])

  const getYear = async () => {
    const response = await instanceYear(carModel).get('/api/year')
    setYearListFromServer(response.data.vehicle_year_list)
  }

  useEffect(() => {
    getYear()
  }, [carModel])

  useEffect(() => {
    getMake()
  }, [])

  const getValueFromSite = () => {
    // get distance from DOM
    const elementSection = document.getElementById(`section-directions-trip-0`);

    if (elementSection !== null) {
      const divBlock = elementSection.getElementsByTagName('div')[1];
      const divBlock2 = divBlock.getElementsByTagName('div')[0];
      const divBlock3 = divBlock2.getElementsByTagName('div')[1];
      const divBlock4 = divBlock3.getElementsByTagName('div')[0];

          // get text from tag element
      const value = divBlock4.textContent;
      setDistance(value)
    }

    const startCityElement = document.querySelector('html > body > div > div > div > div > div > div > div > div > div > div > div > div > input');

    if (startCityElement !== null && startCityElement !== undefined) {
      const textFromAttribute = startCityElement.getAttribute('aria-label')
      console.log('city -', textFromAttribute);

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
           [textFromAttribute.includes('UK'), 'UK'],
           [textFromAttribute.includes('United Kingdom'), 'United Kingdom'],
       ]);

         function getStatusByMap() {
             return statusMap.get(true) || 'Average';
         }

         setCity(getStatusByMap());
       }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setSelectorsData([carModel, carMake, carYear, gasType])
  }

  useEffect(() => {
    getModel()
    handleClick()
    getValueFromSite()
  }, [click])

  useEffect(() => {
    getGasPrice()
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
    <OutsideClickHandler
    onOutsideClick={() => {
      handleClick('1')
    }}
  >
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
              <Select onChange={getSelectedMakeValue} options={makeListFromServer} isClearable/>
            </div>
          </label>

          <label>
              <h2 className="title">Model</h2>

              <div className={styles.reactselector}>
                <Select onChange={getSelectedModelValue} options={modelListFromServer} defaultOptions isClearable />
              </div>

            </label>

          <label>
            <h2 className="title">Year</h2>

            <div className={styles.reactselector}>
              <Select onChange={getSelectedYearValue} options={yearListFromServer} defaultOptions isClearable/>
            </div>
          </label>

          <label>
            <h2 className="title">Type of Gasoline</h2>

            <div className={styles.reactselector}>
              <Select onChange={getSelectedGasTypeValue} options={typeGas} defaultOptions isClearable/>
            </div>
          </label>

          <button className="submit-button" type="submit">Save</button>
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
  </OutsideClickHandler>

  );
}

export default App;
