import { Game } from "../api/Game";
import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { Theory } from "./Theory";
import { Utils } from "../api/Utils";
import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"

var id = "why";
var name = "UI-Simulator";
var description = "An implementation of the 'all UIs' theory from the game.";
var authors = "Gilles-Philippe Paillé, sky";
var version = 1;

var currency;
var prestige, reward, theory, publication;
var psPUP, rwPUP, tePUP, pbPUP;


var init = () => {
    currency = theory.createCurrency();
    currency.value = BigNumber.from(69420);
    
    // prestige
    {
        prestige = theory.createUpgrade(0, currency, new FreeCost());
        prestige.getDescription = (_) => "Open prestige Menu";
        prestige.getInfo = (amount) => "Open prestige Menu";
        prestige.boughtOrRefunded = (_) => {
            psPUP.show();
            prestige.level = 0;
        }
    }

}

var tick = (elapsedTime, multiplier) => {
    return;
}

var getPrimaryEquation = () => {
    return "\\rho = 69420";
}

var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

function getPrestigeText(txt) {
    if (txt == "db") return Game.db() + Game.b();
    if (txt == "mu") return Game.dmu() + Game.mu();
    if (txt == "psi") return Game.dpsi() + Game.psi();

psPUP = ui.createPopup({
    title: " ",
    content: ui.createStackLayout({
        children: [
            ui.createLabel({
                text: "Prestige",
                margin: new Thickness(8, 8),
                horizontalOptions: LayoutOptions.CENTER
            }),
            ui.createLabel({
                text: "After you Prestige, you will have:",
                horizontalOptions: LayoutOptions.CENTER
            }),
            ui.createGrid({
                columnDefinitions: ["25*", "50*", "75*"],
                rowDefinitions: ["50*", "50*"],
                children: [
                    ui.createLatexLabel({text: "$b$", row: 0, column: 0}),
                    ui.createLatexLabel({text: "$\\mu$", row: 0, column: 1}),
                    ui.createLatexLabel({text: "$\\psi$", row: 0, column: 2}),
                    ui.createLatexLabel({text: getPrestigeText("db"), row: 1, column: 0}),
                    ui.createLatexLabel({text: getPrestigeText("mu"), row: 1, column: 1}),
                    ui.createLatexLabel({text: "$0.00$", row: 1, column: 2})
                ]
            })