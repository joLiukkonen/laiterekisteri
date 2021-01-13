'use strict'
//testaus tarkistus funktioille --Device Inc Laiterekisteri-- 27.11.2020 JL
module.exports =
{
    isValidOffice: function (posti, toimp, lahi, henk, puh){
        if (!(/^[0-9]+$/).test(posti) || posti === null || posti === undefined || posti == "") {
            return false;
        }
        if (Number(toimp) || toimp === null || toimp === undefined || toimp == "") {
            return false;
        }
        if (lahi === null || lahi === undefined || lahi == "") {
            return false;
        }
        if (Number(henk) || henk === null || henk === undefined || henk == "") {
            return false;
        }
        if (!(/^[0-9]+$/).test(puh) || puh === null || puh === undefined || puh == "") {
            return false;
        }
        
    },

    isValidDevice: function (merkki, malli, kuvaus, pvhinta, tyyppi, posti, tila){
        if (Number(tyyppi) || tyyppi === null || tyyppi === undefined || tyyppi == "") {
            return false;
        }
        if (!(/^[0-9]+$/).test(posti) || posti === null || posti === undefined || posti == "") {
            return false;
        }
        if (merkki === null || merkki === undefined || merkki == "") {
            return false;
        }
        if (malli === null || merkki === undefined || malli == "") {
            return false;
        }
        if (kuvaus === null || kuvaus === undefined || kuvaus == "") {
            return false;
        }
        if (!Number(pvhinta) || pvhinta === null || pvhinta === undefined || pvhinta <= 0) {
            return false;
        }
        if (Number(tila) || tila === null || tila === undefined || tila == "") {
            return false;
        }
    },

    isValidEdit(id, kuvaus, hinta, postnum, tila){
        if (!Number(id) || id === null || id === undefined || id <= 0) {
            return false;
        }

        if (!(/^[0-9]+$/).test(postnum) || postnum === null || postnum === undefined) {
            return false;
        }        
        if (kuvaus === null || kuvaus === undefined) {
            return false;
        }
        if (!Number(hinta) || hinta === null || hinta === undefined || hinta <= 0) {
            return false;
        }
        if (Number(tila) || tila === null || tila === undefined) {
            return false;
        }
        return true;
    }
}
