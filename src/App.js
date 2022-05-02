import * as React from 'react';
import './App.css';
import { useEffect, useMemo, useState } from 'react/cjs/react.production.min';
import { useDrag } from 'react-use-gesture';
import Select from 'react-select'
import styles from './Sel.module.css';
import { instance } from './api/backend';

const typeGas = [
  {value: 'Regular', label: 'Regular'},
  {value: 'Mid-grade', label: 'Mid-grade'},
  {value: 'Premium', label: 'Premium'},
  {value: 'Diesel', label: 'Diesel'},
]

const App = () => {
  const [dragWidget, setDragWidget] = useState({x: 0, y: 0});
  const [gasPriceforTrip, setGasPriceForTrip] = useState([])
  const [tripDuration, setTripDuration] = useState([])
  const [gasPrice, setGasPrice] = useState(0)
  const [modelList, setModelList] = useState([])
  const [makeList, setMakeList] = useState([])
  const [yearList, setYearList] = useState([])
  const [distance, setDistance] = useState('');

  const [location, setLocation] = useState([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const [carModel, setCarModel] = useState('');
  console.log('carModel ------ ', carModel);

  const [carMake, setCarMake] = useState('');
  // console.log('carMake ------ ', carMake);

  const [carYear, setCarYear] = useState(0);
  // console.log('carYear ------ ', carYear);

  const [gasType, setGasType] = useState('');
  // console.log('gasType ------ ', gasType);

  const [array, setArray] = useState(['', '', 0])
  console.log('array ------------- ', array);

  const getGasPrice = async () => {
    if (location[3]) {
      const response = await instance(array[0], array[1], array[2], 'Toronto', distance).get('/api/gas_consumption')
      console.log('Response data - ', response.data);

      setGasPrice(response.data.gas_price)

      setModelList(response.data.vehicle_data_list[0])
      setMakeList(response.data.vehicle_data_list[1])
      setYearList(response.data.vehicle_data_list[2])
    }
  }


  useEffect(() => {
    const splitLocation = document.location.pathname.split('/');
    setLocation(splitLocation)
    setStart(splitLocation[3])
    setEnd(splitLocation[4])
  }, [])

  // const locat = useLocation();


  const getValueFromSite = () => {
    const elementSection = document.getElementById('section-directions-trip-0');
    const cityElement = document.getElementById('sb_ifc50');
    console.log('cityElement - ', cityElement);

    const divBlock = elementSection.getElementsByTagName('div')[1];
    const divBlock2 = divBlock.getElementsByTagName('div')[0];
    const divBlock3 = divBlock2.getElementsByTagName('div')[1];
    const divBlock4 = divBlock3.getElementsByTagName('div')[0];

    const value = divBlock4.textContent;

    setDistance(value)
  }

  // const [test, setTest] = useState()
  // console.log('test', test)

  const getSelectedModelValue = (option) => {
    if (option === null || option === undefined) {
      return;
    } else {
      setCarModel(option.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setArray([carModel, carMake, carYear, gasType])
  }

  useEffect(() => {
    getGasPrice()
    getValueFromSite()
  }, [start, end, array[0]])

  // const coords = useMemo(
  //   () =>
  //     location.length > 0 && (
  //       <>
  //         <div>Start: {location[3]}</div>
  //         <div>End: {location[4]}</div>
  //       </>
  //     ),
  //   [location],
  // );




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
                <Select onChange={getSelectedModelValue} options={modelList} defaultOptions isClearable />
              </div>

            </label>

          <label>
            <h2 className="title">Make</h2>

            <div className={styles.reactselector}>
              <Select onChange={getSelectedMakeValue} options={makeList} defaultOptions isClearable/>
            </div>
          </label>

          <label>
            <h2 className="title">Year</h2>

            <div className={styles.reactselector}>
              <Select onChange={getSelectedYearValue} options={yearList} defaultOptions isClearable/>
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
