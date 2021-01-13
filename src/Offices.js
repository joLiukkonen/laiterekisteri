import React, { Component } from 'react';
import { Route, BrowserRouter, NavLink, Switch } from 'react-router-dom';
import AddOffice from './AddOffice';
import ListOffices from './ListOffices';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import ListIcon from '@material-ui/icons/List';

class Offices extends Component {
    //toimipiste navigointi komponentti
    constructor(props) {
        super(props);
    }


    render() {

        return (
            <BrowserRouter>
                <div className="laitehaku">
                    <h2>Toimipisteet</h2>
                    <div className="laitehallinta">
                        <NavLink to="/toimipisteet/kaikki" className="toimipiste-btn"><button className="toimipiste">Kaikki toimipisteet &nbsp;&nbsp;<p className="p-toim-listaa"><ListIcon/></p></button></NavLink>&nbsp;&nbsp;
                        <NavLink to="/toimipisteet/lisaa" className="toimipiste-btn"><button className="toimipiste">Lisää toimipisteitä &nbsp;&nbsp;<p className="p-toim-lisaa"><AddLocationIcon /></p></button></NavLink>&nbsp;&nbsp;
                    
                    </div>

                </div><br></br>
                <div>
                    <Switch>
                        <Route exact path="/toimipisteet/kaikki" component={ListOffices} />
                        <Route exact path="/toimipisteet/lisaa" component={AddOffice} />
                        
                    </Switch>
                </div>


            </BrowserRouter>

        )
    }
}

export default Offices;