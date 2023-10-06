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
import Skeleton from '@mui/material/Skeleton';
import html2pdf from 'html2pdf.js';
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
import { useDispatch, useSelector } from 'react-redux';
import { changeDates } from '../../redux/slices/Dates';
import { MIconButton } from '../../components/@material-extend';
import './estilos.css';
// hooks
// components
import Page from '../../components/Page';
import TablaDatos from './TablaDatos';
import TablaDatosTotal from './TablaDatosTotal';
import ConsultaDataFiltro from './ConsultaDataFiltro';
import SliderDan from './sliders';
import DatePicker from '../components/DatePicker';
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
  const dispatch = useDispatch()
  const varlink = `${process.env.REACT_APP_APIBACKEND}/precios-filtro`;
  const fechas = useSelector(state => state.date.D)

  // Obtener los precios
  const [precios, setPrecios] = useState([]);
  const [val, setVal] = useState([]);

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

  // VALORES EN QUETZLES
  const pricesQ = precios.quetzales;
  const ultimoValorQ =
    precios.quetzales && precios.quetzales.length > 0 ? precios.quetzales[precios.quetzales.length - 1].value : 0;
  const valor2Q = precios.quetzales && precios.quetzales.length > 1 ? precios.quetzales[1].value : 0;
  const valor4Q = precios.quetzales && precios.quetzales.length > 3 ? precios.quetzales[3].value : 0;

  // VALORES EN DOLARES
  const pricesD = precios.dolares;
  const ultimoValorD =
    precios.dolares && precios.dolares.length > 0 ? precios.dolares[precios.dolares.length - 1].value : 0;
  const valor2D = precios.dolares && precios.dolares.length > 1 ? precios.dolares[1].value : 0;
  const valor4D = precios.dolares && precios.dolares.length > 3 ? precios.dolares[3].value : 0;
  const [data, setData] = useState([]);

  // Swich para activar filto
  const [actifiltro, setIsChecked] = useState(false);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const activos = actifiltro;

  // -----RANGO DE FECHA
  const [valueF, setValueF] = useState([null, null]);

  const fetchData = async (val = null) => {
    const Fechas = val || fechas
    if (Fechas[0].toString() !== "Invalid Date" && Fechas[1].toString() !== "Invalid Date") {
      if (val) {
        dispatch(changeDates(val));
      }
      if (data.length !== 0) {
        setData([]);
      }
      axios
        .get(`${process.env.REACT_APP_APIBACKEND}/datos-mongo-new`, {
          params: {
            inicio: Fechas[0],
            fin: Fechas[1]
          }
        })
        .then((response) => {
          // actualizar el estado con los datos de respuesta
          setData(response.data);
        })
        .catch((error) => {
          // manejar el error∫
          console.error(error);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  // Multiples categorias

  // --------- BUSQUDA DE CATEGORIAS
  const [multiplesValues, setMultiplesValues] = useState([]);
  const [categoriass, setCategoriass] = useState([]);

  const valuescategorias = (event, values) => {
    const categorias = values.map((value) => value.title);
    setMultiplesValues(categorias);
    const categories = categorias;
    if (categories.length === 0) {
      sethabitacionesValue(null);
    } else {
      sethabitacionesValue(categories);
    }
  };

  useEffect(() => {
    const categories = [];

    data.forEach((items) => {
      if (items.categoria && !categories.includes(items.categoria)) {
        categories.push(items.categoria);
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
    if (items.localizacion && !localizaciones.includes(items.localizacion)) {
      localizaciones.push(items.localizacion);
    }
  });
  const formattedlocalizaciones = localizaciones.map((categorys) => ({
    title: categorys,
    year: null // o el valor que quieras asignarle
  }));
  const top100Films = formattedlocalizaciones;
  const semanas = [];

  data.forEach((item) => {
    if (item.semana && !semanas.includes(item.semana)) {
      semanas.push(item.semana);
    }
  });

  const formattedSemanas = semanas.map((semana) => ({
    title: semana,
    year: null // o el valor que quieras asignarle
  }));

  const optSemanas = formattedSemanas;

  // -----------------------------------

  // --------- BUSQUDA DE LOCALIZACION
  const habitaciones = [];

  data.forEach((items) => {
    if (items.categoria && !habitaciones.includes(items.categoria)) {
      habitaciones.push(items.categoria);
    }
  });

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
    { field: 'dire', headerName: 'Dirección:', width: 260 },
    { field: 'm2', headerName: 'Metros 2:', width: 260 },
    { field: 'piso', headerName: 'Niveles:', width: 260 }
  ];

  const rowes = data.map((item) => ({
    id: item.id,
    cat: item.categoria,
    publi: item.fecha_publicacion,
    local: item.localizacion,
    price: item.precio,
    prmt: item.precio_m2_construccion,
    habt: item.habitaciones,
    dire: item.direccion,
    m2: item.precio_m2_construccion,
    piso: item.piso
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

  // ENVIAR POST PARA FILTRAR
  const [respuesta, setRespuesta] = useState(null);
  const [localizacionValue, setlocalizacionValue] = useState('');
  const [resultSemana, setsemanaValue] = useState('');

  const localizacionAutocompleteChange = (event, value) => {
    setlocalizacionValue(value ? value.title : '');
  };

  const semanaAutocompleteChange = (event, value) => {
    setsemanaValue(value ? value.title : '');
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
    if (fechas[0].toString() !== "Invalid Date" && fechas[1].toString() !== "Invalid Date") {
      fetch(`${process.env.REACT_APP_APIBACKEND}/filtracion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ localizacion: localizacionValue, habitaciones: habitacionesValue, inicio: fechas[0], fin: fechas[1] })
      })
        .then((response) => response.json())
        .then((data) => {
          setRespuesta(data);
          // Llamar a la función que deseas ejecutar cada vez que se reciba una respuesta
          myFunction(data);
        })
        .catch((error) => console.error(error));
    }
  }, [localizacionValue, habitacionesValue]);

  const enviarS = () => {
    const Fechas = val || fechas
    if (Fechas[0].toString() !== "Invalid Date" && Fechas[1].toString() !== "Invalid Date") {
      if (val) {
        dispatch(changeDates(val));
      }
      if (respuesta !== null) {
        setRespuesta(null);
      }
      fetch(`${process.env.REACT_APP_APIBACKEND}/filtracion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ localizacion: localizacionValue, habitaciones: habitacionesValue, inicio: Fechas[0], fin: Fechas[1] })
      })
        .then((response) => response.json())
        .then((data) => {
          setRespuesta(data);
          // Llamar a la función que deseas ejecutar cada vez que se reciba una respuesta
          myFunction(data);
        })
        .catch((error) => console.error(error));
    }
  }

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
  // GENERAR PDF
  const handleGeneratePDF = () => {
    const elementToPrintq = document.getElementById('tabla-Q');

    // Crear un clon del elemento para aplicar los estilos del tema claro
    const clonedElementq = elementToPrintq.cloneNode(true);

    // Aplicar los estilos para el tema claro en el clon
    clonedElementq.style.backgroundColor = '#ffffff';
    clonedElementq.style.color = '#000000';

    // Crear un contenedor temporal y agregar el clon al mismo
    const datoQ = document.createElement('div');
    datoQ.appendChild(clonedElementq);
    const elementToPrintd = document.getElementById('tabla-$');

    // Crear un clon del elemento para aplicar los estilos del tema claro
    const clonedElementd = elementToPrintd.cloneNode(true);

    // Aplicar los estilos para el tema claro en el clon
    clonedElementd.style.backgroundColor = '#ffffff';
    clonedElementd.style.color = '#000000';

    // Crear un contenedor temporal y agregar el clon al mismo
    const datoD = document.createElement('div');
    datoD.appendChild(clonedElementd);
    const elementToPrinttotal = document.getElementById('totaldato');

    // Crear un clon del elemento para aplicar los estilos del tema claro
    const clonedElementtotal = elementToPrinttotal.cloneNode(true);

    // Aplicar los estilos para el tema claro en el clon
    clonedElementtotal.style.backgroundColor = '#ffffff';
    clonedElementtotal.style.color = '#000000';

    // Crear un contenedor temporal y agregar el clon al mismo
    const datototal = document.createElement('div');
    datototal.appendChild(clonedElementtotal);
    const html = `<html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <div style="padding: 40px;" class="head">
        <table>
          <tr>
            <th class="logo">
              <img
                class="imglogo"
                src="/static/logos/logo_datascrap.png"
                alt=""
              />
            </th>
            <th></th>
            <th class="reportes">
              <h1 class="Report">
                <p></p>
                <h1 class="dat">
                  <p style="color: #000; padding-bottom: 10px;">Reporte de:</p>
                  <p class="nam">${localizacionValue === '' ? 'Datos generales' : localizacionValue}</p>
                </h1>
              </h1>
            </th>
          </tr>
        </table>
      </div>
      <div style="padding: 20px;" class="datos">
        <div class="datoq">${datototal.innerHTML}</div>
        <div class="datoq">${datoD.innerHTML}</div>
        <div class="datoq">${datoQ.innerHTML}</div>
      </div>
    </body>
    <style>
      img.imglogo {
        width: 100%;
      }
      th.logo {
        width: 329px;
      }
      .Report p {
        font-size: 17pt;
        font-family: sans-serif;
      }
      .datoq {
        padding: 22px;
        border-radius: 10px;
        margin-bottom: 20px;
        background: #f1f1f1;
      }
      .datos {
        margin: auto;
        width: 92%;
        padding: 0px;
      }
      .nam {
        color: #11b041;
        padding: 10px;
        border-radius: 10px;
        margin: auto;
        background: #efefef;
        font-weight: 700;
      }
      .Report {
        display: flex;
      }
      body {
        padding: 11px;
      }
      .Report p {
        text-align: center;
        width: 100%;
      }
      h1.dat {
        font-size: 17pt;
        font-family: sans-serif;
      }
      table {
        width: 100%;
      }
      .Report {
        width: 100%;
        display: flex;
        text-align: end !important;
      }
      .head {
        display: flex;
      }
      th.reportes {
        width: 286px;
      }
      img.imglogo {
        padding: 11px;
      }
    </style>
  </html>
  `;

    // Generar el PDF a partir del contenedor temporal
    const options = {
      filename: 'REPORTE-SCRAPER.pdf',
      margin: 0,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 6, // A mayor escala, mejores gráficos, pero más peso
        letterRendering: true,
        useCORS: false
      },
      jsPDF: {
        unit: 'in',
        format: 'a3',
        orientation: 'portrait' // landscape o portrait
      }
    };

    html2pdf().set(options).from(html).save();
  };
  return (
    <Page title="General: Analytics | dataSracper">
      <Container maxWidth="100%">
        <DatePicker val={val} setVal={setVal} fechas={fechas} sxV={{ mb: 2 }} functions={[fetchData, enviarS]}/>
        <Grid className="component-table" container spacing={3}>
          <Grid className="component-boxing" item xs={5} md={4}>
            <TablaDatos
              moneda="Q"
              textmoneda="Quetzales"
              cantunidades={
                respuesta && respuesta.cantidadQuetzales ? (
                  respuesta.cantidadQuetzales
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={70} height={18} />
                )
              }
              preciopromedioQ={
                respuesta && respuesta.quetzalesQ ? (
                  respuesta.quetzalesQ
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
              preciopromedioD={
                respuesta && respuesta.quetzalesD ? (
                  respuesta.quetzalesD
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
              preciopromedioQm2={
                respuesta && respuesta.quetzalesQm2 ? (
                  respuesta.quetzalesQm2
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
              preciopromedioDm2={
                respuesta && respuesta.quetzalesDm2 ? (
                  respuesta.quetzalesDm2
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
              areapromedio={
                respuesta && respuesta.areadioQuetzales ? (
                  respuesta.areadioQuetzales
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
            />
          </Grid>
          <Grid className="component-boxing" item xs={5} md={4}>
            <TablaDatos
              moneda="$"
              textmoneda="Dólares"
              cantunidades={
                respuesta && respuesta.cantidadDolares ? (
                  respuesta.cantidadDolares
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={70} height={18} />
                )
              }
              preciopromedioQ={
                respuesta && respuesta.dolarQ ? (
                  respuesta.dolarQ
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
              preciopromedioD={
                respuesta && respuesta.dolarD ? (
                  respuesta.dolarD
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
              preciopromedioQm2={
                respuesta && respuesta.dolarQm2 ? (
                  respuesta.dolarQm2
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
              preciopromedioDm2={
                respuesta && respuesta.dolarDm2 ? (
                  respuesta.dolarDm2
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
              areapromedio={
                respuesta && respuesta.areaDolares ? (
                  respuesta.areaDolares
                ) : (
                  <Skeleton animation="wave" style={{ margin: 'auto' }} variant="rounded" width={80} height={23} />
                )
              }
            />
          </Grid>
          <Grid className="component-boxing" item xs={4} md={4}>
            <TablaDatosTotal
              totalcantidades={
                respuesta && respuesta.totalcantidades ? (
                  respuesta.totalcantidades
                ) : (
                  <Skeleton style={{ margin: 'auto' }} variant="rounded" width={125} height={35} />
                )
              }
              preciopromedio={
                respuesta && respuesta.total ? (
                  respuesta.total
                ) : (
                  <Skeleton style={{ margin: 'auto' }} variant="rounded" width={80} height={16} />
                )
              }
              preciopromediom2={
                respuesta && respuesta.totalm2 ? (
                  respuesta.totalm2
                ) : (
                  <Skeleton style={{ margin: 'auto' }} variant="rounded" width={80} height={16} />
                )
              }
              totaarea={
                respuesta && respuesta.totalarea ? (
                  respuesta.totalarea
                ) : (
                  <Skeleton style={{ margin: 'auto' }} variant="rounded" width={80} height={16} />
                )
              }
            />
          </Grid>
        </Grid>

        <Grid className="component-table" container spacing={3}>
          <Grid className="component-boxing" item xs={12} sm={6} md={4}>
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
          <Grid className="component-boxing" item xs={12} sm={6} md={4}>
            <Box sx={{ padding: '17px', width: '100%' }}>
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
            </Box>
          </Grid>
          <Grid className="component-boxing" sx={{ padding: '17px' }} item xs={4}>
            <Stack sx={{ width: '100%', padding: '17px' }} spacing={3} direction="row">
              <Button onClick={handleGeneratePDF} className="btns component-boxing" variant="outlined">
                Exportar
              </Button>
            </Stack>
          </Grid>
          {/* 
<Grid className="component-boxing" item xs={6}>
  <SliderDan
    className="component-boxing"
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
<Grid className="component-boxing" item xs={6}>
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
*/}
        </Grid>
        <Grid className="component-table" container spacing={3}>
          <Grid className="div-filtro component-boxing" item xs={6}>
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
          {/** 
          <Grid className="div-filtro component-boxing" item xs={4}>
           
            <Autocomplete
              fullWidth
              options={optSemanas}
              onChange={semanaAutocompleteChange}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => <TextField {...params} label="Semana" margin="none" />}
              
            />
           
          </Grid>
          
          <Grid className="div-filtro component-boxing" sx={{ textAlign: 'center' }} xs={4}>
            <FormControlLabel
              value="start"
              label="Filtro de búsqueda"
              labelPlacement="start"
              control={<Switch checked={actifiltro} onChange={handleSwitchChange} />}
            />
           
          </Grid> 
          */}
          <Grid item xs={4}>
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
                  ubicacion={localizacionValue}
                  semanar={resultSemana}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
