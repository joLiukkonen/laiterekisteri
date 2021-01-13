import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { fi } from 'date-fns/locale';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import 'react-nice-dates/build/style.css';

class SearchHistory extends Component {
    //varaushistorian haku
    constructor(props) {
        super(props);
        this.SearchRes = this.SearchRes.bind(this);
        this.SearchTypes = this.SearchTypes.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.SearchPost = this.SearchPost.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
        this.onDevChange = this.onDevChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.Checked = this.Checked.bind(this);

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        this.state = {
            varaukset: [],
            nimi: "",
            merkki: "",
            malli: "",
            tyyppi: "",
            tyypit: [],
            posti: "",
            postit: [],
            alkupvm: new Date(),
            loppupvm: tomorrow,
            haettu: false,
            isLoading: false,
            isChecked: false
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
        fetch("http://localhost:4000/varaus/postit")
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

    SearchRes() {
        //ja postinumerosta toimipaikka pois
        var posti_split = this.state.posti.split(',');
        posti_split = posti_split[0];

        var merkki = this.state.merkki;
        var malli = this.state.malli;
        var tyyppi = this.state.tyyppi;
        var postinum = posti_split;
        var alku = this.state.alkupvm;
        var loppu = this.state.loppupvm;
        var nimi = this.state.nimi;

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

        if(this.state.isChecked == true){
            setTimeout(function () {
                fetch("http://localhost:4000/varaukset/eipvm?merkki=" + merkki + "&malli=" + malli + "&tyyppi=" + tyyppi + "&posti=" + postinum + "&nimi=" + nimi)
                    .then(results => results.json())
                    .then(json => { this.setState({ varaukset: json, isLoading: false, haettu: true }) })
                    .catch(function (error) {
                        confirmAlert({
                            title: 'Virhe',
                            message: 'Varauksia haettaessa tapahtui virhe. ' + error,
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

        else{
            setTimeout(function () {
                fetch("http://localhost:4000/varaukset?merkki=" + merkki + "&malli=" + malli + "&tyyppi=" + tyyppi + "&posti=" + postinum + "&alku=" + alkufinal + "&loppu=" + loppufinal + "&nimi=" + nimi)
                    .then(results => results.json())
                    .then(json => { this.setState({ varaukset: json, isLoading: false, haettu: true }) })
                    .catch(function (error) {
                        confirmAlert({
                            title: 'Virhe',
                            message: 'Varauksia haettaessa tapahtui virhe. ' + error,
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


    onNameChange(event) {//nimi/vastuuhenk
        this.setState({ nimi: event.target.value });
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

    setStartDate = (value) => {//alkupvm
        this.setState({ alkupvm: new Date(value) })
    }
    setEndDate = (value) => {//loppupvm
        this.setState({ loppupvm: new Date(value) })
    }

    Checked(){//checkbox -> otetaanko pvm mukaan vai ei
        if(this.pvmCheck.checked == true){
            this.setState({isChecked: true});
        }
        else{
            this.setState({isChecked: false});
        }
    }

    Loading = () => {
        var { isLoading, haettu, varaukset } = this.state;
        if (isLoading) {
            return (
                <p style={{ textAlign: "center" }}>Haetaan varauksia...</p>
            )
        }
        if (haettu && varaukset.length < 1) {
            return (
                <p style={{ textAlign: "center" }}>Annetuilla hakuehdoilla ei löytynyt varauksia.</p>
            )
        }
        if (haettu && varaukset.length > 0) {
            return (
                <div style={{
                    background: "rgba(255, 255, 255, 0.692)", border:"1px solid black", borderRadius:"2%"}}>
                    <p style={{ textAlign: "center", borderBottom: "1px solid black" }}><b>Hakutulokset</b></p>
                    <div>
                        {varaukset.map(function(item, i){
                            var a = new Date(item.alkupvm);
                            var l = new Date(item.loppupvm);
                            return(
                                <ul key={i} style={{ borderBottom: "1px solid black" }}>                                    
                                    <li>
                                        <b>Varausnumero :</b> {item.varausID}
                                    </li>
                                    <li>
                                        <b>Varaajan tiedot :</b> 
                                        <li>{item.nimi}, {item.puhnum}</li> 
                                        <li>{item.lahiosoite}, {item.postnum}, {item.toimipaikka}</li>
                                    </li>
                                    <li>
                                        <b>Laite :</b> ({item.laiteID}) {item.merkki} {item.malli}, {item.laitetyyppi_tyyppinimi}, {item.pvhinta}€/pv
                                    </li>
                                    <li>
                                        <b>Varauksen ajankohta : </b>{a.toLocaleDateString()} - {l.toLocaleDateString()}
                                    </li>
                                    <li>
                                        <b>Lisätiedot : </b> Kesto {item.kesto} vrk ja kokonaishinta {item.hinta}€
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
        var { alkupvm, loppupvm } = this.state;
        return (
            <div className="laitehaku">
                <h2>Varaushistoria</h2>
                <div className="varaushistoria">
                    <h3>Varauksien haku</h3>
                    <DateRangePicker
                        startDate={alkupvm}
                        endDate={loppupvm}
                        onStartDateChange={this.setStartDate}
                        onEndDateChange={this.setEndDate}
                        minimumDate={new Date(2020, 0, 1)}
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
                    <b style={{ color: "red" }}>Valittu aikaväli : </b>
                            <label>
                                {alkupvm.toLocaleDateString()}
                            </label>
                            &nbsp;-&nbsp;
                            <label>{loppupvm.toLocaleDateString()}</label><br />
                            tai <br/>
                    <b>Kaikki ajankohdat<input onClick={this.Checked} style={{ padding:"none" }} type="checkbox" ref={(el) => this.pvmCheck = el} /></b> <br/>
                    <br />
                            Merkki : <br /><input className="input-varauslait" onChange={this.onDevChange} placeholder="Apple" type="text" name="merkki" /><br />
                            Malli : <br /><input className="input-varauslait" onChange={this.onModelChange} placeholder="IPhone 7" type="text" name="malli" /><br />
                            Varaajan nimi : <br /><input onChange={this.onNameChange} className="input-varauslait" placeholder="esim. Etunimi Sukunimi" type="text" maxLength="250" />

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
                                <option key={i} >{p.postnum}, {p.toimipaikka}</option>
                            )
                        })}
                    </select><br></br>
                    <br />
                    <button onClick={this.SearchRes} className="varaus-hae">Hae varauksia &nbsp;&nbsp;<SearchIcon /></button>
                </div><br/>
                {this.Loading()}
            </div>
        )
    }
}

export default SearchHistory;