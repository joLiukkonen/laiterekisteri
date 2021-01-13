import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { fi } from 'date-fns/locale';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Events extends Component {
    //varaushistorian haku
    constructor(props) {
        super(props);
        this.SearchEvents = this.SearchEvents.bind(this);
        this.SearchTypes = this.SearchTypes.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.SearchPost = this.SearchPost.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
        this.onDevChange = this.onDevChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
        
        
        this.state = {
            tapahtumat: [],            
            merkki: "",
            malli: "",
            tyyppi: "",
            tyypit: [],
            posti: "",
            postit: [],            
            haettu: false,
            isLoading: false
        }
    }

    componentDidMount() {
        this.SearchTypes();
        this.SearchPost();
    }

    SearchTypes() { //laitetyyppien haku sivun latauksen yhteydessä
        fetch("http://localhost:4000/laitteet/tyypit")
            .then(results => results.json())
            .then(json => { this.setState({ tyypit: json }) })
            .catch(function (error) {
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

    SearchEvents() {
        //ja postinumerosta toimipaikka pois
        var posti_split = this.state.posti.split(',');
        posti_split = posti_split[0];

        var merkki = this.state.merkki;
        var malli = this.state.malli;
        var tyyppi = this.state.tyyppi;
        var postinum = posti_split;        
       
        this.setState({ isLoading: true });

        setTimeout(function () {
            fetch("http://localhost:4000/tapahtumat?merkki=" + merkki + "&malli=" + malli + "&tyyppi=" + tyyppi + "&posti=" + postinum)
                .then(results => results.json())
                .then(json => { this.setState({ tapahtumat: json, isLoading: false, haettu: true }) })
                .catch(function (error) {
                    confirmAlert({
                        title: 'Virhe',
                        message: 'Tapahtumia haettaessa tapahtui virhe. ' + error,
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => 0
                            }
                        ]
                    });
                })
        }.bind(this), 2000);

    }

    onModelChange(event) {//malli
        this.setState({ malli: event.target.value });
    }

    onDevChange(event) {//merkki
        this.setState({ merkki: event.target.value });
    }

    onTypeChange(event) {
        this.setState({ tyyppi: event.target.value });
    }

    onPostChange(event) {//postinro
        this.setState({ posti: event.target.value });
    }

    
    Loading = () => {
        var { isLoading, haettu, tapahtumat } = this.state;
        if (isLoading) {
            return (
                <p style={{ textAlign: "center" }}>Haetaan historiatietoja...</p>
            )
        }
        if (haettu && tapahtumat.length < 1) {
            return (
                <p style={{ textAlign: "center" }}>Annetuilla hakuehdoilla ei löytynyt historiatietoja.</p>
            )
        }
        if (haettu && tapahtumat.length > 0) {
            return (
                <div style={{
                    background: "rgba(255, 255, 255, 0.692)", border: "1px solid black", borderRadius: "2%"
                }}>
                    <p style={{ textAlign: "center", borderBottom: "1px solid black" }}><b>Hakutulokset</b></p>
                    <div>
                        {tapahtumat.map(function (item, i) {
                            var aika = new Date(item.aikaleima);
                            return (
                                <ul style={{ borderBottom: "1px solid black" }}>
                                    <li>
                                        <b>Tapahtumanumero : </b> {item.huoltoID}<br/>
                                        <b>Toimipiste (postinumero) : </b> {item.posti_postinro}
                                    </li>
                                    <li>
                                        <b>Laite :</b> ({item.laiteID}) {item.merkki} {item.malli}, {item.laitetyyppi_tyyppinimi}
                                    </li>
                                    <li>
                                        <b>Tapahtuma / aikaleima : </b>
                                        <li>{item.tapahtuma} / {aika.toLocaleDateString()}</li>
                                    </li>
                                </ul>
                            )
                        })}
                    </div>
                </div>
            )
        }

    }

    render() {
        
        return (
            <div className="laitehaku">
                <h2>Laitteiden huolto- ja tapahtumahistoria</h2>
                <div className="varaushistoria">
                    <h3>Huolto- ja tapahtumatietojen haku</h3>
                    
                    <br />
                            Merkki : <br /><input className="input-varauslait" onChange={this.onDevChange} placeholder="Apple" type="text" name="merkki" /><br />
                            Malli : <br /><input className="input-varauslait" onChange={this.onModelChange} placeholder="IPhone 7" type="text" name="malli" /><br />
                            
                    <br />
                            Laitetyyppi : <br /><select onChange={this.onTypeChange} type="text" name="tyyppi">
                        <option></option>
                        {this.state.tyypit.map(function (item, i) {
                            return (
                                <option key={i}>{item.tyyppinimi}</option>
                            )
                        })}
                    </select><br />
                            Sijainti : <br /><select onChange={this.onPostChange} type="text">
                        <option></option>
                        {this.state.postit.map(function (p, i) {
                            return (
                                <option key={i} >{p.postinro}, {p.toimipaikka}</option>
                            )
                        })}
                    </select><br></br>
                    <br />
                    <button onClick={this.SearchEvents} className="varaus-hae">Hae tietoja &nbsp;&nbsp;<SearchIcon /></button>
                </div><br />
                {this.Loading()}
            </div>
        )
    }
}

export default Events;