// material
import { Container, Grid, TextField, Box, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// hooks
import { DateRangePicker } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { changeDates } from '../../redux/slices/Dates';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';

// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppTotalDownloads,
  AppTotalInstalled,
  AppCurrentDownload,
  AppTotalActiveUsers
} from '../../components/_dashboard/general-app';
import { EcommerceYearlySales } from '../../components/_dashboard/general-ecommerce';
import DatePicker from '../components/DatePicker';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const dispatch = useDispatch();
  const fechas = useSelector(state => state.date.D)
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [val, setVal] = useState([]);
  const [consultadash, setData] = useState([]);
  const [seriesData, setSeriesData] = useState(2023);

  console.log("ACA EL VAL =>>>>>", val)

  const fetchData = async () => {
    if (consultadash.length !== 0) {
      setData([])
    }
    axios
      .get(`${process.env.REACT_APP_APIBACKEND}/consulta-dashbord`, {
        params: {
          inicio: fechas[0],
          fin: fechas[1]
        }
      })
      .then((response) => {
        // actualizar el estado con los datos de respuesta

        setData(response.data);
        setSeriesData(Math.max.apply(null, response.data.map((o) => o.year)))
      })
      .catch((error) => {
        // manejar el error∫
        console.error(error);
      });
  };


  const GetCategorias = () => {
    if (resultados !== null) {
      setCargando(true);
      setResultados([]);
    }
    axios
      .get(`${process.env.REACT_APP_APIBACKEND}/suma-categorias`, {
        params: {
          inicio: fechas[0],
          fin: fechas[1]
        }
      })
      .then((response) => {
        setResultados(response.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al obtener los resultados:', error);
        setCargando(false);
      });
  }

  useEffect(() => {
    if (fechas[0].toString() !== "Invalid Date" && fechas[1].toString() !== "Invalid Date") {
      GetCategorias();
      fetchData();
    }
  }, [fechas]);
  const countApartamento = resultados.Apartamentos;
  const porcentApartamento = (countApartamento / 100).toFixed(2);
  const countCasas = resultados.Casas;
  const porcentCasas = (countCasas / 100).toFixed(2);
  const countLotes = resultados['Lotes y Terrenos'];
  const porcentLotes = (countLotes / 100).toFixed(2);
  console.log(user.id);
  return (
    <Page title="General: App | dataSracper">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user.displayName} />
          </Grid>
          <DatePicker val={val} setVal={setVal} fechas={fechas} sxV={{ mb: 2, ml: 3 }} />
          <Grid item xs={12} md={4}>
            <AppTotalActiveUsers porcent={porcentApartamento} count={countApartamento} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalInstalled porcent={porcentCasas} count={countCasas} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalDownloads porcent={porcentLotes} count={countLotes} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload cargando={cargando} datos={resultados} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceYearlySales consultadash={consultadash} seriesData={seriesData} setSeriesData={setSeriesData} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
