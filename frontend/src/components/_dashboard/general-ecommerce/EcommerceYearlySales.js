import { merge } from 'lodash';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    year: 2019,
    data: [
      { name: 'Casa', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
      { name: 'Apartamento', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
      { name: 'Apartamento', data: [13, 24, 13, 46, 75, 58, 99, 34, 45] },
      { name: 'Apartamento', data: [14, 24, 13, 56, 77, 34, 99, 34, 45] },
      { name: 'Apartamento', data: [15, 54, 17, 55, 77, 88, 39, 77, 45] },
      { name: 'Apartamento', data: [12, 66, 53, 56, 77, 88, 99, 77, 45] },
      { name: 'Apartamento', data: [45, 65, 17, 66, 77, 88, 99, 77, 45] }
    ]
  },
  {
    year: 2020,
    data: [
      { name: 'Casa', data: [198, 41, 35, 151, 49, 62, 69, 91, 48] },
      { name: 'Apartamento', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
      { name: 'lotes y terrnos', data: [98, 24, 98, 46, 75, 58, 99, 34, 45] },
      { name: 'propiedades en la playa', data: [14, 24, 13, 56, 77, 34, 99, 34, 45] },
      { name: 'Apartamento', data: [15, 54, 17, 98, 77, 98, 39, 77, 45] },
      { name: 'Apartamento', data: [12, 66, 53, 56, 77, 88, 9, 77, 45] },
      { name: 'Apartamento', data: [45, 65, 98, 66, 78, 88, 9, 8, 45] }
    ]
  }
];

export default function EcommerceYearlySales() {
  const [seriesData, setSeriesData] = useState(2019);

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    }
  });

  return (
    <Card>
      <CardHeader
        title="Total Categorías"
        subheader="(+43%) than last year"
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
