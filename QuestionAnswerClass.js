//This script is intended to create a Question and answer class
class QuestionAnswer {
    constructor( question, answer, qEnc = "span", aEnc = "soan") {
        this._question = question.substring(1).trim();
        this._answer = answer.substring(1).trim();
        this._qEnc = qEnc.trim();
        this._aEnc = aEnc.trim();
    }


    get question() {
        return "<" + this._qEnc + ">" + this._question + "</" + this._qEnc + ">";
    }

    get answer() {
        return "<" + this._aEnc + ">" + this._answer + "</" + this._aEnc + ">";
    }

    get qEnc() {
        return this._qEnc;
    }

    get aEnc() {
        return this._aEnc;
    }

    set question(value) {
        this._question = value;
    }

    set answer(value) {
        this._answer = value;
    }

    set qEnc(value) {
        this._qEnc = value;
    }

    set aEnc(value) {
        this._aEnc = value;
    }
}
