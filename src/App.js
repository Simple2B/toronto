import * as React from 'react';
import './App.css';
import { useEffect, useMemo, useState } from 'react/cjs/react.production.min';
import { useDrag } from 'react-use-gesture';
import Select from 'react-select'
import styles from './Sel.module.css';
import { instance } from './api/backend';

const typeGas = [
  {value: 'Regular_Gas.xlsx', label: 'Regular'},
  {value: 'Mid-Grade_Gas.xlsx', label: 'Mid-grade'},
  {value: 'Premium_Gas.xlsx', label: 'Premium'},
  {value: 'Diesel.xlsx', label: 'Diesel'},
]

const App = () => {
  const [dragWidget, setDragWidget] = useState({x: 0, y: 0});
  const [gasPrice, setGasPrice] = useState(0)

  const [modelListFromServer, setModelListFromServer] = useState([])
  const [makeListFromServer, setMakeListFromServer] = useState([])
  const [yearListFromServer, setYearListFromServer] = useState([])

  const [distance, setDistance] = useState('');

  const [location, setLocation] = useState([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const [carModel, setCarModel] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carYear, setCarYear] = useState(0);
  const [gasType, setGasType] = useState('');

  const [selectorsData, setSelectorsData] = useState(['', '', 0, ''])

  const getGasPrice = async () => {
    if (location[3]) {
      const response = await instance(
        selectorsData[0],
        selectorsData[1],
        selectorsData[2],
        'Toronto',
        distance,
        selectorsData[3]
      ).get('/api/gas_consumption')

      console.log('Response data - ', response.data);

      setGasPrice(response.data.gas_price)

      setModelListFromServer(response.data.vehicle_data_list[0])
      setMakeListFromServer(response.data.vehicle_data_list[1])
      setYearListFromServer(response.data.vehicle_data_list[2])
    }
  }

  useEffect(() => {
    const splitLocation = document.location.pathname.split('/');
    setLocation(splitLocation)
    setStart(splitLocation[3])
    setEnd(splitLocation[4])
  }, [])

  const getValueFromSite = () => {
    // get distance from DOM
    const elementSection = document.getElementById('section-directions-trip-0');
    const divBlock = elementSection.getElementsByTagName('div')[1];
    const divBlock2 = divBlock.getElementsByTagName('div')[0];
    const divBlock3 = divBlock2.getElementsByTagName('div')[1];
    const divBlock4 = divBlock3.getElementsByTagName('div')[0];

    // Barrie
    // Brantford
    // Guelph
    // Hamilton
    // Kitchener
    // Oshawa
    // Peterborough
    // Toronto

    // get City name from DOM
    const startCityElement = document.getElementById('sb_ifc50');
    // если вводить в ручную в инпут название локи то нет ошибки
    // а если карта сама будет, то при строении ДОМа, инпут будет пустой
    // и поэтому startCityElement будет ровно null
    if (startCityElement) {
      const inputElement = startCityElement.getElementsByTagName('input')
      const textFromAttribute = inputElement[0].getAttribute('aria-label')
      console.log('Start city - ', textFromAttribute);
    }

    // // get City name from DOM
    const EndCityElement = document.getElementById('sb_ifc51');
    if (EndCityElement) {
      const inputElement = EndCityElement.getElementsByTagName('input')
      const textFromAttribute = inputElement[0].getAttribute('aria-label')
      console.log('End city - ', textFromAttribute);
    }

    // get text from tag element
    const value = divBlock4.textContent;

    setDistance(value)
  }

  const getSelectedModelValue = (option) => {
    if (option === null || option === undefined) {
      return;
    } else {
      setCarModel(option.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSelectorsData([carModel, carMake, carYear, gasType])
    console.log('array - ', [carModel, carMake, carYear, gasType]);
  }

  useEffect(() => {
    getGasPrice()
    getValueFromSite()
  }, [start, end, selectorsData[0]])

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
              <h2 className="title">Model</h2>

              <div className={styles.reactselector}>
                <Select onChange={getSelectedModelValue} options={modelListFromServer} defaultOptions isClearable />
              </div>

            </label>

          <label>
            <h2 className="title">Make</h2>

            <div className={styles.reactselector}>
              <Select onChange={getSelectedMakeValue} options={makeListFromServer} defaultOptions isClearable/>
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
          <button type="submit">Save</button>
          </form>
        </div>

        <span>Distance: {distance}</span>
        {' '}
        <span>Gas price for a trip: <br/>
          <b>{gasPrice} $</b>
        </span>
      </header>
    </div>
  );
}

export default App;
