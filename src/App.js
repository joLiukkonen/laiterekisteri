import React from 'react';
import './App.css';
import { Route, BrowserRouter, NavLink, Switch } from 'react-router-dom';
import Home from './Home.js';
import News_Others from './News_Others';
import Devices from './Devices';

import Footer from './Footer';
import Navigation from './Navigation';
import DevManagement from './DevManagement';
import Offices from './Offices';
import 'react-dates/initialize';
import ListOffices from './ListOffices';
import Reservation from './Reservation';
import SearchHistory from './SearchHistory';
import Events from './Events';


function App() {
  //App root
  return (
    <BrowserRouter>        
      <div className="navigation">  
        <Navigation/>
      </div>   

      <div className="App">  
           
      <Switch>          
          <Route exact path ="/" component={Home}/>  
          <Route exact path ="/laitteet" component={Devices}/>  
          <Route exact path ="/varaushistoria" component={SearchHistory}/>
          <Route exact path ="/tapahtumahistoria" component={Events}/>
          <Route exact path ="/toimipisteet" component={Offices}/>  
          <Route exact path ="/laitehallinta" component={DevManagement}/>
          <Route exact path ="/yhteystiedot" component={ListOffices}/>
          <Route exact path ="/varaus" component={Reservation}/>
        </Switch>
      </div>   
      
      <div className="sidebarR">
        <News_Others/>
      </div>
      
      <div className="footer">
        <Footer/>
      </div>

    </BrowserRouter>
    
  );
}

export default App;
