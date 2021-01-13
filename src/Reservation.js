import React, { Component } from 'react';
import axios from 'axios';
import { fi } from 'date-fns/locale';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SearchIcon from '@material-ui/icons/Search';
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import 'react-nice-dates/build/style.css';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.SearchTypes = this.SearchTypes.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.SearchPost = this.SearchPost.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
        this.SearchDevices = this.SearchDevices.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onZipChange = this.onZipChange.bind(this);
        this.onOfficeChange = this.onOfficeChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onDevChange = this.onDevChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
        this.AddRes = this.AddRes.bind(this);

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        this.state = {
            malli: "",
            merkki: "",
            tyyppi: "",
            tyypit: [],
            posti: "",
            postit: [],
            laitteet: [],
            varauslait: [],
            alkupvm: new Date(),
            loppupvm: tomorrow,
            hakusana: "",
            nimi: "",
            lahios: "",
            postnum: "",
            toim: "",
            puhnum: "",
            isLoading: false,
            haettu: false,
            emptyarr: []
        }

    }

    //kaikkien hakuehtojen onChange eventit
    onSearchChange(event) {//hakusana
        this.setState({ hakusana: event.target.value });
    }

    onZipChange(event) {//postinro
        this.setState({ postnum: event.target.value });
    }

    onAddressChange(event) {//lähiosoite
        this.setState({ lahios: event.target.value });
    }

    onNameChange(event) {//nimi/vastuuhenk
        this.setState({ nimi: event.target.value });
    }

    onPhoneChange(event) {//puhnro
        this.setState({ puhnum: event.target.value });
    }

    onOfficeChange(event) {//toimipaikka
        this.setState({ toim: event.target.value });
    }

    onModelChange(event) {//malli
        this.setState({ malli: event.target.value });
    }

    onDevChange(event) {//merkki
        this.setState({ merkki: event.target.value });
    }

    setStartDate = (value) => {//alkupvm
        this.setState({ alkupvm: new Date(value) })
    }
    setEndDate = (value) => {//loppupvm
        this.setState({ loppupvm: new Date(value) })
    }


    componentDidMount() {
        this.SearchTypes();
        this.SearchPost();

        this.varausForm.addEventListener("submit", function (event) {//estetään formin tietojen lähetys submit-eventissä
            event.preventDefault()
        });
    }

    SearchDevices() {
        //ja postinumerosta toimipaikka pois
        var posti_split = this.state.posti.split(',');
        posti_split = posti_split[0];

        var merkki = this.state.merkki;
        var malli = this.state.malli;
        var tyyppi = this.state.tyyppi;
        var postinum = posti_split;
        var alku = this.state.alkupvm;
        var loppu = this.state.loppupvm;
        var haku = this.state.hakusana;

        //muutetaan päivämäärät oikeaan muotoon

        var dd = alku.getDate();
        var mm = alku.getMonth() + 1;
        var yyyy = alku.getFullYear();

        var alkufinal = [yyyy, mm, dd].join('-');

        dd = loppu.getDate();
        mm = loppu.getMonth() + 1;
        yyyy = loppu.getFullYear();

        var loppufinal = [yyyy, mm, dd].join('-');

        this.setState({ isLoading: true });

        setTimeout(function () {
            fetch("http://localhost:4000/laitteet/haevapaat?merkki=" + merkki + "&malli=" + malli + "&tyyppi=" + tyyppi + "&posti=" + postinum + "&alku=" + alkufinal + "&loppu=" + loppufinal + "&haku=" + haku)
                .then(results => results.json())
                .then(json => { this.setState({ laitteet: json, isLoading: false, haettu: true }) })
                .catch(function (error) {
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
        }.bind(this), 2000);


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

    AddRes() {
        var { varauslait, nimi, lahios, postnum, toim, puhnum } = this.state;

        for (var i = 0; i < varauslait.length; i++) {//loopataan laitelista
            var alku = varauslait[i].alku;
            var loppu = varauslait[i].loppu;

            var dd = alku.getDate();
            var mm = alku.getMonth() + 1;
            var yyyy = alku.getFullYear();

            var alkufinal = [yyyy, mm , dd].join('-');


            var dd2 = loppu.getDate();
            var mm2 = loppu.getMonth() + 1;
            var yyyy2 = loppu.getFullYear();

            var loppufinal = [yyyy2, mm2, dd2].join('-');

            const params = JSON.stringify({
                "Alkupvm": alkufinal,
                "Loppupvm": loppufinal,
                "Hinta": varauslait[i].kokohinta,
                "Kesto": varauslait[i].kesto,
                "Nimi": nimi,
                "Postinum": postnum,
                "Lahi": lahios,
                "Toimip": toim,
                "Puh": puhnum,
                "LaiteID": varauslait[i].id
            })

            axios.post("http://localhost:4000/varaus/varaa", params, {
                "headers": {
                    "content-type": "application/json",
                },

            })
                .then(function () {
                    confirmAlert({//jos virheitä ei koitunut lisäyksessä -> OK
                        title: 'Varauksen lisäys',
                        message: 'Varauksen lisäys onnistui.',
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
                        title: 'Varauksen lisäys',
                        message: 'Lisäys epäonnistui. ' + error,
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

    GetVarausLait = () => { //tästä komponentista haetaan varaukseen lisätyt laitteet       
        var { varauslait } = this.state;
        if (varauslait.length == 0) {
            return (
                <p style={{ color: "red" }}>Ei vielä lisättyjä laitteita</p>
            )
        }
        else if (varauslait.length != 0) {
            const reloadList = () => {
                this.setState({ varauslait: varauslait })
            }
            
            return (
                <div>
                    {varauslait.map(function (item, i) {
                        var alku = item.alku.toLocaleDateString();
                        var loppu = item.loppu.toLocaleDateString();
                        return (
                            <div key={i} style={{ borderBottom: "1px solid black" }}>
                                <br />
                                <label>
                                    {item.id} : {item.merkki} {item.malli}, {item.hinta}€/pv&nbsp;
                                    <button style={{ color: "red", float: "right" }} onClick={() => {
                                        var delID = item.id;
                                        for (var i = 0; i < varauslait.length; i++) {
                                            if (varauslait[i].id == delID) {
                                                varauslait.splice(i, 1);
                                                reloadList();
                                                break;
                                            }
                                        }
                                    }}>
                                        X
                                    </button>
                                </label><br />
                                <label>Varauksen ajankohta : {alku}</label>&nbsp;-&nbsp;<label>{loppu}</label><br />
                                <label>Varauksen kesto {item.kesto} vrk ja kokonaishinta {item.kokohinta}€</label><br />

                            </div>
                        )
                    })}

                </div>
            )
        }
    }

    onTypeChange(event) {
        this.setState({ tyyppi: event.target.value });
    }

    onPostChange(event) {//postinro
        this.setState({ posti: event.target.value });
    }

    render() {
        const addDev = (id, merkki, malli, hinta, posti) => {  //kun laite lisätään varaukseen / listalle
            var alku = this.state.alkupvm;
            var loppu = this.state.loppupvm;

            //muutetaan päivämäärät oikeaan muotoon

            var dd = alku.getDate();
            var mm = alku.getMonth() + 1;
            var yyyy = alku.getFullYear();

            var alkufinal = [mm, dd, yyyy].join('.');

            var dd2 = loppu.getDate();
            var mm2 = loppu.getMonth() + 1;
            var yyyy2 = loppu.getFullYear();

            var loppufinal = [mm2, dd2, yyyy2].join('.');

            var kesto = parseInt((loppu.getTime() - alku.getTime()) / (24 * 3600 * 1000));//lasketaan varauksen kesto
            kesto = Math.ceil(kesto);
            kesto += 1;
            var kokhinta = kesto * hinta;//kokonaishinnan lasku
            kokhinta = kokhinta.toFixed(2);

            var s = this.state.varauslait.some(item => item.id == id); //tutkitaan onko jo listalla
            if (s) {
                confirmAlert({
                    title: 'Virhe',
                    message: 'Laite on jo listalla.',
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            }
            else {
                this.setState({
                    varauslait: [...this.state.varauslait, {
                        'id': id,
                        'merkki': merkki,
                        'malli': malli,
                        'hinta': hinta,
                        'alku': new Date(alkufinal),
                        'loppu': new Date(loppufinal),
                        'kesto': kesto,
                        'kokohinta': kokhinta,
                        'posti': posti
                    }],
                });
                confirmAlert({
                    title: 'Varaus',
                    message: 'Laite lisätty varauslistalle.',
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            }

        }

        const handleAdd = () => {
            var { varauslait, nimi, lahios, postnum, toim, puhnum, postit } = this.state;
            var msg = "";
            for (var i = 0; i < varauslait.length; i++) {
                msg += " [ Id: " + varauslait[i].id;
                msg += " " + varauslait[i].merkki;
                msg += " " + varauslait[i].malli;
                msg += ", " + varauslait[i].hinta;
                msg += "€/pv. Aikaväli " + varauslait[i].alku.toLocaleDateString();
                msg += " - " + varauslait[i].loppu.toLocaleDateString();
                msg += ", kesto " + varauslait[i].kesto;
                msg += " vrk ja kokonaishinta " + varauslait[i].kokohinta + "€. ";
                for (var j = 0; j < postit.length; j++) {
                    if (postit[j].postinro == varauslait[i].posti) {
                        msg += "Vastuuhenkilö : " + postit[j].vastuuhenkilo + ". ";
                        msg += "Laitteen sijainti : " + postit[j].postinro + ", " + postit[j].toimipaikka + ". ]  ";
                    }
                }
            }

            if (this.state.varauslait.length == 0) {
                confirmAlert({//käyttäjän vahvistus ennen lisäystä
                    title: 'Varaus',
                    message: 'Varaukseen ei ole lisätty laitteita. Lisää laite ja yritä uudelleen.',

                    buttons: [
                        {
                            label: 'Ok',
                            onClick: () => 0
                        }
                    ]
                });
            }
            else if (this.state.varauslait.length > 0) {
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                confirmAlert({//käyttäjän vahvistus ennen lisäystä
                    title: 'Vahvista varaus',
                    message: 'Olet lisäämässä varausta : ' + msg
                        + 'Varaajan tiedot : ' + nimi + ', ' + lahios + ', '
                        + postnum + ', ' + toim + ', ' + puhnum
                        + '. Haluatko vahvistaa varauksen?',

                    buttons: [
                        {
                            label: 'Vahvista',
                            onClick: () => {
                                this.AddRes();//jos käyttäjä vahvistaa, kutsutaan lisäysfunktiota
                                this.varausForm.reset();//tyhjennetään form kun lisäys on suoritettu 
                                
                                this.setState({
                                    alkupvm: new Date(),
                                    loppupvm: tomorrow,
                                    nimi: "",
                                    lahios: "",
                                    postnum: "",
                                    toim: "",
                                    puhnum: "",
                                    varauslait: this.state.emptyarr
                                });
                                this.SearchDevices();
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

        var { isLoading, laitteet, haettu, alkupvm, loppupvm } = this.state;

        if (isLoading) {
            return (
                <div className="laitehaku">
                    <h2>Tee laitevaraus</h2>
                    <div className="varaus">

                        <div className="varaushaku">
                            <h3>Hae varattavissa olevia laitteita</h3>
                            <div>
                                <DateRangePicker
                                    startDate={alkupvm}
                                    endDate={loppupvm}
                                    onStartDateChange={this.setStartDate}
                                    onEndDateChange={this.setEndDate}
                                    minimumDate={alkupvm}
                                    minimumLength={1}
                                    format='dd.MM.yyyy'
                                    locale={fi}

                                >
                                    {({ startDateInputProps, endDateInputProps, focus }) => (
                                        <div className='date-range'>
                                            <input
                                                className={'input' + (focus === START_DATE ? ' -focused' : '')}
                                                {...startDateInputProps}
                                                placeholder='Alkupvm'
                                            />
                                            <span className='date-range_arrow' />
                                            <input
                                                className={'input' + (focus === END_DATE ? ' -focused' : '')}
                                                {...endDateInputProps}
                                                placeholder='Loppupvm'
                                            />
                                        </div>
                                    )}
                                </DateRangePicker><br />
                            <b style={{color:"red"}}>Valittu aikaväli : </b>
                            <label>{alkupvm.toLocaleDateString()}</label>&nbsp;-&nbsp;<label>{loppupvm.toLocaleDateString()}</label><br />
                                <br />
                            Merkki : <br /><input className="input-varauslait" onChange={this.onDevChange} type="text" name="merkki" /><br />
                            Malli : <br /><input className="input-varauslait" onChange={this.onModelChange} type="text" name="malli" /><br />

                                Hakusana : <br /><input onChange={this.onSearchChange} className="input-varauslait" type="text" maxLength="45" />
                                <br />
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
                                <button onClick={this.SearchDevices} className="varaus-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon /></button>
                            </div>

                        </div>
                        <div className="varauslaitteet">
                            <h3>Varaukseen lisätyt laitteet</h3>
                            {this.GetVarausLait()}<br />
                            <form onSubmit={handleAdd} ref={(el) => this.varausForm = el}>

                                Nimi : <input onChange={this.onNameChange}  className="input-varauslait" placeholder="Etunimi Sukunimi" required type="text" minLength="3" maxLength="250" />
                            Lähiosoite : <input onChange={this.onAddressChange} className="input-varauslait" type="text" placeholder="Esimerkkikatu 1" minLength="5" maxLength="45" required />
                            Toimipaikka : <input onChange={this.onOfficeChange}  className="input-varauslait" type="text" placeholder="Helsinki" minLength="2" maxLength="45" required />
                            Postinumero : <input onChange={this.onZipChange} type="text" placeholder="00100" pattern="[0-9]*" minLength="5" maxLength="5" required />
                            Puhelinnumero : <input onChange={this.onPhoneChange} type="text" placeholder="0400004000" pattern="[0-9]*" minLength="7" maxLength="15" required />
                                <br />
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
                    <div>
                        <p style={{ textAlign: "center" }}>Haetaan laitteita...</p>
                    </div>
                </div>
            )
        }
        if (laitteet.length < 1 && haettu) {
            return (
                <div className="laitehaku">
                    <h2>Tee laitevaraus</h2>
                    <div className="varaus">

                        <div className="varaushaku">
                            <h3>Hae varattavissa olevia laitteita</h3>
                            <div>
                                <DateRangePicker
                                    startDate={alkupvm}
                                    endDate={loppupvm}
                                    onStartDateChange={this.setStartDate}
                                    onEndDateChange={this.setEndDate}
                                    minimumDate={new Date()}
                                    minimumLength={1}
                                    format='dd.MM.yyyy'
                                    locale={fi}

                                >
                                    {({ startDateInputProps, endDateInputProps, focus }) => (
                                        <div className='date-range'>
                                            <input
                                                className={'input' + (focus === START_DATE ? ' -focused' : '')}
                                                {...startDateInputProps}
                                                placeholder='Alkupvm'
                                            />
                                            <span className='date-range_arrow' />
                                            <input
                                                className={'input' + (focus === END_DATE ? ' -focused' : '')}
                                                {...endDateInputProps}
                                                placeholder='Loppupvm'
                                            />
                                        </div>
                                    )}
                                </DateRangePicker><br />
                            <b style={{color:"red"}}>Valittu aikaväli : </b><label>{alkupvm.toLocaleDateString()}</label>&nbsp;-&nbsp;<label>{loppupvm.toLocaleDateString()}</label><br />
                                <br />
                            Merkki : <br /><input className="input-varauslait" onChange={this.onDevChange} type="text" name="merkki" /><br />
                            Malli : <br /><input className="input-varauslait" onChange={this.onModelChange} type="text" name="malli" /><br />

                                Hakusana : <br /><input onChange={this.onSearchChange} className="input-varauslait" type="text" maxLength="45" />
                                <br />
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
                                <button onClick={this.SearchDevices} className="varaus-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon /></button>
                            </div>

                        </div>
                        <div className="varauslaitteet">
                            <h3>Varaukseen lisätyt laitteet</h3>
                            {this.GetVarausLait()}<br />
                            <form onSubmit={handleAdd} ref={(el) => this.varausForm = el}>

                                Nimi : <input onChange={this.onNameChange}  className="input-varauslait" placeholder="Etunimi Sukunimi" required type="text" minLength="3" maxLength="250" />
                            Lähiosoite : <input onChange={this.onAddressChange} className="input-varauslait" type="text" placeholder="Esimerkkikatu 1" minLength="5" maxLength="45" required />
                            Toimipaikka : <input onChange={this.onOfficeChange}  className="input-varauslait" type="text" placeholder="Helsinki" minLength="2" maxLength="45" required />
                            Postinumero : <input onChange={this.onZipChange} type="text" placeholder="00100" pattern="[0-9]*" minLength="5" maxLength="5" required />
                            Puhelinnumero : <input onChange={this.onPhoneChange} type="text" placeholder="0400004000" pattern="[0-9]*" minLength="7" maxLength="15" required />
                                <br />
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
                    <div>
                        <p style={{ textAlign: 'center' }}>Annetuilla hakuehdoilla ei löytynyt varattavia laitteita</p>
                    </div>
                </div>
            )
        }
        return (
            <div className="laitehaku">
                <h2>Tee laitevaraus</h2>
                <div className="varaus">

                    <div className="varaushaku">
                        <h3>Hae varattavissa olevia laitteita</h3>
                        <div>
                            <DateRangePicker
                                startDate={alkupvm}
                                endDate={loppupvm}
                                onStartDateChange={this.setStartDate}
                                onEndDateChange={this.setEndDate}
                                minimumDate={new Date()}
                                minimumLength={1}
                                format='dd.MM.yyyy'
                                locale={fi}

                            >
                                {({ startDateInputProps, endDateInputProps, focus }) => (
                                    <div className='date-range'>
                                        <input
                                            className={'input' + (focus === START_DATE ? ' -focused' : '')}
                                            {...startDateInputProps}
                                            placeholder='Alkupvm'
                                        />
                                        <span className='date-range_arrow' />
                                        <input
                                            className={'input' + (focus === END_DATE ? ' -focused' : '')}
                                            {...endDateInputProps}
                                            placeholder='Loppupvm'
                                        />
                                    </div>
                                )}
                            </DateRangePicker><br />
                            <b style={{color:"red"}}>Valittu aikaväli : </b><label>{alkupvm.toLocaleDateString()}</label>&nbsp;-&nbsp;<label>{loppupvm.toLocaleDateString()}</label><br />
                             
                            <br />
                            Merkki : <br /><input className="input-varauslait" onChange={this.onDevChange} type="text" name="merkki" /><br />
                            Malli : <br /><input className="input-varauslait" onChange={this.onModelChange} type="text" name="malli" /><br />

                                Hakusana : <br /><input onChange={this.onSearchChange} className="input-varauslait" type="text" maxLength="45" />
                            <br />
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
                            <button onClick={this.SearchDevices} className="varaus-hae">Hae laitteita &nbsp;&nbsp;<SearchIcon /></button>
                        </div>

                    </div>
                    <div className="varauslaitteet">
                        <h3>Varaukseen lisätyt laitteet</h3>
                        {this.GetVarausLait()}<br />
                        <form onSubmit={handleAdd} ref={(el) => this.varausForm = el}>

                            Nimi : <input onChange={this.onNameChange}  className="input-varauslait" placeholder="Etunimi Sukunimi" required type="text" minLength="3" maxLength="250" />
                            Lähiosoite : <input onChange={this.onAddressChange} className="input-varauslait" type="text" placeholder="Esimerkkikatu 1" minLength="5" maxLength="45" required />
                            Toimipaikka : <input onChange={this.onOfficeChange}  className="input-varauslait" type="text" placeholder="Helsinki" minLength="2" maxLength="45" required />
                            Postinumero : <input onChange={this.onZipChange} type="text" placeholder="00100" pattern="[0-9]*" minLength="5" maxLength="5" required />
                            Puhelinnumero : <input onChange={this.onPhoneChange} type="text" placeholder="0400004000" pattern="[0-9]*" minLength="7" maxLength="15" required />
                            <br />
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

                    <br></br>

                </div><br/>

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

                            <th> </th>
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

                                    <td>
                                        <div>
                                            <button className="table-btn" onClick={() => addDev(item.laiteID, item.merkki, item.malli, item.pvhinta, item.posti_postinro)}>
                                                Lisää varaukseen <PlaylistAddIcon />
                                            </button>
                                        </div>
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
export default Reservation;