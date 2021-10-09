import './App.css';
import ShareSheet from './sheet/ShareSheet';
import BITables from './bi/BITables';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const routes = [
  {
    path: "/",
    exact: true,
    sidebar: () => <div></div>,
    main: () => <h2>home</h2>
  },
  {
    path: "/sheet",
    sidebar: () => <div></div>,
    main: () => <div><ShareSheet/></div>
  },
  {
    path: "/tables",
    sidebar: () => <div></div>,
    main: () => <div><BITables/></div>
  }
];


function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div
          style={{
            padding: "10px",
            width: "10%",
            height: "100%",
            background: "#f0f0f0"
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sheet">Sheet</Link>
            </li>
            <li>
              <Link to="/tables">tables</Link>
            </li>
          </ul>

          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.sidebar />}
              />
            ))}
          </Switch>
        </div>

        <div style={{ flex: 1, padding: "10px" }}>
          <Switch>
            {routes.map((route, index) => (
              // Render more <Route>s with the same paths as
              // above, but different components this time.
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main />}
              />
            ))}
          </Switch>
        </div>
      </div>
    </Router>

    // <div className="App">
    //   <SheetTools/>
    //   <header className="App-header">

    //     <Sheet/>
    //   </header>
    // </div>

  );
}

export default App;
