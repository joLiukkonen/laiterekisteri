import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


class DeleteDevice extends Component {
    //"Poista laitteita"-komponentti laitehallinnassa 
    constructor(props) {
        super(props);
        this.SearchDevices = this.SearchDevices.bind(this);
        this.onDevChange = this.onDevChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
        this.SearchTypes = this.SearchTypes.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);


        this.state = {
            isLoading: false,
            haettu: false,
            laitteet: [],
            malli: "",
            merkki: "",
            tyyppi: "",
            tyypit: [],
            poistettu: false

        };
    }
    onModelChange(event) {
        this.setState({ malli: event.target.value });
    }

    onDevChange(event) {
        this.setState({ merkki: event.target.value });
    }
    onTypeChange(event) {
        this.setState({ tyyppi: event.target.value });
    }

    componentDidMount() {
        this.SearchTypes();

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

    SearchDevices() {

        var merkki = this.state.merkki;
        var malli = this.state.malli;
        var tyyppi = this.state.tyyppi;

        this.setState({ isLoading: true });
        if (malli == "" && merkki == "" && tyyppi == "") {
            setTimeout(function () {
                fetch("http://localhost:4000/laitteet/haku")
                    .then(results => results.json())
                    .then(json => { this.setState({ laitteet: json, isLoading: false, haettu: true }) })
                    .catch(function (error) {
                        confirmAlert({
                            title: 'Virhe',
                            message: 'Laitteita haettaessa tapahtui virhe. ' + JSON.stringify(error),
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
        else {
            setTimeout(function () {
                fetch("http://localhost:4000/laitteet/paramhaku?merkki=" + merkki + "&malli=" + malli + "&tyyppi=" + tyyppi)

                    .then(results => results.json())
                    .then(json => { this.setState({ laitteet: json, isLoading: false, haettu: true }) })
                    .catch(function (error) {
                        confirmAlert({
                            title: 'Virhe',
                            message: 'Laitteita haettaessa tapahtui virhe. ' + JSON.stringify(error),
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

    }

    render() {

        const handleDelete = (data, status) => {//laitteen poisto tapahtuu täällä

            if (status != "Varattu") {
                fetch("http://localhost:4000/laitehallinta/poistalaite/" + data, {
                    method: 'DELETE'
                })
                    .then(function () {
                        confirmAlert({
                            title: 'Laitteen poisto',
                            message: 'Laite poistettu onnistuneesti. ',
                            buttons: [
                                {
                                    label: 'Ok',
                                    onClick: () => 0
                                }
                            ]
                        });
                    })
                    .then(this.SearchDevices())
                    .catch(function (error) {
                        confirmAlert({
                            title: 'Laitteen poisto',
                            message: 'Laitetta poistaessa tapahtui virhe. ' + JSON.stringify(error),
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

        var { isLoading, laitteet, haettu } = this.state;

        //palautetaan näkymä muuttujien arvojen mukaan

        if (isLoading) {
            return (
                <div className="laitehaku">

                    <div className="div-laitehaku">
                        <h3>Poista laitteita</h3>
                        Merkki : <br /><input onChange={this.onDevChange} type="text" name="merkki" /><br />
                    Malli : <br /><input onChange={this.onModelChange} type="text" name="malli" /><br />

                    Laitetyyppi : <br /><select onChange={this.onTypeChange} type="text" name="tyyppi">
                            <option></option>
                            {this.state.tyypit.map(function (item, i) {
                                return (
                                    <option key={i}>{item.tyyppinimi}</option>
                                )
                            })}
                        </select><br />

                        <button onClick={this.SearchDevices} className="button-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon /></button>

                    </div>
                    <p style={{ textAlign: 'center' }}>Haetaan laitteita...</p>
                </div>
            )
        }
        if (laitteet.length < 1 && haettu) {
            return (
                <div className="laitehaku">
                    
                    <div className="div-laitehaku">
                        <h3>Poista laitteita</h3>
                        Merkki : <br /><input onChange={this.onDevChange} type="text" name="merkki" /><br />
                        Malli : <br /><input onChange={this.onModelChange} type="text" name="malli" /><br />

                        Laitetyyppi : <br /><select onChange={this.onTypeChange} type="text" name="tyyppi">
                            <option></option>
                            {this.state.tyypit.map(function (item, i) {
                                return (
                                    <option key={i}>{item.tyyppinimi}</option>
                                )
                            })}
                        </select><br />

                        <button onClick={this.SearchDevices} className="button-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon /></button>


                    </div>
                    <p style={{ textAlign: 'center' }}>Annetuilla hakuehdoilla ei löytynyt laitteita</p>
                </div>
            )
        }
        return (

            <div className="laitehaku">
                
                <div className="div-laitehaku">
                    <h3>Poista laitteita</h3>
                    Merkki : <br /><input onChange={this.onDevChange} type="text" name="merkki" /><br />
                    Malli : <br /><input onChange={this.onModelChange} type="text" name="malli" /><br />

                    Laitetyyppi : <br /><select onChange={this.onTypeChange} type="text" name="tyyppi">
                        <option></option>
                        {this.state.tyypit.map(function (item, i) {
                            return (
                                <option key={i}>{item.tyyppinimi}</option>
                            )
                        })}
                    </select><br />

                    <button onClick={this.SearchDevices} className="button-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon /></button>
                </div>
                <br></br>
                <table className="device-table">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Merkki</th>
                            <th>Malli</th>
                            <th>Laitetyyppi</th>
                            <th>Sijainti</th>
                            <th>Kuvaus</th>
                            <th>Hinta €/päivä</th>
                            <th>Tila</th>
                            <th></th>
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
                                    <td><div>{item.tila_tilanimi}</div></td>
                                    <td><button className="table-btn" onClick={() => {
                                        if (item.tila_tilanimi == "Varattu") {
                                            confirmAlert({
                                                title: 'Laitteen poisto',
                                                message: 'Laite on varattu. Laitetta ei voi poistaa',
                                                buttons: [
                                                    {
                                                        label: 'Ok',
                                                        onClick: () => 0
                                                    }
                                                ]
                                            });
                                        }
                                        else if (item.tila_tilanimi != "Varattu") {
                                            confirmAlert({//poiston vahvistus
                                                title: 'Vahvista laitteen poisto',
                                                message: 'Olet poistamassa laitetta: "' + item.merkki + ' ' + item.malli + '. ID:llä ' 
                                                    + item.laiteID + ', jonka tila on: ' + item.tila_tilanimi + '". Jos haluat poistaa laitteen väliaikaisesti, '
                                                    +'tee se "Muokkaa laitteita"-kohdasta, muutoin laite poistuu pysyvästi. Haluatko vahvistaa poiston?',
                                                buttons: [
                                                    {
                                                        label: 'Poista',
                                                        onClick: () => {
                                                            const data = item.laiteID;
                                                            const tila = item.tila_tilanimi;
                                                            handleDelete(data, tila); //kutsutaan funktiota jossa ladataan taulu uudelleen                                                       
                                                        }
                                                    },
                                                    {
                                                        label: 'Peruuta',
                                                        onClick: () => 0
                                                    }
                                                ]
                                            });
                                        }

                                    }}>Poista <DeleteIcon /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default DeleteDevice;