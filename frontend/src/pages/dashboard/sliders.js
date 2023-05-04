// material
import { useState } from 'react';
import { Box, Slider, Typography } from '@material-ui/core';
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
  const [priceD, setPriceD] = useState([25, 75]);
  const [priceQ, setPriceQ] = useState([25, 75]);
  const [selectedSlider, setSelectedSlider] = useState('priceD');
  const handleChangePrice = (event, newValue) => {
    if (propi.simbol === 'Q') {
      setPriceQ(newValue);
      setSelectedSlider('priceQ');
    } else if (propi.simbol === '$') {
      setPriceD(newValue);
      setSelectedSlider('priceD');
    }
  };

  let precio;
  if (selectedSlider === 'priceD') {
    precio = priceD;
  } else {
    precio = priceQ;
  }
  console.log(`${propi.simbol + valuePriceD(precio[0])},000.00`);
  console.log(`${propi.simbol + valuePriceD(precio[1])},000.00`);
  const monedar = ',000.00';
  return (
    <Box sx={{ paddingTop: '0px', width: '100%' }}>
      <Block title={propi.moneda + propi.simbol} sx={style}>
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
          />
        </Box>
        <Box
          sx={{
            p: 2,
            width: '100%',
            borderRadius: 1,
            bgcolor: 'grey.50012'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Min: {propi.simbol + valuePriceD(precio[0]) + monedar}
          </Typography>
          <Typography variant="subtitle2">Max: {propi.simbol + valuePriceD(precio[1]) + monedar}</Typography>
        </Box>
      </Block>
    </Box>
  );
}
