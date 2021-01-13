import React, {Component} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class News_Others extends Component {
    //Sivussa olevan palkin/ uutisten komponentti
    
    
    render(){
        return(
            <div className="news">
                <p><b>Uutisia</b></p>
                <article>
                    Device Inc laitteiden hallinta- ja varauspalvelu otettu juuri käyttöön.
                </article><br/>
                <img src="https://images.unsplash.com/photo-1581340114858-9273929d6106?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"/>
                &nbsp;
                
                <p><b>Laitevalikoimassa puutteita?</b></p>
                
                <article>
                    Ole yhteydessä henkilökuntaamme, mikäli sinulla on laite-ehdotuksia, 
                    jotka voisivat sopia valikoimaamme.                    
                    
                </article><br/>
                <img src="https://images.unsplash.com/photo-1593244791046-a97fc6a8d483?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"/>

                &nbsp;
                
                <p><b>Ajankohtaista</b></p>
                <article>
                    Laitevalikoima laajenee ja toimipisteitä avattu nyt ympäri Suomea.
                    Käy etsimässä sinua lähin toimipisteemme yhteystiedoista.
                </article><br/>
                
                <img src="https://images.unsplash.com/photo-1580113868920-fadd281f8b9f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"></img>
                
            </div>
        )
    }
}

export default News_Others;