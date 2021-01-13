import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import React, { Component } from 'react';

class ListOffices extends Component {
    //toimipiste navigointi komponentti
    constructor(props) {
        super(props);

        this.SearchPost = this.SearchPost.bind(this);
        this.onPostChange = this.onPostChange.bind(this);

        this.state = {
            postit: [],
            posti: ""
        }
    }

    onPostChange(event) {//postinro
        this.setState({ posti: event.target.value });
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

    componentDidMount() {
        this.SearchPost();
    }

    render() {

        return (

            <div className="officelist">
                <h3>Toimipisteet ja yhteystiedot</h3>
                <div>
                    <ul>
                        {this.state.postit.map(function (item, i) {
                            return (
                                <li key={i}><b>{item.toimipaikka}</b>
                                    <li>{item.lahiosoite}, {item.postinro}. Vastuuhenkilö: {item.vastuuhenkilo} {item.puhnro}</li>
                                </li>
                                
                            )
                        })}
                    </ul>
                </div>
                
            </div>

        )
    }
}

export default ListOffices;