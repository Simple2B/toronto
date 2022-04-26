import logo from './logo.png';
import './App.css';
// import log from './log.png';
import { useEffect, useMemo, useState } from 'react/cjs/react.production.min';
import { useDrag } from 'react-use-gesture';

const carModelFromServer = ['Niro', 'MDX FWD', 'John Cooper Works Hardtop 2 door', 'K5'];
const carMakeFromServer = ['Kia', 'Acura', 'MINI', 'Volkswagen'];
const carYearFromServer = ['2022', '2021', '2020', '2019'];

const App = () => {
  const [dragWidget, setDragWidget] = useState({x: 0, y: 0});

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
            <select className="selector">
              {carModelFromServer.map((model, i) => (
                <option key={i} value={model}>
                {model}
              </option>
              ))}
            </select>
          </label>

          <label>
            <h2 className="title">Make</h2>
            <select className="selector">
              {carMakeFromServer.map((make, i) => (
                <option key={i} value={make}>
                {make}
              </option>
              ))}
            </select>
          </label>

          <label>
            <h2 className="title">Year</h2>
            <select className="selector">
              {carYearFromServer.map((year, i) => (
                <option key={i} value={year}>
                {year}
              </option>
              ))}
            </select>
          </label>
        </div>

        <span>The price of gasoline: <br/>
          <b>{50}$</b>
        </span>
      </header>
    </div>
  );
}

export default App;
