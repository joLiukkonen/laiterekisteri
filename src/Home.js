import React, {Component} from 'react';

class Home extends Component {
    //Etusivun komponentti
    render(){
        return(
            <div>                
                <h3>Devices Inc. Laiterekisteri</h3>  
                <div className="home-article">
                    <p><b>Tervetuloa Laiterekisteriimme!</b></p>
                    <article>
                        Olemme kotimainen yritys, joka on keskittynyt laitteiden hankintaan sekä lainaamiseen.
                        Palvelumme on tarkoitettu laitteistomme hallintaan sekä
                        vuokraamiseen. Asiakkaillamme on mahdollista ottaa vuokralle haluamiaan 
                        laitteita varausjärjestelmämme kautta. Tämän lisäksi laitehaun avulla on
                        mahdollista selvittää laitevalikoimamme.                  
                    </article>  
                    &nbsp;  
                    <article>
                        Devices Inc:in henkilökunta voi puolestaan lisätä järjestelmään uusia <br/>
                        laitteita ja ylläpitää laitteiden tietoja.  
                    </article>
                    &nbsp;
                    <article>
                        Teemme uusia laitehankintoja jatkuvasti.
                        Jos et löytänyt listoiltamme kaipaamaasi laitetta, olethan yhteydessä henkilökuntaamme.
                        Yhteystiedot löydät Infon alta.                        
                    </article>
                </div>                            
                
                           
            </div>
        )
    }
}

export default Home;