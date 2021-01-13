import React, {Component} from 'react';
import { Route, BrowserRouter, NavLink, Switch } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import InfoIcon from '@material-ui/icons/Info';

class Navigation extends Component {
    //ylhäällä oleva navigointi palkki 
    render(){
        return(
            <div className="navigation">
                <div className="header">
                <h3>Devices Inc.</h3>
                </div> 

                <p><NavLink to="/" className="navlink">Etusivu <HomeIcon /></NavLink></p>

                <p><NavLink to="#" className="navlink">Asiakkaille <PersonIcon />
                    <div class="dropdown">
                        <div class="dropdown-content">                            
                            <a><NavLink to="/laitteet">Laitehaku</NavLink></a>
                            <a><NavLink to="/varaus">Tee varaus</NavLink></a>
                        </div>
                    </div></NavLink></p>

                <p><NavLink to="#" className="navlink">Henkilöstölle <PersonOutlineIcon />
                    <div class="dropdown">
                        <div class="dropdown-content">
                            <a><NavLink to="/laitehallinta">Laitehallinta</NavLink></a>
                            <a><NavLink to="/varaushistoria">Varaushistoria</NavLink></a>
                            <a><NavLink to="/tapahtumahistoria">Huolto- ja tapahtumahistoria</NavLink></a>
                            <a><NavLink to="/toimipisteet">Toimipisteet</NavLink></a>
                        </div>
                    </div></NavLink></p>

                <p><NavLink to="#" className="navlink" style={{ float: 'right' }}>Info <InfoIcon />
                    <div class="dropdown-info">
                        <div class="dropdown-content-info">
                            <a><NavLink to="/yhteystiedot">Yhteystiedot</NavLink></a>                            
                    </div>
                </div></NavLink></p>  

            </div>
        )
    }
}

export default Navigation;