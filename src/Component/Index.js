import React from "react";  
import Router from "react-router";  
import routes from "../Shared/Routes";

Router.run(routes, Router.HistoryLocation, (Handler, state) => {  
	React.render(<Handler />, document.getElementById('app'));
});