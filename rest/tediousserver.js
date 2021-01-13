var express = require('express');
var tediousExpress = require('express4-tedious');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}
app.use(allowCrossDomain);
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "", // poistettu tietoturvasyistä
      password: "" // poistettu tietoturvasyistä
    },
    type: "default"
  },
  server: "laiterekisteri2020.database.windows.net", // update me
  options: {
    database: "laiterekisteri", //update me
    encrypt: true
  }
};

app.use(function (req, res, next) {
  req.sql = tediousExpress(config);
  next();
});

//getit->

app.get('/laitteet/tyypit', function (req, res) {//laitetyyppi haku
  req.sql("SELECT * FROM laitetyyppi FOR JSON PATH")
    .into(res);


}),

  app.get('/laitteet/haku', function (req, res) {// laitehaku KAIKKI
    req.sql("SELECT * FROM laite WHERE NOT tila_tilanimi = 'Poistettu' ORDER BY merkki FOR JSON PATH")
      .into(res);
  }),

  app.get('/tapahtumat', function (req, res) {//huolto/tapahtumahistorian haku
    try {
      var tyyppi = req.query.tyyppi;
      var posti = req.query.posti;
      var merkki = req.query.merkki;
      var malli = req.query.malli;
    }
    catch (error) {
      throw new Error('Tomintoa ei voitu suorittaa')
    }
    if (tyyppi === null || tyyppi === undefined) {
      tyyppi = "";
    }
    if (posti === null || posti === undefined) {
      posti = "";
    }
    if (merkki === null || merkki === undefined) {
      merkki = "";
    }
    if (malli === null || malli === undefined) {
      malli = "";
    }

    var qry = "SELECT laite.merkki, laite.malli, laite.laitetyyppi_tyyppinimi, laite.posti_postinro, laitehuolto.* ";
    qry += "FROM laite JOIN laitehuolto ON laite.laiteID = laitehuolto.laiteID ";
    qry += "WHERE laite.merkki LIKE '" + merkki + "%' ";
    qry += "AND laite.malli LIKE '" + malli + "%' ";
    qry += "AND laite.laitetyyppi_tyyppinimi LIKE '" + tyyppi + "%' ";
    qry += "AND laite.posti_postinro LIKE '" + posti + "%' ";
    qry += "ORDER BY aikaleima FOR JSON PATH;";

    req.sql(qry)
      .into(res);

  }),

  app.get('/laitteet/haevapaat', function (req, res) {// varauksen yhteydessä suoritettava haku
    try {
      var tyyppi = req.query.tyyppi;
      var posti = req.query.posti;
      var alkupvm = req.query.alku.toString();
      var loppupvm = req.query.loppu.toString();
      var hakusana = req.query.haku;
      var merkki = req.query.merkki;
      var malli = req.query.malli;
    }
    catch (error) {
      throw new Error('Tomintoa ei voitu suorittaa')
    }

    if (alkupvm === null || alkupvm === undefined || loppupvm === null || loppupvm === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Päivämäärä ei ollut validi"
      })
    }
    if (tyyppi === null || tyyppi === undefined) {
      tyyppi = "";
    }
    if (posti === null || posti === undefined) {
      posti = "";
    }
    if (hakusana === null || hakusana === undefined) {
      hakusana = "";
    }
    if (merkki === null || merkki === undefined) {
      merkki = "";
    }
    if (malli === null || merkki === undefined) {
      malli = "";
    }

    var qry = "SELECT DISTINCT laite.* FROM laite JOIN varaus ON 1=1 WHERE laite.laiteID NOT IN ";
    qry += "(SELECT laiteID FROM varaus WHERE ";
    qry += "(alkupvm BETWEEN '" + alkupvm + "' AND '" + loppupvm + "' ";
    qry += "OR loppupvm BETWEEN '" + alkupvm + "' AND '" + loppupvm + "')) ";
    /**/
    qry += "AND laite.merkki LIKE '" + merkki + "%' ";
    qry += "AND laite.malli LIKE '" + malli + "%' ";
    qry += "AND laite.laitetyyppi_tyyppinimi LIKE '" + tyyppi + "%' ";
    qry += "AND laite.posti_postinro LIKE '" + posti + "%' ";
    qry += "AND laite.tila_tilanimi = 'Käytössä' ";
    qry += "AND kuvaus LIKE '%" + hakusana + "%' ";
    qry += "ORDER BY merkki FOR JSON PATH;";

    req.sql(qry)
      .into(res);
  })

app.get('/laitteet/paramhaku', function (req, res) {// laitehaku PARAMETREILLA
  var merkki = req.query.merkki;
  var malli = req.query.malli;
  var laitetyyppi = req.query.tyyppi;
  var postinum = req.query.posti;

  if (merkki === null || merkki === undefined) {
    merkki = "";
  }
  if (malli === null || malli === undefined) {
    malli = "";
  }
  if (laitetyyppi === null || laitetyyppi === undefined) {
    laitetyyppi = "";
  }
  if (postinum === null || postinum === undefined) {
    postinum = "";
  }  

  var qry = "SELECT * FROM laite WHERE laitetyyppi_tyyppinimi LIKE '" + laitetyyppi + "%' AND merkki LIKE '" + merkki + "%'";
  qry += " AND malli LIKE '" + malli + "%' AND posti_postinro LIKE '" + postinum + "%' ";
  qry += "AND tila_tilanimi <> 'Poistettu' ";

  qry += "ORDER BY merkki FOR JSON PATH";

  req.sql(qry)
    .into(res);
}),

  app.get('/laitteet/tyhjamuokkaus', function (req, res) {// laitehaku KAIKKI
    req.sql("SELECT * FROM laite ORDER BY merkki FOR JSON PATH")
      .into(res);
  }),

  app.get('/laitteet/muokkaushaku', function (req, res) {// muokkuashaku PARAMETREILLA
    var merkki = req.query.merkki;
    var malli = req.query.malli;
    var laitetyyppi = req.query.tyyppi;
    var postinum = req.query.posti;

    if (merkki === null || merkki === undefined) {
      merkki = "";
    }
    if (malli === null || malli === undefined) {
      malli = "";
    }
    if (laitetyyppi === null || laitetyyppi === undefined) {
      laitetyyppi = "";
    }
    if (postinum === null || postinum === undefined) {
      postinum = "";
    }

    var qry;

    qry = "SELECT * FROM laite WHERE laitetyyppi_tyyppinimi LIKE '" + laitetyyppi + "%' AND merkki LIKE '" + merkki + "%'";
    qry += " AND malli LIKE '" + malli + "%' AND posti_postinro LIKE '" + postinum + "%' ";

    qry += "ORDER BY merkki FOR JSON PATH";

    req.sql(qry)
      .into(res);
  }),

  app.get('/laitteet/postit', function (req, res) {// postinumero haku
    req.sql("SELECT * FROM posti ORDER BY toimipaikka FOR JSON PATH")
      .into(res);
  }),

  app.get('/laitteet/tilat', function (req, res) {// laitetilojen haku
    req.sql("SELECT * FROM tila FOR JSON PATH")
      .into(res);
  }),

  app.get('/varaus/postit', function (req, res) {//haetaan toimipaikat joissa varauksia
    req.sql("SELECT DISTINCT postnum, toimipaikka FROM varaus ORDER BY toimipaikka FOR JSON PATH")
      .into(res);
  }),

  app.get('/varaukset', function (req, res) { //haetaan varaukset
    var tyyppi = req.query.tyyppi;
    var posti = req.query.posti;
    var alkupvm = req.query.alku.toString();
    var loppupvm = req.query.loppu.toString();
    var nimi = req.query.nimi;
    var merkki = req.query.merkki;
    var malli = req.query.malli;

    if (alkupvm == "" || loppupvm == "") {
      return res.status(400).json({
        status: "error",
        message: "Päivämäärä ei ollut validi"
      })
    }
    if (alkupvm === null || alkupvm === undefined || loppupvm === null || loppupvm === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Päivämäärä ei ollut validi"
      })
    }
    if (tyyppi === null || tyyppi === undefined) {
      tyyppi = "";
    }
    if (posti === null || posti === undefined) {
      posti = "";
    }
    if (nimi === null || nimi === undefined) {
      nimi = "";
    }
    if (merkki === null || merkki === undefined) {
      merkki = "";
    }
    if (malli === null || merkki === undefined) {
      malli = "";
    }

    var qry = "SELECT laite.merkki, laite.malli, laite.pvhinta, laite.laitetyyppi_tyyppinimi, varaus.* FROM laite JOIN varaus ON laite.laiteID = varaus.laiteID ";

    /**/
    qry += "WHERE varaus.nimi LIKE '%" + nimi + "%' ";

    qry += "AND laite.laitetyyppi_tyyppinimi LIKE '" + tyyppi + "%' ";
    qry += "AND laite.merkki LIKE '" + merkki + "%' ";
    qry += "AND laite.malli LIKE '" + malli + "%' ";
    qry += "AND varaus.postnum LIKE '" + posti + "%' ";
    qry += "AND varaus.alkupvm BETWEEN '" + alkupvm + "' AND '" + loppupvm + "' ";
    qry += "AND varaus.loppupvm BETWEEN '" + alkupvm + "' AND '" + loppupvm + "' ";
    qry += "ORDER BY varausID FOR JSON PATH;";

    req.sql(qry)
      .into(res);
  }),

  app.get('/varaukset/eipvm', function (req, res) {
    var tyyppi = req.query.tyyppi;
    var posti = req.query.posti;
    var nimi = req.query.nimi;
    var merkki = req.query.merkki;
    var malli = req.query.malli;

    if (tyyppi === null || tyyppi === undefined) {
      tyyppi = "";
    }
    if (posti === null || posti === undefined) {
      posti = "";
    }
    if (nimi === null || nimi === undefined) {
      nimi = "";
    }
    if (merkki === null || merkki === undefined) {
      merkki = "";
    }
    if (malli === null || merkki === undefined) {
      malli = "";
    }

    var qry = "SELECT laite.merkki, laite.malli, laite.pvhinta, laite.laitetyyppi_tyyppinimi, varaus.* FROM laite JOIN varaus ON laite.laiteID = varaus.laiteID ";
    /**/
    qry += "WHERE varaus.nimi LIKE '%" + nimi + "%' ";
    qry += "AND laite.laitetyyppi_tyyppinimi LIKE '" + tyyppi + "%' ";
    qry += "AND laite.merkki LIKE '" + merkki + "%' ";
    qry += "AND laite.malli LIKE '" + malli + "%' ";
    qry += "AND varaus.postnum LIKE '" + posti + "%' ";

    qry += "ORDER BY varausID FOR JSON PATH;";

    req.sql(qry)
      .into(res);
  }),

  /*app.get('/laitteet/max', function (req, res) {//haetaan viimeisimpänä lisätty
    req.sql("SELECT * FROM laite WHERE laiteID = MAX(laiteID) FOR JSON PATH")
      .into(res);
  }),*/

  //postit ja putit (delete) ->

  app.post('/laitehallinta/lisaalaite', function (req, res) {// laitteen lisäys
    var err = false;

    var merkki = req.body.Merkki;
    var malli = req.body.Malli;
    var kuvaus = req.body.Kuvaus;
    var pvhinta = req.body.Hinta;
    var tyyppi = req.body.Tyyppi;
    var posti = req.body.Postinro;
    var tila = req.body.Tila;

    if (Number(tyyppi) || tyyppi === null || tyyppi === undefined || tyyppi == "") {
      err = true;
    }
    if (!(/^[0-9]+$/).test(posti) || posti === null || posti === undefined || posti == "") {
      err = true;
    }
    if (merkki === null || merkki === undefined || merkki == "") {
      err = true;
    }
    if (malli === null || merkki === undefined || malli == "") {
      err = true;
    }
    if (kuvaus === null || kuvaus === undefined || kuvaus == "") {
      err = true;
    }
    if (!Number(pvhinta) || pvhinta === null || pvhinta === undefined || pvhinta <= 0) {
      err = true;
    }
    if (Number(tila) || tila === null || tila === undefined || tila == "") {
      err = true;
    }
    console.log(JSON.stringify(req.body));
    if (!err) {
      req.sql("INSERT INTO laite (merkki, malli, kuvaus, pvhinta, laitetyyppi_tyyppinimi, posti_postinro, tila_tilanimi) VALUES ('" + merkki + "', '" + malli + "', '" + kuvaus + "', " + pvhinta + ", '" + tyyppi + "', '" + posti + "', '" + tila + "');")
        .into(res);
    }
    else {
      throw new Error('Toimintoa ei voitu suorittaa')
    }


  }),

  app.post('/laitehallinta/lisaatyyppi', function (req, res) {// laitetyypin lisäys
    var err = false;
    var tyyppi = req.body.Tyyppi;

    if (Number(tyyppi) || tyyppi == "" || tyyppi === null || tyyppi === undefined) {
      err = true;
    }
    if (!err) {
      req.sql("INSERT INTO laitetyyppi (tyyppinimi) VALUES ('" + tyyppi + "');")
        .into(res);
    }
    else {
      throw new Error('Toimintoa ei voitu suorittaa')
    }
  }),

  app.put('/laitehallinta/muokkaa/:id', function (req, res) {//laite muokkaus
    var err = false;

    var { id } = req.params;
    var kuvaus = req.body.Kuvaus;
    var hinta = req.body.Hinta;
    var postnum = req.body.Postinro;
    var tila = req.body.Tila;
    var muutos = req.body.Muutos;
    var aika = req.body.Aika;

    if (!Number(id) || id === null || id === undefined || id <= 0) {
      err = true;
    }

    if (!(/^[0-9]+$/).test(postnum) || postnum === null || postnum === undefined || postnum == "") {
      err = true;
    }
    if (muutos === null || muutos === undefined) {
      err = true;
    }
    if (aika === null || aika === undefined) {
      err = true;
    }
    if (kuvaus === null || kuvaus === undefined) {
      err = true;
    }
    if (!Number(hinta) || hinta === null || hinta === undefined || hinta <= 0) {
      err = true;
    }
    if (Number(tila) || tila === null || tila === undefined) {
      err = true;
    }
    console.log(id, kuvaus, hinta, postnum, tila, aika);

    var qry = "BEGIN TRANSACTION UPDATE laite SET kuvaus = '" + kuvaus + "', pvhinta = " + hinta + ","
      + " posti_postinro = '" + postnum + "', tila_tilanimi = '" + tila + "' WHERE laiteID = " + id + ";";
    if (muutos == true || muutos == "true") {
      qry += " INSERT INTO laitehuolto (tapahtuma, aikaleima, laiteID) VALUES ('Tilan muutos : " + tila + "', CAST('" + aika + "' AS DATE), " + id + ");"
    }
    qry += "COMMIT;"
    if (!err) {
      req.sql(qry)
        .into(res);
    }
    else {
      throw new Error('Toimintoa ei voitu suorittaa')
    }

  }),

  app.post('/toimipiste/lisaatoimipiste', function (req, res) {//toimipaikan lisäys
    var err = false;

    var posti = req.body.Posti;
    var toim = req.body.Toim;
    var lahi = req.body.Lahi;
    var henk = req.body.Henk;
    var puh = req.body.Puh;

    if (!(/^[0-9]+$/).test(posti) || posti === null || posti === undefined || posti == "") {
      err = true;
    }
    if (Number(toim) || toim === null || toim === undefined || toim == "") {
      err = true;
    }
    if (lahi === null || lahi === undefined || lahi == "") {
      err = true;
    }
    if (Number(henk) || henk === null || henk === undefined || henk == "") {
      err = true;
    }
    if (!(/^[0-9]+$/).test(puh) || puh === null || puh === undefined || puh == "") {
      err = true;
    }

    if (!err) {
      req.sql("INSERT INTO posti (postinro, toimipaikka, lahiosoite, vastuuhenkilo, puhnro) VALUES ('" + posti + "', '" + toim + "' , '" + lahi + "' , '" + henk + "' , '" + puh + "');")
        .into(res);
    }
    else {
      throw new Error('Toimintoa ei voitu suorittaa')
    }

  }),

  /*app.delete('/laitehallinta/poistalaite/:id', function (req, res) {// laitteen poisto
    var { id } = req.params;  
  
    req.sql("DELETE FROM laite WHERE laiteID = " + id)
      .into(res);
  }),*/

  app.post('/varaus/varaa', function (req, res) {//varauksen lisäys
    var err = false;

    var alku = req.body.Alkupvm;
    var loppu = req.body.Loppupvm;
    var kokhinta = req.body.Hinta;
    var kesto = req.body.Kesto;
    var nimi = req.body.Nimi;
    var postinro = req.body.Postinum;
    var lahios = req.body.Lahi;
    var toimp = req.body.Toimip;
    var puh = req.body.Puh;
    var laiteID = req.body.LaiteID;

    if (alku === null || alku === undefined || loppu === null || loppu === undefined) {
      err = true;
    }
    if (!Number(kokhinta) || kokhinta === null || kokhinta === undefined || kokhinta <= 0) {
      err = true;
    }
    if (!Number.isInteger(kesto) || kesto === null || kesto === undefined || kesto <= 0) {
      err = true;
    }
    if (nimi === null || nimi === undefined || nimi == "") {
      err = true;
    }
    if (!(/^[0-9]+$/).test(postinro) || postinro === null || postinro === undefined || postinro == "") {
      err = true;
    }
    if (toimp === null || toimp === undefined || toimp == "") {
      err = true;
    }
    if (lahios === null || lahios === undefined || lahios == "") {
      err = true;
    }
    if (!(/^[0-9]+$/).test(puh) || puh === null || puh === undefined || puh == "") {
      err = true;
    }
    if (!Number.isInteger(laiteID) || laiteID <= 0 || laiteID === null || laiteID === undefined) {
      err = true;
    }
    console.log(JSON.stringify(req.body));

    var qry = "INSERT INTO varaus (alkupvm, loppupvm, hinta, kesto, nimi, postnum, lahiosoite, toimipaikka, puhnum, laiteID) ";
    qry += "VALUES (CAST('" + alku + "' AS DATE), CAST('" + loppu + "' AS DATE), " + kokhinta + ", " + kesto + ", '" + nimi + "', '" + postinro + "', '" + lahios + "', '" + toimp + "', '" + puh + "', " + laiteID + ")";

    if (!err) {
      req.sql(qry)
        .into(res);
    }
    else {
      throw new Error('Toimintoa ei voitu suorittaa')
    }

  }),

  app.listen(4000, () => {
    console.log("Server listening on port 4000")
  });
