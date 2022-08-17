import React from "react";
import { Helmet } from "react-helmet";

function App() {
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Next Front-End Technical Test</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
      ...
    </div>
  );
}

export default App;
