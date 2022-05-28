import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

// T9 : Trigonometry
var id = "Triangle?";
var name = "Trigonometry";
var description = "Trigonometry, talks about sin() cos() tan() and more!";
var authors = "Skyhigh173#3120";
var version = 1;

var currency1;
var a1, a2;
var a3, a4, a3Term, a4Term;
var q, k, vdt;
var x = BigNumber.ZERO;
var dotrho, div;

var init = () => {
    currency1 = theory.createCurrency();
    
    // Regular upgrades
    
    // a1
    {
        let getDesc = (level) => "a_1=2^{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency1, new FirstFreeCost(new ExponentialCost(5, Math.log2(3.8))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
    // a2
    {
        let getDesc = (level) => "a_2=2^{" + level + "}";
        let getInfo = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency1, new ExponentialCost(100, Math.log2(4)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount));
    }
    // q
    {
        let getDesc = (level) => "q=" + getQ(level);
        q = theory.createUpgrade(2, currency1, new ExponentialCost(10, Math.log2(5)));
        q.getDescription = (_) => Utils.getMath(getDesc(q.level));
        q.getInfo = (amount) => Utils.getMathTo(getDesc(q.level), getDesc(q.level + amount));
    }
    /* x
    {
        let getDesc = (level) => "x=e \\times " + getX(level).toString(0);
        let getInfo = (level) => "x=" + getX(level).toString(0);
        x = theory.createUpgrade(3, currency, new ExponentialCost(100, Math.log2(2.3)));
        x.getDescription = (_) => Utils.getMath(getDesc(x.level));
        x.getInfo = (amount) => Utils.getMathTo(getInfo(x.level), getInfo(x.level + amount));
    }
    */
    // k
    {
        let getDesc = (level) => "k=" + getK(level).toString(2);
        let getInfo = (level) => "k=" + getK(level).toString(2);
        k = theory.createUpgrade(4, currency1, new ExponentialCost(100, Math.log2(90)));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getInfo(k.level), getInfo(k.level + amount));
        k.maxLevel = 20;
        // k = -0 -> k = 1 (step = 0.05)
    }
     // vdt
    {
        let getDesc = (level) => "\\vartheta =" + getDT(level).toString(0);
        vdt = theory.createUpgrade(5, currency1, new ExponentialCost(25, Math.log2(16)));
        vdt.getDescription = (_) => Utils.getMath(getDesc(vdt.level));
        vdt.getInfo = (amount) => Utils.getMathTo(getDesc(vdt.level), getDesc(vdt.level + amount));
    }
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency1, 1e10);
    theory.createBuyAllUpgrade(1, currency1, 1e13);
    theory.createAutoBuyerUpgrade(2, currency1, 1e30);
    
    updateAvailability();
}
var updateAvailability = () => {
    
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    // bignumber setup
    let bf = (num) => BigNumber.from(num);
    let bpi = BigNumber.PI;
    
    x += bf(0.1) * dt;
    div = bf(1);
    // if x is greater then vdt*pi/4, it grows by x^2 not sin(x).
    if (x > getDT(vdt.level) * bpi / bf(4)) div = (x - getDT(vdt.level) * bpi / bf(4)).pow(bpi);
    else div = x.sin();
    let div2 = div.abs() + BigNumber.TEN.pow(bf(0) - getK(k.level)); //10^(-k)
    
    
    let Q = getQ(q.level);
    let upTerm = getA1(a1.level) * Q + getA2(a2.level) * Q.pow(bf(2));
    dotrho = upTerm / div2 / bf(6);
    currency1.value += dotrho * bonus * dt;
    theory.invalidateTertiaryEquation();
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 90;
    let result = "\\dot{\\rho} = \\frac{a_1 q + a_2 q^{2}}{\\mid \\varrho \\mid + 10^{-k}}"
    return result;
}

var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 80;
    let result = "\\varrho = \\sum_{n=0}^{\\vartheta} \\frac{(-1)^{n} x^{2n+1}}{(2n+1)!}";
    return result;
}
var getTertiaryEquation = () => {
    let r = theory.latexSymbol + "=\\max\\rho";
    r += "\\qquad x =" + x;
    r += "\\qquad \\dot{\\rho} =" + dotrho;
    r += "\\qquad \\varrho =" + div;
    return r;
}

var postPublish = () => {
    x = BigNumber.ZERO;
}

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency1.value;
var get2DGraphValue = () => currency1.value.sign * (BigNumber.ONE + currency1.value.abs()).log10().toNumber();


var getA1 = (level) => BigNumber.TWO.pow(level);
var getA2 = (level) => BigNumber.TWO.pow(level);
var getQ = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getK = (level) => BigNumber.from(level * 0.05);
var getDT = (level) => BigNumber.from(10 * level + 8);
init();
