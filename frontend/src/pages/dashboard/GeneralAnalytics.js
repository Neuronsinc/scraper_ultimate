// material
import { DataGrid } from '@material-ui/data-grid';
import { es } from 'date-fns/locale';
import { useSnackbar } from 'notistack5';
import { useState, useEffect, useCallback } from 'react';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
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

const pricesD = [
  { value: 0, label: '$0' },
  { value: 25, label: '25' },
  { value: 50, label: '500' },
  { value: 75, label: '750' },
  { value: 100, label: '1000' }
];

// ----------------------------------------------------------------------
export default function GeneralAnalytics() {
  const varlink = `${process.env.REACT_APP_APIBACKEND}/precios-filtro`;
  console.log('el link es: ', varlink);
  // Obtener los precios
  const [precios, setPrecios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`${process.env.REACT_APP_APIBACKEND}/precios-filtro`)
        .then((response) => {
          // actualizar el estado con los datos de respuesta
          setPrecios(response.data);
        })
        .catch((error) => {
          // manejar el error∫
          console.error(error);
        });
    };

    fetchData();
  }, []);
  console.log(precios.quetzales);

  // VALORES EN QUETZLES
  const pricesQ = precios.quetzales;
  const ultimoValorQ =
    precios.quetzales && precios.quetzales.length > 0 ? precios.quetzales[precios.quetzales.length - 1].value : 0;
  const valor2Q = precios.quetzales && precios.quetzales.length > 1 ? precios.quetzales[1].value : 0;
  const valor4Q = precios.quetzales && precios.quetzales.length > 3 ? precios.quetzales[3].value : 0;

  console.log(valor2Q);

  // VALORES EN DOLARES
  const pricesD = precios.dolares;
  const ultimoValorD =
    precios.dolares && precios.dolares.length > 0 ? precios.dolares[precios.dolares.length - 1].value : 0;
  const valor2D = precios.dolares && precios.dolares.length > 1 ? precios.dolares[1].value : 0;
  const valor4D = precios.dolares && precios.dolares.length > 3 ? precios.dolares[3].value : 0;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`${process.env.REACT_APP_APIBACKEND}/datos-mongo`)
        .then((response) => {
          // actualizar el estado con los datos de respuesta
          setData(response.data);
        })
        .catch((error) => {
          // manejar el error∫
          console.error(error);
        });
    };

    fetchData();
  }, []);
  // Swich para activar filto
  const [actifiltro, setIsChecked] = useState(false);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const activos = actifiltro;
  console.log(`DESEA ACTIVAR EL FILTRO?: ${actifiltro}`);

  // -----RANGO DE FECHA
  const [valueF, setValueF] = useState([null, null]);

  const fechaInicialFormateada = valueF[0]
    ? valueF[0]
        .toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        })
        .split('/')
        .map((part) => part.padStart(2, '0'))
        .join('/')
    : '';

  const fechaFinalFormateada = valueF[1]
    ? valueF[1]
        .toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        })
        .split('/')
        .map((part) => part.padStart(2, '0'))
        .join('/')
    : '';

  console.log(`${fechaInicialFormateada} - ${fechaFinalFormateada}`);
  // Multiples categorias

  // --------- BUSQUDA DE CATEGORIAS
  const [multiplesValues, setMultiplesValues] = useState([]);
  const [categoriass, setCategoriass] = useState([]);

  const valuescategorias = (event, values) => {
    setMultiplesValues(values.map((value) => value.title));
  };

  useEffect(() => {
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
      .filter((item) => !multiplesValues.includes(item.title)); // Filter out selected categories

    setCategoriass(formatcategories);
  }, [data, multiplesValues]);

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
    fetch(`${process.env.REACT_APP_APIBACKEND}/filtracion`, {
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

  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (reset) {
      setValueF([null, null]);
      setReset(false);
    }
  }, [reset]);

  const handleReset = () => {
    setReset(true);
  };

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
          <Grid sx={{ padding: '17px' }} item xs={4}>
            <Stack sx={{ width: '100%', padding: '17px' }} spacing={3} direction="row">
              <Button className="btns" variant="outlined">
                Exportar
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <SliderDan
              moneda="Rango de precios -"
              steep="1"
              pricesD={pricesD}
              ultimo={ultimoValorD}
              valor2={valor2D}
              valor4={valor4D}
              simbol="$"
              funcion="handleChangePriceD"
            />
          </Grid>
          <Grid item xs={6}>
            <SliderDan
              moneda="Rango de precios -"
              steep="1"
              pricesD={pricesQ}
              ultimo={ultimoValorQ}
              valor2={valor2Q}
              valor4={valor4Q}
              simbol="Q"
              funcion="handleChangePriceQ"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid className="div-filtro" item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
              <DateRangePicker
                startText="Fecha de inicio"
                endText="Fecha fin"
                value={valueF}
                inputFormat="dd/MM/yyyy"
                onChange={(newValue) => {
                  setValueF(newValue);
                }}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} format="dd/MM/yyyy" />
                    <Box sx={{ mx: 2 }}>a</Box>
                    <TextField {...endProps} format="dd/MM/yyyy" />
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid className="div-filtro" item xs={4}>
            <Autocomplete
              multiple
              fullWidth
              options={categoriass}
              getOptionLabel={(option) => (option && option.title ? option.title : '')}
              onChange={valuescategorias}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label="Seleccione una categoría" placeholder="Apartamentos, casas..." />
              )}
            />
          </Grid>
          <Grid className="div-filtro" sx={{ textAlign: 'center' }} xs={4}>
            <FormControlLabel
              value="start"
              label="Filtro de búsqueda"
              labelPlacement="start"
              control={<Switch checked={actifiltro} onChange={handleSwitchChange} />}
            />
            <Button id="btnreset" variant="contained" sx={{ marginLeft: '50px' }} onClick={handleReset}>
              Resetear
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {data && (
              <Box id="si-filtro" sx={{ height: '120vh', padding: '0px', paddingTop: '20px', width: '100%' }}>
                <ConsultaDataFiltro
                  tablaresult={data}
                  activo={activos}
                  fechainicio={fechaInicialFormateada}
                  fechafin={fechaFinalFormateada}
                  categories={multiplesValues}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
