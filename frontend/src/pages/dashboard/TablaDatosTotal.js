import { Card, Grid } from '@material-ui/core';

export default function TablaDatosTotal(propss) {
  return (
    <Card id="totaldato" sx={{ display: 'flex', alignItems: 'center', p: 3, flexDirection: 'column', width: '100%' }}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid item xs={12}>
          <h5>Total de unidades ofertados</h5>
        </Grid>
        <Grid item xs={12}>
          <div className="totalResul">
          <h1 style={{ textAlign: 'center' }}>{typeof propss.totalcantidades !== 'object' ? Number(propss.totalcantidades).toLocaleString('en-US', { style: 'decimal' }) : 0}</h1>
          </div>
        </Grid>
        <Grid item xs={12}>
          <h5>Precio promedio</h5>
        </Grid>
        <Grid item xs={12}>
          <p className="dolar-total">{propss.preciopromedio}</p>
        </Grid>
        <Grid item xs={12}>
          <h5>Precio por m²</h5>
        </Grid>
        <Grid item xs={12}>
          <p className="dolar-total">{propss.preciopromediom2}</p>
        </Grid>
        <Grid item xs={12}>
          <h5>Total área</h5>
        </Grid>
        <Grid item xs={12}>
          <p className="dolar-total">{typeof propss.totalcantidades !== 'object' ? `${String(Number((propss.totaarea).split(' ')[0]).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }))} ${(propss.totaarea).split(' ')[1]}` : ''}</p>
        </Grid>
      </Grid>
    </Card>
  );
}
