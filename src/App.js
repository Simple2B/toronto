import logo from './logo.png';
import './App.css';
// import log from './log.png';
import { useEffect, useMemo, useState } from 'react/cjs/react.production.min';




const App = () => {
  const [location, setLocation] = useState([])

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

  useEffect(() => {
    const splitLocation = window.location.pathname.split('/');
    setLocation(splitLocation)

  }, [location])

  return (
    <div className="App">
      <header className="App-header">
        <div className="selectors">
          <label>
            <h2 className="title">Model</h2>
            <select className="selector">
              <option className="option" value="Niro">Niro</option>
              <option value="MDX FWD">MDX FWD</option>
              <option value="John Cooper Works Hardtop 2 door">John Cooper Works Hardtop 2 door</option>
              <option value="K5">K5</option>
            </select>
          </label>

          <label>
            <h2 className="title">Make</h2>
            <select className="selector">
              <option value="Kia">Kia</option>
              <option value="Acura">Acura</option>
              <option value="MINI">MINI</option>
              <option value="Volkswagen">Volkswagen</option>
            </select>
          </label>

          <label>
            <h2 className="title">Year</h2>
            <select className="selector">
              <option selected value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
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
