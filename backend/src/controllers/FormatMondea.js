
  function formatearMoneda(valor, moneda = 'USD', idioma = 'en-US') {
    try {
        return new Intl.NumberFormat(idioma, {
            style: 'currency',
            currency: moneda,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(valor);
    } catch (error) {
      return  console.log("error");
  }
}
module.exports = formatearMoneda;