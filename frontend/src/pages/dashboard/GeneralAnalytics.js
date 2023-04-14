// material
import { DataGrid } from '@material-ui/data-grid';
import { useSnackbar } from 'notistack5';
import { useState, useEffect, useCallback } from 'react';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import {
  Box,
  Grid,
  Slider,
  Card,
  TextField,
  Autocomplete,
  Container,
  Typography,
  Stack,
  Button
} from '@material-ui/core';
import axios from 'axios';
import { Block } from '../components-overview/Block';
import { MIconButton } from '../../components/@material-extend';
import './estilos.css';
// hooks
// components
import Page from '../../components/Page';
// ----------------------------------------------------------------------

const pricesQ = [
  { value: 0, label: 'Q0' },
  { value: 25, label: '250' },
  { value: 50, label: '500' },
  { value: 75, label: '750' },
  { value: 100, label: '1000' }
];
const pricesD = [
  { value: 0, label: '$0' },
  { value: 25, label: '250' },
  { value: 50, label: '500' },
  { value: 75, label: '750' },
  { value: 100, label: '1000' }
];

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '8px !important' }
};

// ----------------------------------------------------------------------

function valuePriceD(value) {
  return value > 0 ? `$${value}0` : value;
}

function valueLabelFormatPriceD(value) {
  return value > 0 ? `$${value}` : value;
}
function valuePriceQ(value) {
  return value > 0 ? `Q${value}0` : value;
}

function valueLabelFormatPriceQ(value) {
  return value > 0 ? `Q${value}` : value;
}

export default function GeneralAnalytics() {
  const [priceQ, setPriceQ] = useState([25, 75]);
  const [priceD, setPriceD] = useState([25, 75]);

  const handleChangePriceQ = (event, newValue) => {
    setPriceQ(newValue);
  };
  const handleChangePriceD = (event, newValue) => {
    setPriceD(newValue);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get('http://localhost:8080/datos-mongo')
        .then((response) => {
          // actualizar el estado con los datos de respuesta
          console.log('esto es la data:', response.data);
          setData(response.data);
        })
        .catch((error) => {
          // manejar el error∫
          console.error(error);
        });
    };

    fetchData();
  }, []);

  // --------- BUSQUDA DE LOCALIZACION
  const localizaciones = [];

  data.forEach((items) => {
    if (items['Localización:'] && !localizaciones.includes(items['Localización:'])) {
      localizaciones.push(items['Localización:']);
    }
  });

  console.log(`Que buena data [${localizaciones}]`);
  const formattedlocalizaciones = localizaciones.map((categorys) => ({
    title: categorys,
    year: null // o el valor que quieras asignarle
  }));
  const top100Films = formattedlocalizaciones;
  // -----------------------------------
  // --------- BUSQUDA DE LOCALIZACION
  const habitaciones = [];

  data.forEach((items) => {
    if (items['Habitaciones:'] && !habitaciones.includes(items['Habitaciones:'])) {
      habitaciones.push(items['Habitaciones:']);
    }
  });

  console.log(`Que buena data [${habitaciones}]`);
  const formattedhabitaciones = habitaciones.map((categorys) => ({
    title: `${categorys} habitaciones`,
    Number: categorys // o el valor que quieras asignarle
  }));
  const listhabitaciones = formattedhabitaciones;
  // -----------------------------------

  data.forEach((item, index) => {
    item.id = index + 1;
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'cat', headerName: 'Categoría', width: 230 },
    { field: 'publi', headerName: 'Publicado', width: 230 },
    { field: 'local', headerName: 'Localización', width: 220 },
    { field: 'price', headerName: 'precio', width: 130 },
    { field: 'prmt', headerName: 'Precio/M² de terreno:', width: 260 },
    { field: 'tmlot', headerName: 'Tamaño del Lote m²:', width: 260 },
    { field: 'habt', headerName: 'Habitaciones:', width: 260 },
    { field: 'alt', headerName: 'Altura:', width: 260 },
    { field: 'm2', headerName: 'Metros 2:', width: 260 },
    { field: 'Niveles', headerName: 'Niveles:', width: 260 }
  ];

  const rows = data.map((item) => ({
    id: item.id,
    cat: item['Categoria:'],
    publi: item['Publicado:'],
    local: item['Localización:'],
    price: item['Precio:'],
    prmt: item['Precio/M² de terreno:'],
    tmlot: item['Tamaño del Lote m²:'],
    habt: item['Habitaciones:'],
    alt: item['Altura:'],
    m2: item['m²:'],
    Niveles: item['Niveles:']
  }));
  // ENVIAR POST PARA FILTRAR
  const [respuesta, setRespuesta] = useState(null);
  const [localizacionValue, setlocalizacionValue] = useState('');

  const localizacionAutocompleteChange = (event, value) => {
    setlocalizacionValue(value ? value.title : '');
  };

  const [habitacionesValue, sethabitacionesValue] = useState('');

  const habitacionesAutocompleteChange = (event, value) => {
    sethabitacionesValue(value ? value.Number : '');
  };
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  function myFunction(data) {
    enqueueSnackbar(data.notifi, {
      variant: 'success',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  }
  const enviarSolicitud = useCallback(() => {
    fetch('http://localhost:8080/filtracion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ localizacion: localizacionValue, habitaciones: habitacionesValue })
    })
      .then((response) => response.json())
      .then((data) => {
        setRespuesta(data);
        // Llamar a la función que deseas ejecutar cada vez que se reciba una respuesta
        myFunction(data);
      })
      .catch((error) => console.error(error));
  }, [localizacionValue, habitacionesValue]);

  useEffect(() => {
    enviarSolicitud();
  }, [enviarSolicitud]);
  return (
    <Page title="General: Analytics | dataSracper">
      <Container maxWidth="100%">
        <Grid container spacing={3}>
          <Grid item xs={5} md={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <table>
                <thead>
                  <tr>
                    <th className="title-item">
                      <h1>Q</h1>
                    </th>
                    <th>
                      <div className="titlebox">Unidades que aparecen documentados en Quetzales</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="item-s">Cantidad de unidades</td>
                    <td>
                      <h3 style={{ textAlign: 'center' }}>
                        {respuesta && respuesta.cantidadQuetzales ? respuesta.cantidadQuetzales : '0'}
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td className="item-s">Precio promedio</td>
                    <td>
                      <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                        <p className="quetzal">{respuesta && respuesta.quetzalesQ ? respuesta.quetzalesQ : '0'}</p>
                      </div>
                      <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                        <p className="dolar">{respuesta && respuesta.quetzalesD ? respuesta.quetzalesD : '0'}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="item-s">Precio por M2</td>
                    <td>
                      <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                        <p className="quetzal">Q 1,273,000</p>
                      </div>
                      <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                        <p className="dolar"> $ 163,205 </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="item-s">Área promedio</td>
                    <td style={{ textAlign: 'center' }}>
                      {respuesta && respuesta.areadioQuetzales ? respuesta.areadioQuetzales : '0'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Grid>
          <Grid item xs={5} md={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <table>
                <thead>
                  <tr>
                    <th className="title-item">
                      <h1>$</h1>
                    </th>
                    <th>
                      <div className="titlebox">Unidades que aparecen documentados en Dólares</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="item-s">Cantidad de unidades</td>
                    <td>
                      <h3 style={{ textAlign: 'center' }}>
                        {respuesta && respuesta.cantidadDolares ? respuesta.cantidadDolares : '0'}
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td className="item-s">Precio promedio</td>
                    <td>
                      <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                        <p className="dolar">{respuesta && respuesta.dolarD ? respuesta.dolarQ : '0'}</p>
                      </div>
                      <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                        <p className="dolar">{respuesta && respuesta.dolarD ? respuesta.dolarD : '0'}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="item-s">Precio por M2</td>
                    <td>
                      <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                        <p className="quetzal">Q 1,273,000</p>
                      </div>
                      <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                        <p className="dolar"> $ 163,205 </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="item-s">Área promedio</td>
                    <td style={{ textAlign: 'center' }}>
                      {respuesta && respuesta.areaDolares ? respuesta.areaDolares : '0'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Grid>
          <Grid item xs={4} md={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <table>
                <thead>
                  <tr>
                    <th>Total de unidades ofertados</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="totalResul">
                        <h1 style={{ textAlign: 'center' }}>
                          {respuesta && respuesta.totalcantidades ? respuesta.totalcantidades : '0'}
                        </h1>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="total-des">
                      <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                        <p className="item-s">Precio promedio</p>
                      </div>
                      <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                        <p className="dolar-total">{respuesta && respuesta.total ? respuesta.total : '0'} </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                        <p className="item-s">Precio por M2</p>
                      </div>
                      <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                        <p className="dolar-total">$233453443</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                        <p className="item-s">Total Área</p>
                      </div>
                      <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                        <p className="dolar-total">{respuesta && respuesta.totalarea ? respuesta.totalarea : '0'}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ padding: '17px', width: '100%' }}>
              <Autocomplete
                fullWidth
                options={top100Films}
                onChange={localizacionAutocompleteChange}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => <TextField {...params} label="Localización" margin="none" />}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ padding: '17px', width: '100%' }}>
              <Autocomplete
                fullWidth
                options={listhabitaciones}
                onChange={habitacionesAutocompleteChange}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => <TextField {...params} label="Habitaciones" margin="none" />}
              />
            </Box>
          </Grid>
          <Grid sx={{ padding: '17px' }} item xs={12} sm={6} md={4}>
            <Stack sx={{ width: '100%', padding: '17px' }} spacing={3} direction="row">
              <Button className="btns" variant="outlined">
                Exportar XLS
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box sx={{ paddingTop: '0px', width: '100%' }}>
              <Block title="Rango de precios - Q" sx={style}>
                <Box sx={{ width: '100%' }}>
                  <Slider
                    scale={(x) => x * 10}
                    step={1}
                    marks={pricesQ}
                    value={priceQ}
                    onChange={handleChangePriceQ}
                    valueLabelDisplay="on"
                    getAriaValueText={valuePriceQ}
                    valueLabelFormat={valueLabelFormatPriceQ}
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
                    Min: {valuePriceQ(priceQ[0])}
                  </Typography>
                  <Typography variant="subtitle2">Max: {valuePriceQ(priceQ[1])}</Typography>
                </Box>
              </Block>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box sx={{ paddingTop: '0px', width: '100%' }}>
              <Block title="Rango de precios - $USD" sx={style}>
                <Box sx={{ width: '100%' }}>
                  <Slider
                    scale={(x) => x * 10}
                    step={1}
                    marks={pricesD}
                    value={priceD}
                    onChange={handleChangePriceD}
                    valueLabelDisplay="on"
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
                    Min: {valuePriceD(priceD[0])}
                  </Typography>
                  <Typography variant="subtitle2">Max: {valuePriceD(priceD[1])}</Typography>
                </Box>
              </Block>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={12}>
            <Box sx={{ height: '120vh', padding: '13px', paddingTop: '20px', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5
                    }
                  }
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
