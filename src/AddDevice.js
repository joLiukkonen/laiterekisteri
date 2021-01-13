import React, { Component } from 'react';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';

class AddDevice extends Component {
    //"Lisää laitteita"-komponetti laitehallinnassa 
    constructor(props) {
        super(props);

        this.SearchTypes = this.SearchTypes.bind(this);
        this.SearchPost = this.SearchPost.bind(this);
        this.SearchStatus = this.SearchStatus.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
        this.onDevChange = this.onDevChange.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.onCountChange = this.onCountChange.bind(this);
        this.AddDev = this.AddDev.bind(this);
        

        this.state = {
            malli: "",
            merkki: "",
            hinta: 0.0,
            kuvaus: "",
            tyyppi: "",
            tyypit: [],
            posti: "",
            postit: [],
            tilat: [],
            tila: "",
            maara: 0

        };
    }

    //rest hakuja (tyypit, laitteet, postit...)
    SearchTypes() {
        fetch("http://localhost:4000/laitteet/tyypit")
            .then(results => results.json())
            .then(json => { this.setState({ tyypit: json }) })
            .catch(function (error) {
                confirmAlert({
                    title: 'Virhe',
                    message: 'Laitetyyppejä haettaessa tapahtui virhe. ' + JSON.stringify(error),
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })
    }
    SearchPost() {
        fetch("http://localhost:4000/laitteet/postit")
            .then(results => results.json())
            .then(json => { this.setState({ postit: json }) })
            .catch(function (error) {
                confirmAlert({
                    title: 'Virhe',
                    message: 'Postinumeroita haettaessa tapahtui virhe. ' + JSON.stringify(error),
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })
    }
    SearchStatus() {
        fetch("http://localhost:4000/laitteet/tilat")
            .then(results => results.json())
            .then(json => { this.setState({ tilat: json }) })
            .catch(function (error) {
                confirmAlert({
                    title: 'Virhe',
                    message: 'Tilatietoja haettaessa tapahtui virhe. ' + JSON.stringify(error),
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })
    }

    AddDev() {//kutsutaan restiä ja lisätään laite/laitteet
        var posti_split = this.state.posti.split(',');
        posti_split = posti_split[0];

        const params = JSON.stringify({
            "Merkki": this.state.merkki,
            "Malli": this.state.malli,
            "Hinta": this.state.hinta,
            "Kuvaus": this.state.kuvaus,
            "Tyyppi": this.state.tyyppi,
            "Postinro": posti_split,
            "Tila": this.state.tila,
            "Maara": this.state.maara
        })

        for (var i = 0; i < this.state.maara; i++) {//valittu määrä määrää toisto kerrat
            axios.post("http://localhost:4000/laitehallinta/lisaalaite", params, {
                "headers": {

                    "content-type": "application/json",

                },

            })
                .then(function () {
                    confirmAlert({//jos virheitä ei koitunut lisäyksessä -> OK
                        title: 'Laitteen lisäys',
                        message: 'Laitteen lisäys onnistui.',
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => 0
                            }
                        ]
                    });
                })
                .catch(function (error) {
                    confirmAlert({//jos lisäyksessä virhe -> virheilmoitus
                        title: 'Laitteen lisäys',
                        message: 'Lisäys epäonnistui. ' + JSON.stringify(error),
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => 0
                            }
                        ]
                    });
                })
        }


    }    

    //funktioita kentissä tapahtuville muutoksille
    onTypeChange(event) {//tyyppi
        this.setState({ tyyppi: event.target.value });
    }

    onDevChange(event) {//merkki
        this.setState({ merkki: event.target.value });
    }

    onModelChange(event) {//malli
        this.setState({ malli: event.target.value });
    }

    onPriceChange(event) {//hinta
        this.setState({ hinta: event.target.value });
    }

    onDescriptionChange(event) {//kuvaus
        this.setState({ kuvaus: event.target.value });
    }

    onStatusChange(event) {//tila
        this.setState({ tila: event.target.value });
    }

    onPostChange(event) {//postinro
        this.setState({ posti: event.target.value });
    }

    onCountChange(event) {//määrä
        this.setState({ maara: event.target.value });
    }

    componentDidMount() {//haetaan tiedot valmiiksi kun ladataan sivu
        this.SearchTypes();
        this.SearchPost();
        this.SearchStatus();

        this.laiteForm.addEventListener("submit", function (event) {//estetään formin tietojen lähetys submit-eventissä
            event.preventDefault()
        });
    }

    render() {      

        const handleAdd = () => {
            confirmAlert({//käyttäjän vahvistus ennen lisäystä
                title: 'Vahvista lisäys',
                message: 'Olet lisäämässä laitetta: "' + this.state.tyyppi + ', ' + this.state.merkki + ' '
                    + this.state.malli + ', Kuvaus : '
                    + this.state.kuvaus + ', Hinta : ' + this.state.hinta + ' €/pv, '
                    + ' Tila: ' + this.state.tila + ', '
                    + this.state.maara + ' kpl". Haluatko vahvistaa lisäyksen?',

                buttons: [
                    {
                        label: 'Vahvista',
                        onClick: () => {
                            this.AddDev();//jos käyttäjä vahvistaa, kutsutaan lisäysfunktiota
                        }
                    },
                    {
                        label: 'Peruuta',
                        onClick: () => 0
                    }
                ]
            });

            this.laiteForm.reset();//tyhjennetään form kun lisäys on suoritettu  
                    
        }


        return (//html-komponentit. LISÄÄ MAXLENGTH TEXTAREA + INPUT JOISSA PITUUSRAJOITE KANNASSA !!!
            <div>
                <div className="lisaalaite">
                    <form className="form-lisaalaite" onSubmit={handleAdd} ref={(el) => this.laiteForm = el}>
                        <h3>Lisää laitteita</h3>

                            Merkki : <input type="text" required maxLength="45" onChange={this.onDevChange} className="input-lisaalaite" name="merkki" />
                            Malli : <input type="text" required maxLength="45" onChange={this.onModelChange} className="input-lisaalaite" name="malli" /><br />
                            Hinta €/päivä : <input type="number" step=".05" required onChange={this.onPriceChange} min="0.25" max="1000000" className="input-number-price" name="hinta" /><br />

                            Kuvaus : <br /><textarea rows="3" minLength="5" maxLength="250" required onChange={this.onDescriptionChange} type="text" name="kuvaus" className="textarea-lisaa" /><br />
                            Laitetyyppi : <select required onChange={this.onTypeChange} className="select-lisaa" type="text" name="tyyppi"> &nbsp;
                            <option></option>
                            {this.state.tyypit.map(function (item, i) {
                                return (
                                    <option key={i}>{item.tyyppinimi}</option>
                                )
                            })}
                        </select><br />
                            Postinumero : <select required onChange={this.onPostChange} className="select-lisaa" type="text" name="posti"> &nbsp;
                            <option></option>
                            {this.state.postit.map(function (item, i) {
                                return (
                                    <option key={i}>{item.postinro}, {item.toimipaikka}</option>
                                )
                            })}
                        </select><br />
                            Tila : <select required onChange={this.onStatusChange} className="select-lisaa" type="text" name="tila">&nbsp;
                            <option></option>
                            {this.state.tilat.map(function (item, i) {
                                return (
                                    <option key={i}>{item.tilanimi}</option>
                                )
                            })}
                        </select><br />

                        Määrä : <input type="number" required onChange={this.onCountChange} min="1" max="25" className="input-number-amount" name="maara" /><br />
                        <br></br>
                        <div className="form-add-cancel">
                            <button type="reset" className="btn-peruuta">
                                Tyhjennä &nbsp;<p className="clear-add-form"><ClearIcon /></p>
                            </button>
                        </div>


                        <div className="form-add-cancel">
                            <button type="submit" className="btn-lisays">
                                Vahvista &nbsp;&nbsp;<p className="add-form"><CheckIcon /></p>
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddDevice;