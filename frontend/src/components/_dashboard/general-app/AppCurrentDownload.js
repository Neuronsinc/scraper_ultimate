import { merge } from 'lodash';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader, CircularProgress } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

export default function AppCurrentDownload(props) {
  const [datos, setPercent] = useState(0);
  const [cargando, setTotalDownload] = useState(0);

  useEffect(() => {
    // Aquí puedes realizar acciones adicionales cuando las props cambien
    setPercent(props.datos);
    setTotalDownload(props.cargando);
  }, [props.datos, props.cargando]);

  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.lighter,
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.primary.dark
    ],
    labels: Object.keys(datos).slice(3),
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (val) => fNumber(val)
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              }
            }
          }
        }
      }
    }
  });
  const CHART_DATA = Object.values(datos).slice(3);
  return (
    <Card>
      <CardHeader title="Otras categorías" />
      <ChartWrapperStyle className="basecontent" dir="ltr">
        {cargando ? (
          <CircularProgress className="lodings" color="success" />
        ) : (
          <ReactApexChart type="donut" series={CHART_DATA} options={chartOptions} height={280} />
        )}
      </ChartWrapperStyle>
    </Card>
  );
}
