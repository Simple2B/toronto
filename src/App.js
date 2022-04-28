import logo from './logo.png';
import './App.css';
// import log from './log.png';
import { useEffect, useMemo, useState } from 'react/cjs/react.production.min';
import { useDrag } from 'react-use-gesture';
import { instance } from './api/backend';
import Select from 'react-select'
import styles from './Sel.module.css';

// const carModelFromServer = ['Niro', 'MDX FWD', 'John Cooper Works Hardtop 2 door', 'K5'];
// const carMakeFromServer = ['Kia', 'Acura', 'MINI', 'Volkswagen'];
// const carYearFromServer = ['2022', '2021', '2020', '2019'];

const carModelFromServer = [
  {value: 'Niro', label: 'Niro'},
  {value: 'MDX FWD', label: 'MDX FWD'},
  {value: 'John Cooper Works Hardtop 2 door', label: 'John Cooper Works Hardtop 2 door'},
  {value: 'K5', label: 'K5'},
  ];

const carMakeFromServer = [
  {value: 'Acura', label: 'Acura'},
  {value: 'Kia', label: 'Kia'},
  {value: 'MINI', label: 'MINI'},
  {value: 'K5', label: 'K5'},
]

const carYearFromServer = [
  {value: '2022', label: '2022'},
  {value: '2021', label: '2021'},
  {value: '2020', label: '2020'},
  {value: '2019', label: '2019'},
]

const App = () => {
  // const [location, setLocation] = useState([])
  const [dragWidget, setDragWidget] = useState({x: 0, y: 0});
  // const [querySearch, setSearchQuery] = useState('');
  // console.log('querySearch - ', querySearch);

  const setWidgetCoords = useDrag((params) => {
    setDragWidget({
      x: params.offset[0],
      y: params.offset[1],
    });
  });

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

  // useEffect(() => {
  //   const splitLocation = window.location.pathname.split('/');
  //   setLocation(splitLocation)

  // }, [location])

  const [count, setCount] = useState(0)

  const add = () => {
    setCount(e => e + 1);
  }

  // const [goods, setGoods] = useState([])
  // console.log('goods', goods);

  // const getGoods = async () => {
  //   const response = await instance().get('/goods');
  //   console.log(response.data);
  //   // 0: {id: 6, createdAt: '2020-06-24T09:43:05.574Z', updatedAt: '2020-06-24T09:43:05.574Z', name: 'Bread', color: 'blue'}
  //   const x = []
  //   response.data.map(e => (
  //     x.push({value: e.name, label: e.name})
  //   ))

  //   setGoods(x);
  // }

  // useEffect(() => {
  //   getGoods()
  // }, [])

  // const [time, setTime] = useState('')
  // const [direcion, setDirection] = useState('')

  const getGasPrice = async () => {
    const response = await instance(count).get(`/api/count/number`)
    console.log('response - ', response);
  }

  useEffect(() => {
    getGasPrice();
  }, [count])

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
              <Select options={carModelFromServer} defaultOptions isClearable/>
            </div>
          </label>

          <label>
            <h2 className="title">Make</h2>

            <div className={styles.reactselector}>
              <Select options={carMakeFromServer} defaultOptions isClearable/>
            </div>
          </label>

          <label>
            <h2 className="title">Year</h2>

            <div className={styles.reactselector}>
              <Select options={carYearFromServer} defaultOptions isClearable/>
            </div>
          </label>
        </div>

        <span>The price of gasoline: <br/>
          <b>{50}$</b>
        </span>
        <span>Count: {count}</span>
        <button type="button" onClick={() => add()}>+1</button>
      </header>
    </div>
  );
}

export default App;
