import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';

class AddType extends Component {
    //Lisää laitetyyppi komponentti
    constructor(props) {
        super(props);
        this.SearchTypes = this.SearchTypes.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.AddNewType = this.AddNewType.bind(this);

        this.state = {
            tyyppi: "",
            tyypit: []
        }

    }
    
    componentDidMount() {
        this.SearchTypes();
        this.tyyppiForm.addEventListener("submit", function (event) {//estetään formin tietojen lähetys submit-eventissä
            event.preventDefault()
        });
    }

    onTypeChange(event) {
        this.setState({ tyyppi: event.target.value });
    }

    //https://laiteapi.azurewebsites.net
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

    AddNewType(){//uuden laitetyypin lisäys (rest kutsu)
        const params = JSON.stringify({
            "Tyyppi": this.state.tyyppi
        })

        axios.post("http://localhost:4000/laitehallinta/lisaatyyppi", params, {
            "headers": {

                "content-type": "application/json",

            },

        })
            .then(function () {
                confirmAlert({//jos virheitä ei koitunut lisäyksessä -> OK
                    title: 'Laitetyypin lisäys',
                    message: 'Laitetyypin lisäys onnistui.',
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })           
            .then(this.tyyppiForm.reset())//tyhjennetään form kun lisäys on suoritettu
            .catch(function (error) {
                confirmAlert({//jos lisäyksessä virhe -> virheilmoitus
                    title: 'Laitetyypin lisäys',
                    message: 'Laitetyypin lisäys epäonnistui. ' + JSON.stringify(error),
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            })
    }

    render() {

        const handleAdd = () => {                  
            this.AddNewType();//jos käyttäjä vahvistaa, kutsutaan lisäysfunktiota
            this.SearchTypes();  
        }
        
        return (
            <div>               
               
                <div className="lisaatyyppi">                    
                   
                    <form className="form-lisaatyyppi" ref={(el) => this.tyyppiForm = el}>
                        <h3>Lisää uusi laitetyyppi</h3> 
                        Voit tarkistaa olemassa olevat laitetyypit alasvetovalikosta : <br /><select onChange={this.onTypeChange} type="text" name="tyyppi" >

                            {this.state.tyypit.map(function (item, i) {
                                return (
                                    <option key={i}>{item.tyyppinimi}</option>
                                )
                            })}
                        </select><br />
                        <input type="text" minLength="2" maxLength="50" required onChange={this.onTypeChange}/>

                        <div className="form-add-cancel">
                            <button type="reset" className="btn-peruuta">
                                Tyhjennä &nbsp;<p className="clear-add-form"><ClearIcon /></p>
                            </button>
                        </div>

                        <div className="form-add-cancel">
                            <button type="submit" className="btn-lisays" onClick={ ()=>
                                {
                                    const type = this.state.tyyppi;
                                    var onOlemassa = false;
                                    this.state.tyypit.map(function (item, i) {
                                        if(item.tyyppinimi == type){
                                            onOlemassa = true;
                                        }                                        
                                    })
                                    if(onOlemassa){
                                        confirmAlert({//
                                            title: 'Laitetyypin lisäys',
                                            message: 'Laitetyyppi "' + type + '" on jo olemassa.',

                                            buttons: [
                                                {
                                                    label: 'Ok',
                                                    onClick: () => 0
                                                }
                                            ]
                                        });
                                    }
                                    else if(!onOlemassa && type.length > 1){
                                        confirmAlert({//käyttäjän vahvistus ennen lisäystä
                                            title: 'Vahvista lisäys',
                                            message: 'Olet lisäämässä laitetyyppiä: "' + type + '". Haluatko vahvistaa lisäyksen?',

                                            buttons: [
                                                {
                                                    label: 'Vahvista',
                                                    onClick: () => {
                                                        handleAdd();
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

export default AddType;