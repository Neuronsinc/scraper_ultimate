// material
import { DataGrid } from '@material-ui/data-grid';
import { useSnackbar } from 'notistack5';
import { useState, useEffect, useCallback } from 'react';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { DateRangePicker } from '@material-ui/lab';
//
import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  Container,
  LinearProgress,
  Stack,
  Button,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import axios from 'axios';
import { MIconButton } from '../../components/@material-extend';
import './estilos.css';
// hooks
// components
import Page from '../../components/Page';
import TablaDatos from './TablaDatos';
import TablaDatosTotal from './TablaDatosTotal';
import ConsultaDataFiltro from './ConsultaDataFiltro';
import SliderDan from './sliders';
// ----------------------------------------------------------------------

const pricesQ = [
  { value: 0, label: 'Q0' },
  { value: 25, label: '25' },
  { value: 50, label: '500' },
  { value: 75, label: '750' },
  { value: 100, label: '1000' }
];
const pricesD = [
  { value: 0, label: '$0' },
  { value: 25, label: '25' },
  { value: 50, label: '500' },
  { value: 75, label: '750' },
  { value: 100, label: '1000' }
];

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  // Swich para activar filto
  const [actifiltro, setIsChecked] = useState(false);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };

  console.log(`DESEA ACTIVAR EL FILTRO?: ${actifiltro}`);

  // -----RANGO DE FECHA
  const [valueF, setValueF] = useState([null, null]);

  const fechaInicialFormateada = valueF[0]
    ? valueF[0].toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })
    : '';

  const fechaFinalFormateada = valueF[1]
    ? valueF[1].toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })
    : '';

  console.log(`${fechaInicialFormateada} - ${fechaFinalFormateada}`);

  // ----------------
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

  // --------- BUSQUDA DE CATEGORIAS
  const categories = [];

  data.forEach((items) => {
    if (items['Categoria:'] && !categories.includes(items['Categoria:'])) {
      categories.push(items['Categoria:']);
    }
  });

  const formatcategories = categories
    .map((categori) => {
      try {
        return {
          title: categori,
          year: null
        };
      } catch (error) {
        console.log(`Error al formatear la categoría ${categori}: ${error}`);
        return null;
      }
    })
    .filter((item) => item !== null);

  const categoriass = formatcategories;
  // -----------------------------------

  // --------- BUSQUDA DE LOCALIZACION
  const localizaciones = [];

  data.forEach((items) => {
    if (items['Localización:'] && !localizaciones.includes(items['Localización:'])) {
      localizaciones.push(items['Localización:']);
    }
  });

  const formattedlocalizaciones = localizaciones.map((categorys) => ({
    title: categorys,
    year: null // o el valor que quieras asignarle
  }));
  const top100Films = formattedlocalizaciones;
  // -----------------------------------
  // --------- BUSQUDA DE LOCALIZACION
  const habitaciones = [];

  data.forEach((items) => {
    if (items['Categoria:'] && !habitaciones.includes(items['Categoria:'])) {
      habitaciones.push(items['Categoria:']);
    }
  });

  console.log(`Que buena data [${habitaciones}]`);
  const formattedhabitaciones = habitaciones.map((categorys) => ({
    title: `${categorys}`,
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

  const rowes = data.map((item) => ({
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

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Aquí puedes hacer la llamada a la API o cargar los datos de alguna otra manera
    // Cuando los datos se hayan cargado, actualiza el estado de loading a false
    setTimeout(() => {
      setRows(rowes);
      setLoading(false);
    }, 2500);
  }, []);
  console.log('rowes acá: ', rows);

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
            <TablaDatos
              moneda="Q"
              textmoneda="Quetzales"
              cantunidades={respuesta && respuesta.cantidadQuetzales ? respuesta.cantidadQuetzales : '0'}
              preciopromedioQ={respuesta && respuesta.quetzalesQ ? respuesta.quetzalesQ : '0'}
              preciopromedioD={respuesta && respuesta.quetzalesD ? respuesta.quetzalesD : '0'}
              areapromedio={respuesta && respuesta.areadioQuetzales ? respuesta.areadioQuetzales : '0'}
            />
          </Grid>
          <Grid item xs={5} md={4}>
            <TablaDatos
              moneda="$"
              textmoneda="Dólares"
              cantunidades={respuesta && respuesta.cantidadDolares ? respuesta.cantidadDolares : '0'}
              preciopromedioQ={respuesta && respuesta.dolarD ? respuesta.dolarQ : '0'}
              preciopromedioD={respuesta && respuesta.dolarD ? respuesta.dolarD : '0'}
              areapromedio={respuesta && respuesta.areaDolares ? respuesta.areaDolares : '0'}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TablaDatosTotal
              totalcantidades={respuesta && respuesta.totalcantidades ? respuesta.totalcantidades : '0'}
              preciopromedio={respuesta && respuesta.total ? respuesta.total : '0'}
              totaarea={respuesta && respuesta.totalarea ? respuesta.totalarea : '0'}
            />
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
                renderInput={(params) => <TextField {...params} label="Categorías" margin="none" />}
              />
            </Box>
          </Grid>
          <Grid sx={{ padding: '17px' }} item xs={12} sm={6} md={4}>
            <Stack sx={{ width: '100%', padding: '17px' }} spacing={3} direction="row">
              <Button className="btns" variant="outlined">
                Exportar
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <SliderDan
              moneda="Rango de precios -"
              steep="1"
              pricesD={pricesD}
              simbol="$"
              funcion="handleChangePriceD"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <SliderDan
              moneda="Rango de precios -"
              steep="1"
              pricesD={pricesQ}
              simbol="Q"
              funcion="handleChangePriceD"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid className="div-filtro" item xs={12} sm={12} md={4}>
            <DateRangePicker
              startText="Fecha de inicio"
              endText="Fecha fin"
              value={valueF}
              format="DD/MM/YYYY"
              onChange={(newValue) => {
                setValueF(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} format="DD/MM/YYYY" />
                  <Box sx={{ mx: 2 }}>a</Box>
                  <TextField {...endProps} format="DD/MM/YYYY" />
                </>
              )}
            />
          </Grid>
          <Grid className="div-filtro" item xs={6} sm={6} md={6}>
            {categoriass.length > 0 && (
              <Autocomplete
                multiple
                fullWidth
                options={categoriass}
                getOptionLabel={(option) => (option && option.title ? option.title : '')}
                defaultValue={[categoriass[1]]}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField {...params} label="filterSelectedOptions" placeholder="Favorites" />
                )}
              />
            )}
          </Grid>
          <Grid className="div-filtro" item xs={6} sm={6} md={2}>
            <FormControlLabel
              value="start"
              label="Filtro de búsqueda"
              labelPlacement="start"
              control={<Switch checked={actifiltro} onChange={handleSwitchChange} />}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={12}>
            {actifiltro ? (
              <Box id="si-filtro" sx={{ height: '120vh', padding: '13px', paddingTop: '20px', width: '100%' }}>
                <ConsultaDataFiltro />
              </Box>
            ) : (
              <Box id="no-filtro" sx={{ height: '120vh', padding: '13px', paddingTop: '20px', width: '100%' }}>
                {loading && <LinearProgress color="success" />}
                {!loading && rowes.length === 0 && <p>No se encontraron datos</p>}
                {!loading && rowes.length > 0 && (
                  <DataGrid
                    rows={rowes}
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
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
