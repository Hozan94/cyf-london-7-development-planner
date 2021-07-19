import { Route, Switch } from "react-router-dom";

import About from "./pages/About";
import Home from "./pages/Home";
//here I made some comment
//This is also Hozan comment
const App = () => (
	<Switch>
		<Route path="/" exact>
			<Home />
		</Route>
		<Route path="/about/this/site">
			<About />
		</Route>
	</Switch>
);

export default App;
