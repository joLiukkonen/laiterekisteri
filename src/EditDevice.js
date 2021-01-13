import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import CheckIcon from '@material-ui/icons/Check';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class EditDevice extends Component {
    //Muokkaa laitteita - komponentti    
    constructor(props) {
        super(props);
        this.SearchDevices = this.SearchDevices.bind(this);
        this.onDevChange = this.onDevChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
        this.SearchTypes = this.SearchTypes.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.SearchStatus = this.SearchStatus.bind(this);
        this.SearchPost = this.SearchPost.bind(this);
        this.onZipChange = this.onZipChange.bind(this);

        this.state = {
            isLoading: false,
            haettu: false,
            laitteet: [],
            malli: "",
            merkki: "",
            tyyppi: "",
            tyypit: [],
            tilat: [],
            postit: [],
            hakuposti: "",
            posti: "",
            kuvaus: "",
            hinta: 0,
            tila: "",
            open: true
        };
    }

    //hakuparametrien muutokset ->
    onModelChange(event) {
        this.setState({ malli: event.target.value });
    }

    onDevChange(event) {
        this.setState({ merkki: event.target.value });
    }
    onTypeChange(event) {
        this.setState({ tyyppi: event.target.value });
    }
    onZipChange(event) {
        this.setState({ hakuposti: event.target.value })
    }

    componentDidMount() {
        this.SearchTypes();
        this.SearchStatus();
        this.SearchPost();
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
        var posti_split = this.state.hakuposti.split(',');
        posti_split = posti_split[0];
        var postinum = posti_split;

        this.setState({ isLoading: true });
        if (malli == "" && merkki == "" && tyyppi == "" && postinum == "") {
            setTimeout(function () {
                fetch("http://localhost:4000/laitteet/tyhjamuokkaus")
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
                fetch("http://localhost:4000/laitteet/muokkaushaku?merkki=" + merkki + "&malli=" + malli + "&tyyppi=" + tyyppi + "&posti=" + postinum)

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

    render() {
        //laitetietojen muutokset ->
        const onPriceChange = (event) => {//hinta
            this.setState({ hinta: event.target.value });
        }

        const onDescriptionChange = (event) => {//kuvaus
            this.setState({ kuvaus: event.target.value });
        }

        const onStatusChange = (event) => {//tila
            this.setState({ tila: event.target.value });
        }

        const onPostChange = (event) => {//postinro
            this.setState({ posti: event.target.value });
        }

        const handleEdit = (data, p, k, h, t) => {//laitteen muokkaus tapahtuu täällä
            var tilanmuutos = false;
            var kuv = this.state.kuvaus;
            if (kuv == "") {
                kuv = k;
            }
            var post = this.state.posti;
            if (post == "") {
                post = p;
            }
            var hin = this.state.hinta;
            if (hin == 0) {
                hin = h;
            }
            var til = this.state.tila;
            if (til != t && til != "") {
                tilanmuutos = true;
            }
            if (til == "") {
                til = t;
            }

            const params = JSON.stringify({
                "Kuvaus": kuv,
                "Hinta": hin,
                "Postinro": post,
                "Tila": til,
                "Muutos": tilanmuutos,
                "Aika": new Date()
            })

            fetch("http://localhost:4000/laitehallinta/muokkaa/" + data, {
                method: 'PUT',
                headers: {
                    "content-type": "application/json"
                },
                body: params
            })
                .then(function () {
                    confirmAlert({
                        title: 'Laitetietojen muokkaus',
                        message: 'Laitteen tiedot päivitetty. ',
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
                        title: 'Laitetietojen muokkaus',
                        message: 'Laitetietojen muokkauksessa tapahtui virhe. ' + JSON.stringify(error),
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => 0
                            }
                        ]
                    });
                })
            this.setState({
                posti: "",
                kuvaus: "",
                hinta: 0,
                tila: ""
            });

        }

        var { isLoading, laitteet, haettu, tilat, postit, posti, kuvaus, hinta, tila, open } = this.state;

        //palautetaan näkymä muuttujien arvojen mukaan

        if (isLoading) {
            return (
                <div className="laitehaku">

                    <div className="div-laitehaku">
                        <h3>Muokkaa laitteita</h3>
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
                        Sijainti : <br /><select onChange={this.onZipChange} type="text">
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
                    <p style={{ textAlign: 'center' }}>Haetaan laitteita...</p>
                </div>
            )
        }
        if (laitteet.length < 1 && haettu) {
            return (
                <div className="laitehaku">

                    <div className="div-laitehaku">
                        <h3>Muokkaa laitteita</h3>
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
                        Sijainti : <br /><select onChange={this.onZipChange} type="text">
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
        return (

            <div className="laitehaku">

                <div className="div-laitehaku">
                    <h3>Muokkaa laitteita</h3>
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
                    Sijainti : <br /><select onChange={this.onZipChange} type="text">
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
                                    <td><div>{item.laiteID}</div></td>
                                    <td><div>{item.merkki}</div></td>
                                    <td><div>{item.malli}</div></td>
                                    <td><div>{item.laitetyyppi_tyyppinimi}</div></td>
                                    <td><div>
                                        <select defaultValue={item.posti_postinro} onChange={onPostChange} className="sijainti-edit">
                                            {postit.map(function (p, i) {
                                                return (
                                                    <option key={i} className="sijainti-edit">{p.postinro}</option>
                                                )
                                            })}
                                        </select>
                                    </div></td>
                                    <td><div><textarea onChange={onDescriptionChange} maxLength="250" required rows="4" defaultValue={item.kuvaus} className="textarea-muokkaa" /></div></td>
                                    <td style={{ width: "10%" }}><div><input onChange={onPriceChange} required type="number" step=".05" min="0.25" max="1000000" className="input-edit" defaultValue={item.pvhinta} />€</div></td>
                                    <td ><div>
                                        <select onChange={onStatusChange} className="select-edit" defaultValue={item.tila_tilanimi}>
                                            {tilat.map(function (x, i) {
                                                return (
                                                    <option key={i}>{x.tilanimi}</option>
                                                )
                                            })}
                                        </select>
                                    </div></td>
                                    <td><button className="table-btn" onClick={() => {
                                        var eityhja = true;

                                        if (posti === '' && kuvaus === '' && hinta === 0 && tila === '') {
                                            eityhja = false;
                                            confirmAlert({
                                                title: 'Laitetietojen muokkaus',
                                                message: 'Muutoksia ei havaittu.',
                                                buttons: [
                                                    {
                                                        label: 'Ok',
                                                        onClick: () => 0
                                                    }
                                                ]
                                            });
                                        }
                                        else if (eityhja) {
                                            var msg = "";
                                            if (posti !== "") {
                                                msg += 'Sijainti / postinumero: ' + posti + '. ';
                                            }
                                            if (kuvaus !== "") {
                                                msg += 'Kuvaus: ' + kuvaus + '. ';
                                            }
                                            if (hinta !== 0 && hinta > 0) {
                                                msg += 'Hinta : ' + hinta + '€. ';
                                            }
                                            if (tila !== "") {
                                                msg += 'Tila : ' + tila + '. ';
                                            }
                                            confirmAlert({//muokkauksen vahvistus
                                                title: 'Vahvista laitetietojen muokkaus',
                                                message: 'Olet muokkaamassa laitetta : ' + item.merkki + ' ' + item.malli + ' ' + item.laitetyyppi_tyyppinimi + '. ID:llä ' + item.laiteID + ". "
                                                    + 'Muokatut tiedot - ' + msg
                                                    + 'Haluatko tallentaa muutokset?',
                                                buttons: [
                                                    {
                                                        label: 'Tallenna muutokset',
                                                        onClick: () => {
                                                            const idData = item.laiteID;

                                                            handleEdit(idData, item.posti_postinro, item.kuvaus, item.pvhinta, item.tila_tilanimi); //kutsutaan funktiota jossa tallennetaan ja ladataan taulu uudelleen                                                       
                                                        }
                                                    },
                                                    {
                                                        label: 'Peruuta',
                                                        onClick: () => 0
                                                    }
                                                ]
                                            });
                                        }
                                        else {
                                            confirmAlert({
                                                title: 'Laitetietojen muokkaus',
                                                message: 'Muutoksia ei havaittu. Muokkaus peruutettu.',
                                                buttons: [
                                                    {
                                                        label: 'Ok',
                                                        onClick: () => 0
                                                    }
                                                ]
                                            });
                                        }

                                    }}>Tallenna<CheckIcon /></button>
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

export default EditDevice;