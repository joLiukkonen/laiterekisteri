import React, {Component} from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Devices extends Component {   
    //"Laitehaku"-komponentti
    constructor(props) {
        super(props);
        this.SearchDevices = this.SearchDevices.bind(this);
        this.onDevChange = this.onDevChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
        this.SearchTypes = this.SearchTypes.bind(this);
        this.SearchPost = this.SearchPost.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onPostChange = this.onPostChange.bind(this);

        this.state = {
            isLoading: false,
            haettu: false,
            laitteet: [],
            malli: "",
            merkki: "", 
            tyyppi: "",
            tyypit: [],
            posti: "",
            postit: []
        };
    }
    onModelChange(event) {
        this.setState({malli: event.target.value});
    }

    onDevChange(event){
        this.setState({merkki: event.target.value});
    }
    onTypeChange(event){
        this.setState({tyyppi: event.target.value});
    }
    onPostChange(event) {//postinro
        this.setState({ posti: event.target.value });
    }

    componentDidMount(){
        this.SearchTypes();
        this.SearchPost();
    }

    SearchPost() {// postinumeroiden haku sivun latauksen yhteydessä
        fetch("http://localhost:4000/laitteet/postit")
            .then(results => results.json())
            .then(json => { this.setState({ postit: json }) })
            .catch(function (error) {
                confirmAlert({
                    title: 'Virhe',
                    message: 'Postinumeroita haettaessa tapahtui virhe. ' + error,
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })
    }

    SearchTypes(){
        fetch("http://localhost:4000/laitteet/tyypit")
            .then(results => results.json())
            .then(json => {this.setState({tyypit: json})})
            .catch(function(error){
                confirmAlert({
                    title: 'Virhe',
                    message: 'Laitetyyppejä haettaessa tapahtui virhe. ' + error,
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })
    }

    SearchDevices(){
        
        var merkki = this.state.merkki;
        var malli = this.state.malli;
        var tyyppi = this.state.tyyppi;    
        var posti_split = this.state.posti.split(',');
        posti_split = posti_split[0]; 
        var postinum = posti_split;   

        this.setState({ isLoading: true });
        if(malli == "" && merkki == "" && tyyppi == "" && postinum == ""){
            setTimeout(function () {
                fetch("http://localhost:4000/laitteet/haku")
                    .then(results => results.json())
                    .then(json => {this.setState({laitteet: json, isLoading: false, haettu: true})})
                    .catch(function(error) {
                        confirmAlert({
                            title: 'Virhe',
                            message: 'Laitteita haettaessa tapahtui virhe. ' + error,
                            buttons: [
                                {
                                    label: 'Ok',
                                    onClick: () => 0
                                }
                            ]
                        });
                    })
            }.bind(this), 3000);            
        }
        else{
            setTimeout(function () {
                fetch("http://localhost:4000/laitteet/paramhaku?merkki="+merkki+"&malli="+malli+"&tyyppi="+tyyppi+"&posti="+postinum)
                    
                    .then(results => results.json())
                    .then(json => {this.setState({laitteet: json, isLoading: false, haettu: true})})
                    .catch(function(error) {
                        confirmAlert({
                            title: 'Virhe',
                            message: 'Laitteita haettaessa tapahtui virhe. ' + error,
                            buttons: [
                                {
                                    label: 'Ok',
                                    onClick: () => 0
                                }
                            ]
                        });
                    })
            }.bind(this), 3000);
                      
        }        
    }

    render(){
        var { isLoading, laitteet, haettu } = this.state;        

        if (isLoading) {
            return(
                <div className="laitehaku">
                    <h2>Laitehaku</h2>
                    <div className="div-laitehaku">
                        Merkki : <br /><input onChange={this.onDevChange} type="text" name="merkki" /><br />
                    Malli : <br /><input onChange={this.onModelChange} type="text" name="malli" /><br />

                    Laitetyyppi : <br /><select onChange={this.onTypeChange} type="text" name="tyyppi">
                            <option></option>
                            {this.state.tyypit.map(function (item, i) {
                                return (
                                    <option key={i}>{item.tyyppinimi}</option>
                                )
                        })}
                    </select><br/>  
                    Sijainti : <br /><select onChange={this.onPostChange} type="text">
                            <option></option>
                            {this.state.postit.map(function (p, i) {
                                return (
                                    <option key={i} >{p.postinro}, {p.toimipaikka}</option>
                                )
                            })}
                        </select><br></br>
                        <br /> 

                        <button onClick={this.SearchDevices} className="button-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon/></button>
                    
                </div>
                <p style={{ textAlign: 'center' }}>Haetaan laitteita...</p>
            </div>
            )
        }
        if (laitteet.length < 1 && haettu){
            return(
                <div className="laitehaku">
                    <h2>Laitehaku</h2>  
                    <div className="div-laitehaku">
                    Merkki : <br/><input onChange={this.onDevChange} type="text" name="merkki" /><br/>
                        Malli : <br/><input onChange={this.onModelChange} type="text" name="malli" /><br/>
                        
                        Laitetyyppi : <br/><select onChange={this.onTypeChange} type="text" name="tyyppi">
                            <option></option>
                            {this.state.tyypit.map(function (item, i){
                                return (
                                <option key={i}>{item.tyyppinimi}</option>
                                )
                            })}
                        </select><br/>   
                        Sijainti : <br /><select onChange={this.onPostChange} type="text">
                            <option></option>
                            {this.state.postit.map(function (p, i) {
                                return (
                                    <option key={i} >{p.postinro}, {p.toimipaikka}</option>
                                )
                            })}
                        </select><br></br>
                        <br />
    
                        <button onClick={this.SearchDevices} className="button-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon /></button>
                        
                        
                    </div>
                    <p style={{ textAlign: 'center' }}>Annetuilla hakuehdoilla ei löytynyt laitteita</p>
                </div>
                )
        }        
        return(
           
            <div className="laitehaku">
                <h2>Laitehaku</h2>                                  
                <div className="div-laitehaku">
                    Merkki : <br/><input onChange={this.onDevChange} type="text" name="merkki" /><br/>
                    Malli : <br/><input onChange={this.onModelChange} type="text" name="malli" /><br/>
                    
                    Laitetyyppi : <br/><select onChange={this.onTypeChange} type="text" name="tyyppi">
                        <option></option>
                        {this.state.tyypit.map(function (item, i){
                            return (
                            <option key={i}>{item.tyyppinimi}</option>
                            )
                        })}
                    </select><br/>   
                    Sijainti : <br /><select onChange={this.onPostChange} type="text">
                        <option></option>
                        {this.state.postit.map(function (p, i) {
                            return (
                                <option key={i} >{p.postinro}, {p.toimipaikka}</option>
                            )
                        })}
                    </select><br></br>
                    <br />

                    <button onClick={this.SearchDevices} className="button-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon /></button>             
                </div>  
                <br></br>
                <table className="device-table" ref={(el) => this.devTable = el}>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Merkki</th>
                            <th>Malli</th>
                            <th>Laitetyyppi</th>
                            <th>Sijainti</th>
                            <th>Kuvaus</th>
                            <th>Hinta €/päivä</th>                            
                            
                        </tr>
                        {this.state.laitteet.map(function (item, i) {                            
                            return (   
                                <tr key={i}>
                                    <td><div><b>{item.laiteID}</b></div></td>
                                    <td><div>{item.merkki}</div></td>
                                    <td><div><b>{item.malli}</b></div></td>
                                    <td><div>{item.laitetyyppi_tyyppinimi}</div></td>
                                    <td><div><b>{item.posti_postinro}</b>&nbsp;</div></td>
                                    <td><div>{item.kuvaus}</div></td>
                                    <td><div><b>{item.pvhinta} €</b></div></td>                                                                           
                                    
                                </tr>
                            )
                        })}
                    </tbody>
                </table>          
            </div>
        )
    }
    
}
export default Devices;