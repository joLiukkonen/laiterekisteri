import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AddDevice from './AddDevice.js'
import EditDevice from './EditDevice';
import DeleteDevice from './DeleteDevice';
import AddType from './AddType';
import React, {Component} from 'react';
import { Route, BrowserRouter, NavLink, Switch } from 'react-router-dom';

class DevManagement extends Component {
    //laitehallinnan navigointi komponentti
    constructor(props) {
        super(props);             
    }   
    

    render(){  
                
        return (
            <BrowserRouter>                
                <div className="laitehaku">
                    <h2>Laitehallinta</h2>
                    <div className="laitehallinta">
                        <NavLink to="/laitehallinta/lisaalaite" className="laitehallinta-btn"><button className="laitehallinta">Lisää laitteita &nbsp;&nbsp;<p className="p-laite-lisaa"><AddCircleIcon /></p></button></NavLink>&nbsp;&nbsp;
                    <NavLink to="/laitehallinta/lisaatyyppi" className="laitehallinta-btn"><button className="laitehallinta">Lisää laitetyyppi &nbsp;&nbsp;<p className="p-laite-tyyppi"><PlaylistAddIcon /></p></button></NavLink>&nbsp;&nbsp;
                    <NavLink to="/laitehallinta/laitemuokkaus" className="laitehallinta-btn"><button className="laitehallinta">Muokkaa laitetietoja &nbsp;&nbsp;<p className="p-laite-muokkaa"><EditIcon /></p></button></NavLink>&nbsp;&nbsp;
                    
                    
                    </div>

                </div><br></br>
                <div>
                    <Switch>
                        <Route exact path="/laitehallinta/lisaalaite" component={AddDevice} />
                        <Route exact path="/laitehallinta/laitemuokkaus" component={EditDevice} />
                        
                        <Route exact path="/laitehallinta/lisaatyyppi" component={AddType} />
                    </Switch>
                </div>


            </BrowserRouter>
            
        )
    }
}

export default DevManagement;