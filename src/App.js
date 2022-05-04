import * as React from 'react';
import './App.css';
import './Button.scss';
import { useEffect, useState } from 'react/cjs/react.production.min';
import { useDrag } from 'react-use-gesture';
import Select from 'react-select'
import styles from './Sel.module.css';
import { instance } from './api/backend';
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

  const [modelListFromServer, setModelListFromServer] = useState([]);
  const [makeListFromServer, setMakeListFromServer] = useState([]);
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

      console.log('Response data - ', response.data);

      setGasPrice(response.data.gas_price);

      setModelListFromServer(response.data.vehicle_data_list[0]);
      setMakeListFromServer(response.data.vehicle_data_list[1]);
      setYearListFromServer(response.data.vehicle_data_list[2]);

      setCarbonConsumption(response.data.c02_kg);
  }

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

    // get City name from DOM
    const startCityElement = document.getElementById('sb_ifc50');

    if (startCityElement !== null) {
      const inputElement = startCityElement.getElementsByTagName('input')
      const textFromAttribute = inputElement[0].getAttribute('aria-label')
      console.log('textFromAttribute --- ', textFromAttribute);

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
    handleClick()
    getValueFromSite()
  }, [click])

  useEffect(() => {
    getGasPrice()
  }, [distance, selectorsData[0], selectorsData[1], selectorsData[2], selectorsData[3]])

  const getSelectedModelValue = (option) => {
    if (option === null || option === undefined) {
      return;
    } else {
      setCarModel(option.value);
    }
  };

  const getSelectedMakeValue = (option) => {
    if (option === null || option === undefined) {
      return;
    } else {
      setCarMake(option.value);
    }
  };
  const getSelectedYearValue = (option) => {
    if (option === null || option === undefined) {
      return;
    } else {
      setCarYear(option.value);
    }
  };
  const getSelectedGasTypeValue = (option) => {
    if (option === null || option === undefined) {
      return;
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
          <form onSubmit={handleSubmit}>
          <label>
            <h2 className="title">Make</h2>

            <div className={styles.reactselector}>
              <Select onChange={getSelectedMakeValue} options={makeListFromServer} defaultOptions isClearable/>
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
            <h2 className="title">Type of gasoline</h2>

            <div className={styles.reactselector}>
              <Select onChange={getSelectedGasTypeValue} options={typeGas} defaultOptions isClearable/>
            </div>
          </label>

          <button className="submit-button" type="submit">Save</button>
          </form>
        </div>

        <span>Distance: {distance}</span>
        {' '}
        <span>Gas Price for a Trip: <br/>
          <b>{gasPrice} &#36;</b>
        </span>
        <span>CO2 produced: {carbonConsumption} <b>kg</b><br/>
        </span>
      </header>
    </div>
  </OutsideClickHandler>

  );
}

export default App;
