// material
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Slider, Typography, CircularProgress } from '@material-ui/core';
import { Block } from '../components-overview/Block';
import './estilos.css';
// hooks
// components

function valuePriceD(value) {
  return value > 0 ? `${value}` : value;
}

function valueLabelFormatPriceD(value) {
  return value > 0 ? `${value}` : value;
}
const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '8px !important' }
};

export default function SliderDan(propi) {
  const { simbol, valor2, valor4 } = propi;
  const [isLoading, setIsLoading] = useState(true); // estado para indicar si los datos están cargando
  const [priceQ, setPriceQ] = useState([]);
  const [priceD, setPriceD] = useState([]);
  const [selectedSlider, setSelectedSlider] = useState(simbol === 'Q' ? 'priceQ' : 'priceD');
  useEffect(() => {
    // hacer la consulta para obtener valor2 y valor4
    // cuando se reciban los datos, actualizar los estados y cambiar isLoading a false
    if (valor2 && valor4) {
      setPriceQ(simbol === 'Q' ? [valor2, valor4] : []);
      setPriceD(simbol === '$' ? [valor2, valor4] : []);
      setIsLoading(false);
    }
  }, [simbol, valor2, valor4]);

  const handleChangePrice = (event, newValue) => {
    if (simbol === 'Q') {
      setPriceQ(newValue);
      setSelectedSlider('priceQ');
    } else if (simbol === '$') {
      setPriceD(newValue);
      setSelectedSlider('priceD');
    }
  };

  if (isLoading) {
    return (
      <p className="alertaprecio">
        <p>
          <CircularProgress size={20} color="success" />
        </p>
        <p className="labelfp">Cargando fitro de precios...</p>
      </p>
    );
  }

  let precio;
  if (selectedSlider === 'priceD') {
    precio = priceD;
  } else {
    precio = priceQ;
  }

  const moneda = '';
  const resultadoPrecioMin = `${propi.simbol + valuePriceD(precio[0]) + moneda}`;
  const resultadoPrecioMax = `${propi.simbol + valuePriceD(precio[1]) + moneda}`;
  const resultadoPrecioMinval = `${valuePriceD(precio[0])}`;
  const resultadoPrecioMaxval = `${valuePriceD(precio[1])}`;

  return (
    <Box sx={{ paddingTop: '0px', width: '100%' }}>
      <Block title={propi.moneda + propi.simbol} sx={style}>
        {priceQ.length > 0 || priceD.length > 0 ? (
          <Box sx={{ width: '100%' }}>
            <Slider
              scale={(x) => x * 10}
              step={propi.steep}
              marks={propi.pricesD}
              value={precio}
              onChange={handleChangePrice}
              valueLabelDisplay="off"
              getAriaValueText={valuePriceD}
              valueLabelFormat={valueLabelFormatPriceD}
              max={propi.ultimo}
            />
          </Box>
        ) : (
          <p>Cargando datos...</p>
        )}
        <Box
          sx={{
            p: 2,
            width: '100%',
            borderRadius: 1,
            bgcolor: 'grey.50012'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Min: {resultadoPrecioMin}
          </Typography>
          <Typography variant="subtitle2">Max: {resultadoPrecioMax}</Typography>
          <Typography id={`preciomax-${simbol}`} variant="subtitle2">
            {resultadoPrecioMinval}
          </Typography>
          <Typography id={`preciomin-${simbol}`} variant="subtitle2">
            {resultadoPrecioMaxval}
          </Typography>
        </Box>
      </Block>
    </Box>
  );
}
