import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { sample } from 'lodash';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
// material
import { useTheme } from '@material-ui/core/styles';
import { Stack, Typography, Box, Rating, Pagination, LinearProgress, IconButton } from '@material-ui/core';
import {
  DataGrid,
  GridToolbar,
  useGridSlotComponentProps,
  getGridNumericColumnOperators
} from '@material-ui/data-grid';
// utils
import createAvatar from '../../utils/createAvatar';
import { fPercent } from '../../utils/formatNumber';
import mockData from '../../utils/mock-data';
// components
import Label from '../../components/Label';
import { MIconButton, MAvatar } from '../../components/@material-extend';

// ----------------------------------------------------------------------

function CustomPagination() {
  const { state, apiRef } = useGridSlotComponentProps();

  return (
    <Pagination
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

RatingInputValue.propTypes = {
  applyValue: PropTypes.func.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any
  }).isRequired
};

function RatingInputValue({ item, applyValue }) {
  return (
    <Box sx={{ p: 1, height: 1, alignItems: 'flex-end', display: 'flex' }}>
      <Rating
        size="small"
        precision={0.5}
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={(event, newValue) => {
          applyValue({ ...item, value: newValue });
        }}
      />
    </Box>
  );
}

export default function ConsultaDataFiltro(props) {
  const [minimoQ, setMinimoQ] = useState(0);
  const [maximoQ, setMaximoQ] = useState(0);
  const [minimoD, setMinimoD] = useState(0);
  const [maximoD, setMaximoD] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const minQ = document.getElementById('preciomin-Q');
      const maxQ = document.getElementById('preciomax-Q');
      const minD = document.getElementById('preciomin-$');
      const maxD = document.getElementById('preciomax-$');

      if (minQ !== null) {
        setMinimoQ(minQ.textContent.trim());
      }
      if (maxQ !== null) {
        setMaximoQ(maxQ.textContent.trim());
      }
      if (minD !== null) {
        setMinimoD(minD.textContent.trim());
      }
      if (maxD !== null) {
        setMaximoD(maxD.textContent.trim());
      }
    }, 1000); // cambia el intervalo si deseas actualizar los valores con mayor o menor frecuencia

    return () => clearInterval(interval);
  }, []);

  const { tablaresult, activo } = props;
  let data = tablaresult;
  const [rangoprecio, setRangoprecio] = useState([]);

  useEffect(() => {
    const filtrodata = async () => {
      const filtrodata = {
        preciominQ: minimoQ,
        preciomaxQ: maximoQ,
        preciominD: minimoD,
        preciomaxD: maximoD
      };
      axios
        .post(`${process.env.REACT_APP_APIBACKEND}/rango-precios`, filtrodata)
        .then((response) => {
          console.log('DATA FILTRO:', response.datosfiltros);
          setRangoprecio(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    filtrodata();
  }, [minimoQ, maximoQ, minimoD, maximoD]);
  console.log('RESPUESTA API PRECIOS:  ---', rangoprecio.preciomaxD);
  const formatteMinimoQ = rangoprecio.preciominQ
    ? `Q${rangoprecio.preciominQ.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`
    : '';
  const formattemaximoQ = rangoprecio.preciomaxQ
    ? `Q${rangoprecio.preciomaxQ.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`
    : '';
  const formatteMminimoD = rangoprecio.preciominD
    ? `$${Number(rangoprecio.preciominD)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`
    : '';
  const formatteMximoD = rangoprecio.preciomaxD
    ? `$${Number(rangoprecio.preciomaxD)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`
    : '';

  console.log(formatteMinimoQ, '', formattemaximoQ); // Q10,000,000
  console.log(formatteMminimoD, '', formatteMximoD); // Q10,000,000

  if (activo) {
    const precioInicioQ = formatteMinimoQ;
    const precioFinQ = formattemaximoQ;
    const precioInicioD = formatteMminimoD;
    const precioFinD = formatteMximoD;

    data = data.filter((item) => {
      const precio = item['Precio:'];
      if (precio) {
        const precioNum = precio;
        if (precio.startsWith('Q')) {
          const precioInicioQNum = precioInicioQ;
          const precioFinQNum = precioFinQ;
          return precioNum >= precioInicioQNum && precioNum <= precioFinQNum;
        }
        if (precio.startsWith('$')) {
          const precioInicioDNum = precioInicioD;
          const precioFinDNum = precioFinD;
          return precioNum >= precioInicioDNum && precioNum <= precioFinDNum;
        }
      }
      return false;
    });
  }
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  console.log('data es: ', data);
  const timeout = 20000;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (data.length === 0) {
        enqueueSnackbar(
          <div>
            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
              Error datos
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Intente de nuevo o contacte a soporte
            </Typography>
          </div>,
          {
            variant: 'error',
            autoHideDuration: null, // cierra automáticamente después de 3 segundos
            action: (key) => (
              <IconButton size="small" color="inherit" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} width={24} height={24} />
              </IconButton>
            ),
            preventDuplicate: true
          }
        );
      } else {
        console.log('Si hay datos');
      }
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [data, enqueueSnackbar, closeSnackbar, timeout]);

  function convertDate(dateStr) {
    if (!dateStr) {
      return '';
    }
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  let latestDate = null;

  for (let i = 0; i < data.length; i += 1) {
    const dateStr = data[i]['Publicado:'];
    const convertedDateStr = convertDate(dateStr);
    const date = Date.parse(convertedDateStr);

    if (!Number.isNaN(date) && (latestDate === null || date > latestDate)) {
      latestDate = date;
    }
  }
  // Añadir un ID único a cada elemento de la tabla
  data.forEach((item, index) => {
    item.id = index + 1;
  });

  const startDate = props.fechainicio ? new Date(props.fechainicio.split('/').reverse().join('-')) : null;
  const endDate = props.fechafin ? new Date(props.fechafin.split('/').reverse().join('-')) : null;

  const filteredData =
    startDate && endDate
      ? data.filter((item) => {
          const dateStr = item['Publicado:'];
          if (!dateStr) return false; // Si el campo está vacío, no se filtra
          const date = new Date(dateStr.split('/').reverse().join('-'));
          return date >= startDate && date <= endDate;
        })
      : data;

  const hasDatesInColumn = filteredData.length > 0;
  const handleClick = () => {
    document.getElementById('btnreset').click();
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    handleClick();
    setSnackbarOpen(false);
  };

  console.log(startDate, endDate);
  useEffect(() => {
    if (!hasDatesInColumn && startDate !== null && endDate !== null && startDate !== '' && endDate !== '') {
      const color = 'warning';
      const anchor = {
        vertical: 'top',
        horizontal: 'center'
      };

      // Check if snackbar is already open
      if (!snackbarOpen) {
        enqueueSnackbar(
          <div className="alertas">
            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
              Rango de Fecha inválido
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              última fecha hasta{' '}
              {latestDate
                ? new Date(latestDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : 'N/A'}
            </Typography>
          </div>,
          {
            variant: color,
            onClose: handleSnackbarClose,
            anchorOrigin: anchor,
            action: (key) => (
              <IconButton
                size="small"
                color="inherit"
                onClick={() => {
                  handleClick();
                  closeSnackbar(key);
                }}
              >
                <Icon icon={closeFill} width={24} height={24} />
              </IconButton>
            )
          }
        );
        setSnackbarOpen(true);
      }
    }
  }, [hasDatesInColumn, startDate, endDate, latestDate, enqueueSnackbar, closeSnackbar, handleClick, snackbarOpen]);
  const filteredDataByCategory =
    props.categories.length > 0
      ? filteredData.filter((item) => props.categories.includes(item['Categoria:']))
      : filteredData;
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'cat', headerName: 'Categoría', width: 230 },
    { field: 'local', headerName: 'Localización', width: 220 },
    { field: 'publi', headerName: 'Publicado', width: 230 },
    { field: 'price', headerName: 'precio', width: 230 },
    { field: 'prmt', headerName: 'Precio/M² de terreno:', width: 260 },
    { field: 'tmlot', headerName: 'Tamaño del Lote m²:', width: 260 },
    { field: 'habt', headerName: 'Habitaciones:', width: 260 },
    { field: 'alt', headerName: 'Altura:', width: 260 },
    { field: 'm2', headerName: 'Metros 2:', width: 260 },
    { field: 'Niveles', headerName: 'Niveles:', width: 260 }
  ];

  // Mapear los elementos de la tabla filtrados a una nueva variable "rows"
  const rowes = filteredDataByCategory.map((item) => ({
    id: item.id,
    cat: item['Categoria:'],
    local: item['Localización:'],
    price: item['Precio:'],
    publi: item['Publicado:'],
    prmt: item['Precio/M² de terreno:'],
    tmlot: item['Tamaño del Lote m²:'],
    habt: item['Habitaciones:'],
    alt: item['Altura:'],
    m2: item['m²:'],
    Niveles: item['Niveles:']
  }));

  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Aquí puedes hacer la llamada a la API o cargar los datos de alguna otra manera
    // Cuando los datos se hayan cargado, actualiza el estado de loading a false
    // y el estado de dataLoaded a true
    // Si la carga falla, también deberías actualizar el estado de dataLoaded a true
    const fetchData = async () => {
      try {
        // Cargar los datos aquí
        setRows(rowes);
        setLoading(false);
        setDataLoaded(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchData();
  }, []);

  // ----------------------------------------------------------------------
  if (columns.length > 0) {
    const ratingColumn = columns.find((column) => column.field === 'rating');
    const ratingColIndex = columns.findIndex((col) => col.field === 'rating');

    const ratingFilterOperators = getGridNumericColumnOperators().map((operator) => ({
      ...operator,
      InputComponent: RatingInputValue
    }));

    columns[ratingColIndex] = {
      ...ratingColumn,
      filterOperators: ratingFilterOperators
    };
  }

  return (
    <Box id="no-filtro" sx={{ height: '120vh', padding: '2px', paddingTop: '15px', width: '100%' }}>
      {(loading || !dataLoaded) && <LinearProgress color="success" />}
      {!loading && dataLoaded && rowes.length === 0 && (
        <LinearProgress sx={{ padding: '3px', textAlign: 'center', margin: 'auto', width: '70%' }} color="success" />
      )}

      {!loading && dataLoaded && rowes.length > 0 && (
        <DataGrid
          checkboxSelection
          disableSelectionOnClick
          rows={rowes}
          columns={columns}
          pagination
          pageSize={50}
          components={{
            Toolbar: GridToolbar,
            Pagination: CustomPagination
          }}
        />
      )}
    </Box>
  );
}
