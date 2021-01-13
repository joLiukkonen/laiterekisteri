import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import React, { Component } from 'react';
import axios from 'axios';

class AddOffice extends Component {
    //toimipiste navigointi komponentti
    constructor(props) {
        super(props);

        this.SearchPost = this.SearchPost.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
        this.onZipChange = this.onZipChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);

        this.state = {
            postit:[],
            posti: "",
            toim: "",
            lahi: "",
            vastuuhenk: "",
            puhnum: ""
        }
    }

    onZipChange(event) {//postinro
        this.setState({ posti: event.target.value });
    }

    onPostChange(event) {//postinro
        this.setState({ toim: event.target.value });
    }

    onAddressChange(event) {//lähiosoite
        this.setState({ lahi: event.target.value });
    }

    onNameChange(event) {//nimi/vastuuhenk
        this.setState({ vastuuhenk: event.target.value });
    }

    onPhoneChange(event) {//puhnro
        this.setState({ puhnum: event.target.value });
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

    Addoffices(){
        const params = JSON.stringify({
            "Posti": this.state.posti,
            "Toim": this.state.toim,
            "Lahi": this.state.lahi,
            "Henk": this.state.vastuuhenk,
            "Puh": this.state.puhnum
        })

        axios.post("http://localhost:4000/toimipiste/lisaatoimipiste", params, {
            "headers": {

                "content-type": "application/json",

            },

        })
            .then(function () {
                confirmAlert({//jos virheitä ei koitunut lisäyksessä -> OK
                    title: 'Toimipisteen lisäys',
                    message: 'Toimipisteen lisäys onnistui.',
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })
            .then(this.toimForm.reset())//tyhjennetään form kun lisäys on suoritettu
            .catch(function (error) {
                confirmAlert({//jos lisäyksessä virhe -> virheilmoitus
                    title: 'Toimipisteen lisäys',
                    message: 'Toimipisteen lisäys epäonnistui. ' + JSON.stringify(error),
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })
    }

    componentDidMount(){
        this.SearchPost();
        this.toimForm.addEventListener("submit", function (event) {//estetään fromin tietojen lähetys submit-eventissä
            event.preventDefault()
        });
    }  
    
    
    render() {

        const handleAdd = () => {
            this.Addoffices();
            this.SearchPost();
        }

        return (

            <div>
                <div className="lisaaposti">
                    <h3>Lisää uusi toimipiste</h3>
                    <form className="form-lisaatoim" ref={(el) => this.toimForm = el}>
                        Lähiosoite : <input type="text" placeholder="Esimerkkikatu 1" minLength="5" maxLength="45" required onChange={this.onAddressChange}/>
                        Postinumero : <input type="text" placeholder="00100" pattern="[0-9]*" minLength="5" maxLength="5" required onChange={this.onZipChange}/>                        
                        Toimipaikka : <input type="text" placeholder="Helsinki" maxLength="45" required onChange={this.onPostChange}/>
                        <br></br>
                        Vastuuhenkilö : <input type="text" placeholder="Erkki Esimerkki" minLength="2" maxLength="45" required onChange={this.onNameChange}/>
                        Puhelinnumero : <input type="text" placeholder="0400000000" pattern="[0-9]*" minLength="7" maxLength="15" required onChange={this.onPhoneChange}/>
                        <br></br>
                        <div className="form-add-cancel">
                            <button type="reset" className="btn-peruuta">
                                Tyhjennä &nbsp;<p className="clear-add-form"><ClearIcon /></p>
                            </button>
                        </div>


                        <div className="form-add-cancel">
                            <button type="submit" className="btn-lisays" onClick={() => {
                                const postnum = this.state.posti;
                                const toimip = this.state.toim;
                                const lahios = this.state.lahi;
                                const vastuuhnk = this.state.vastuuhenk;
                                const puh = this.state.puhnum;
                                var onOlemassa = false;
                                this.state.postit.map(function (item, i) {
                                    if (item.postinro == postnum && item.toimipaikka == toimip && item.lahiosoite == lahios) {
                                        onOlemassa = true;
                                    }
                                })
                                if (onOlemassa) {
                                    confirmAlert({//
                                        title: 'Toimipisteen lisäys',
                                        message: 'Toimipiste "'+ lahios +", " + toimip + ", " + postnum +'" on jo olemassa.',

                                        buttons: [
                                            {
                                                label: 'Ok',
                                                onClick: () => 0
                                            }
                                        ]
                                    });
                                }
                                else if (!onOlemassa && postnum.length == 5 && toimip.length > 1) {
                                    confirmAlert({//käyttäjän vahvistus ennen lisäystä
                                        title: 'Vahvista lisäys',
                                        message: 'Olet lisäämässä toimipistettä : "' + lahios + ', ' + toimip + ' , '  + postnum 
                                        + '. Vastuuhenkilö: '+ vastuuhnk +', Puh: '+ puh +'" . Haluatko vahvistaa lisäyksen?',

                                        buttons: [
                                            {
                                                label: 'Vahvista',
                                                onClick: () => {
                                                    handleAdd();//jos käyttäjä vahvistaa, kutsutaan lisäysfunktiota
                                                }
                                            },
                                            {
                                                label: 'Peruuta',
                                                onClick: () => 0
                                            }
                                        ]
                                    });
                                }

                            }
                            }>
                                Vahvista &nbsp;&nbsp;<p className="add-form"><CheckIcon /></p>
                            </button>

                        </div>
                    </form>
                </div>
            </div>

        )
    }
}

export default AddOffice;

