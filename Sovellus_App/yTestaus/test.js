var assert = require('assert');

var tools = require('.\\tools');

describe('isValidOffice', function () {
    describe('isValidOffice, toimipisteen luominen. Syötteen tarkastus', function () {
        it('Pitäisi palauttaa false, kun postinumero tyhjä', function () {
            assert.equal(false, tools.isValidOffice("", "Mikkeli", "Esimerkkikatu 1", "Erkki Esimerkki", "0440004400"));
        })
        it('Pitäisi palauttaa false, kun toimipaikka tyhjä', function () {
            assert.equal(false, tools.isValidOffice("50100", "", "Esimerkkikatu 1", "Erkki Esimerkki", "0440004400"));
        })
        it('Pitäisi palauttaa false, kun lähiosoite tyhjä', function () {
            assert.equal(false, tools.isValidOffice("50100", "Mikkeli", "", "Erkki Esimerkki", "0440004400"));
        })
        it('Pitäisi palauttaa false, kun nimi tyhjä', function () {
            assert.equal(false, tools.isValidOffice("50100", "Mikkeli", "Esimerkkikatu 1", "", "0440004400"));
        })
        it('Pitäisi palauttaa false, kun puhelinnumero tyhjä', function () {
            assert.equal(false, tools.isValidOffice("50100", "Mikkeli", "Esimerkkikatu 1", "Erkki Esimerkki", ""));
        })
        it('Pitäisi palauttaa false, kun postinumerossa muita kuin numeroita', function () {
            assert.equal(false, tools.isValidOffice("501aa", "Mikkeli", "Esimerkkikatu 1", "Erkki Esimerkki", "0440004400"));
        })
        it('Pitäisi palauttaa false, kun puhelinnumerossa muita kuin numeroita', function () {
            assert.equal(false, tools.isValidOffice("50100", "Mikkeli", "Esimerkkikatu 1", "Erkki Esimerkki", "044abc4400"));
        })        

    })
}),

    describe('isValidDevice, laitteen lisääminen. Syötteen tarkastus', function () {
        describe('isValidDevice', function () {
            it('Pitäisi palauttaa false, kun annettu postinumero tyhjä', function () {
                assert.equal(false, tools.isValidDevice("Nokia", "3310", "Kuvaus on", 25.75, "Älypuhelin", "", "Vapaa"));
            })
            it('Pitäisi palauttaa false, kun annettu postinumero sisältää erikoismerkkejä tai kirjaimia', function () {
                assert.equal(false, tools.isValidDevice("Nokia", "3310", "Kuvaus on", 25.75, "Älypuhelin", "0022a", "Vapaa"));
            })
            
            it('Pitäisi palauttaa false, kun annettu kuvaus tyhjä', function () {
                assert.equal(false, tools.isValidDevice("Nokia", "3310", "", 25.75, "Älypuhelin", "00222", "Vapaa"));
            })
            it('Pitäisi palauttaa false, kun annettu hinta on 0 tai vähemmän', function () {
                assert.equal(false, tools.isValidDevice("Nokia", "3310", "Kuvaus on", -1, "Älypuhelin", "00222", "Vapaa"));
            })
            it('Pitäisi palauttaa false, kun annettu tyyppi on tyhjä', function () {
                assert.equal(false, tools.isValidDevice("Nokia", "3310", "Kuvaus on", 25.75, "", "00222", "Vapaa"));
            })
            it('Pitäisi palauttaa false, kun annettu tila on tyhjä', function () {
                assert.equal(false, tools.isValidDevice("Nokia", "3310", "Kuvaus on", 25.75, "Älypuhelin", "00222", ""));
            })


        })
    }),

    describe('isValidEdit, laitteen muokkaus. Syötteen tarkastus', function () {
        describe('isValidEdit', function () {
            it('Pitäisi palauttaa true, kun kaikki tiedot kelpaavat', function () {
                assert.equal(true, tools.isValidEdit(15, "Kuvaus on", 25.75, "00222", "Vapaa"));
            })

        })})
