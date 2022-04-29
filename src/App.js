import logo from './logo.png';
import './App.css';
// import log from './log.png';
import { useEffect, useMemo, useState } from 'react/cjs/react.production.min';
import { useDrag } from 'react-use-gesture';
// import { instance } from './api/backend';
import Select from 'react-select'
import styles from './Sel.module.css';
import { useRef } from 'react';
import { instance } from './api/backend';

const App = () => {
  const [location, setLocation] = useState([])
  const [dragWidget, setDragWidget] = useState({x: 0, y: 0});

  const setWidgetCoords = useDrag((params) => {
    setDragWidget({
      x: params.offset[0],
      y: params.offset[1],
    });
  });

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

//   console.log('start -', location[5]);
//   console.log('end -', location[6]);
//   // https://www.google.com/maps/dir/43.6493958,-79.351307/41.99133,-84.6440607/@42.871383,-85.7242728,7z/data=!4m2!4m1!3e0?hl=en



  useEffect(() => {
    const splitLocation = document.location.pathname.split('/');
    setLocation(splitLocation)
  }, [])


  const [distance, setDistance] = useState([])
  const [duration, setDUration] = useState([])

  // const getCoords = async () => {
  //   if (location[3]) {
  //     const response = await instance2(location[3], location[4]).get('/api/coords');
  //     console.log('-----------------', response.data.rows[0].elements[0].distance.text);
  //     console.log('-----------------', response.data.rows[0].elements[0].duration.text);

  //     setDistance(response.data.rows[0].elements[0].distance.text)
  //     setDUration(response.data.rows[0].elements[0].duration.text)
  //   }

  // }

  // useEffect(() => {
  //   getCoords()
  // }, [location])

  // const [time, setTime] = useState('')
  // const [direcion, setDirection] = useState('')

  const [gasPrice, setGasPrice] = useState(0)
  const [mileage, setMileage] = useState(0)
  const [makeList, setMakeList] = useState([])
  const [modList, setModList] = useState([])
  const [yearList, setYearList] = useState([])
  // console.log('makeList --- ', makeList);

  const getGasPrice = async () => {
    if (location[3]) {
      const response = await instance(2022, 'BMW', 'M8 Competition Coupe', 'Toronto', location[3], location[4]).get('/api/gas_consumption')
      console.log('getGasPrice response - ', response.data);
      setGasPrice(response.data.gas_price)
      setMileage(response.data.mileage)

      // console.log('-------------', response.data.coords[0]);

      setDistance(response.data.coords[0])
      setDUration(response.data.coords[1])

      setMakeList(response.data.make_list[0])
      setModList(response.data.make_list[1])
      setYearList(response.data.make_list[2])
    }
  }

  // const [item, setItem] = useState('')

  // const SELECT_VALUE_KEY = "MySelectValue";

  // const handleChange = (selectedOption) => {
  //   localStorage.setItem(SELECT_VALUE_KEY, JSON.stringify(selectedOption));
  //   console.log('selectedOption', selectedOption.value);
  //   setItem(selectedOption.value);
  // }

  useEffect(() => {
    // const lastSelected = JSON.parse(
    //   localStorage.getItem(SELECT_VALUE_KEY) ?? ""
    // );
    // setItem(lastSelected);
    getGasPrice()
  }, [location])

  // const [selected, setSelected] = useState([]);
  // const handleChange1 = (s) => {
  //   localStorage.setItem(SELECT_VALUE_KEY, JSON.stringify(s));
  //   setSelected(s);
  // };

  // useEffect(() => {
  //   const lastSelected = JSON.parse(
  //     localStorage.getItem(SELECT_VALUE_KEY) ?? "[]"
  //   );
  //   setSelected(lastSelected);
  // }, []);

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
              <Select options={modList} defaultOptions isClearable/>
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
        </div>

        <span>The price of gasoline: <br/>
          <b>{distance} $</b>
        </span>
        {' '}
        <span>Distance: {distance}</span>
        {' '}
        <span>Duration: {duration}</span>
        {coords}
      </header>
    </div>
  );
}

export default App;
