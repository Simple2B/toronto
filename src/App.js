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
  const [location, setLocation] = useState([])
  const [dragWidget, setDragWidget] = useState({x: 0, y: 0});
  const [gasPriceforTrip, setGasPriceForTrip] = useState([])
  const [tripDuration, setTripDuration] = useState([])
  const [gasPrice, setGasPrice] = useState(0)
  // const [mileage, setMileage] = useState(0)
  const [modelList, setModelList] = useState([])
  const [makeList, setMakeList] = useState([])
  const [yearList, setYearList] = useState([])

  const getGasPrice = async () => {
    if (location[3]) {
      const response = await instance(2022, 'BMW', 'M8 Competition Coupe', 'Toronto', location[3], location[4]).get('/api/gas_consumption')
      console.log('Response data - ', response.data);

      setGasPrice(response.data.gas_price)
      // setMileage(response.data.mileage)

      setGasPriceForTrip(response.data.coords[0])
      setTripDuration(response.data.coords[1])

      setModelList(response.data.vehicle_data_list[1])
      setMakeList(response.data.vehicle_data_list[0])
      setYearList(response.data.vehicle_data_list[2])
    }
  }

  useEffect(() => {
    const splitLocation = document.location.pathname.split('/');
    setLocation(splitLocation)
  }, [])

  useEffect(() => {
    getGasPrice()
  }, [location])

  const coords = useMemo(
    () =>
      location.length > 0 && (
        <>
          <div>Start: {location[3]}</div>
          <div>End: {location[4]}</div>
        </>
      ),
    [location],
  );

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
          <label>
            <h2 className="title">Model</h2>

            <div className={styles.reactselector}>
              <Select options={modelList} defaultOptions isClearable/>
            </div>
          </label>

          <label>
            <h2 className="title">Make</h2>

            <div className={styles.reactselector}>
              <Select options={makeList} defaultOptions isClearable/>
            </div>
          </label>

          <label>
            <h2 className="title">Year</h2>

            <div className={styles.reactselector}>
              <Select options={yearList} defaultOptions isClearable/>
            </div>
          </label>

          <label>
            <h2 className="title">Type of gasoline</h2>

            <div className={styles.reactselector}>
              <Select options={typeGas} defaultOptions isClearable/>
            </div>
          </label>
        </div>

        <span>The price of gas: {gasPrice}</span>
        {' '}
        <span>Gas price for a trip: <br/>
          <b>{gasPriceforTrip} $</b>
        </span>
        {' '}
        <span>Distance: {0}</span>
        {' '}
        <span>Trip duration: {tripDuration}</span>
        {coords}
      </header>
    </div>
  );
}

export default App;
