const gatewa = require("../models/gatway.js");

const preciosfiltro = async (req, res, next) => {
  try {
    const precios = await gatewa.find({ "Precio:": { $exists: true } }, { "Precio:": 1, _id: 0 });
const preciosQ = [];
const preciosDolares = [];
let minQ = Number.MAX_VALUE;
let maxQ = Number.MIN_VALUE;
let minDolares = Number.MAX_VALUE;
let maxDolares = Number.MIN_VALUE;

precios.forEach(precio => {
  const esQ = typeof precio["Precio:"] === 'string' && precio["Precio:"].startsWith('Q');
  const valor = parseFloat(precio["Precio:"].replace(/[^0-9.]/g, ''));
  
  if (esQ) {
    preciosQ.push(valor);
    minQ = Math.min(minQ, valor);
    maxQ = Math.max(maxQ, valor);
  } else {
    preciosDolares.push(valor);
    minDolares = Math.min(minDolares, valor);
    maxDolares = Math.max(maxDolares, valor);
  }
});
console.log('VALOR MAXIMO Q: ' + maxQ);
const preciosQLabels = [
  { value: Math.round(((maxQ - minQ)*0.25)), label: `${((maxQ - minQ)*0.25).toLocaleString('es-MX', { minimumFractionDigits: 0 })}` },
  { value: Math.round(((maxQ - minQ)*0.5)), label: `${((maxQ - minQ)*0.5).toLocaleString('es-MX', { minimumFractionDigits: 0 })}` },
  { value: Math.round(((maxQ - minQ)*0.75)), label: `${((maxQ - minQ)*0.75).toLocaleString('es-MX', { minimumFractionDigits: 0 })}` },
  { value: Math.round(maxQ), label: `${maxQ.toLocaleString('es-MX', { minimumFractionDigits: 0 })}` }
];
if (minQ > 0 && !preciosQLabels.some(item => item.value === 0)) {
  preciosQLabels.unshift({ value: 0, label: 'Q0.00' });
}

const preciosDolaresLabels = [
  { value: Math.round(((maxDolares - minDolares)*0.25)), label: `$${(Math.round(((maxDolares - minDolares)*0.25)).toLocaleString('es-MX', { minimumFractionDigits: 2 }))}` },
  { value: Math.round(((maxDolares - minDolares)*0.5)), label: `$${(Math.round(((maxDolares - minDolares)*0.5)).toLocaleString('es-MX', { minimumFractionDigits: 2 }))}` },
  { value: Math.round(((maxDolares - minDolares)*0.75)), label: `$${(Math.round(((maxDolares - minDolares)*0.75)).toLocaleString('es-MX', { minimumFractionDigits: 2 }))}` },
  { value: Math.round(maxDolares), label: `${(Math.round(maxDolares).toLocaleString('es-MX', { minimumFractionDigits: 2 }))}` }
];
    if (minDolares > 0) {
      preciosDolaresLabels.unshift({ value: 0, label: '$0' });
    }

    const send = {
      quetzales: preciosQLabels,
      dolares: preciosDolaresLabels,
    };
    res.send(send);
    return;
  } catch (error) {
    return res.send("error en consulta: " + error);
  }
};

module.exports = {
	preciosfiltro,
  }