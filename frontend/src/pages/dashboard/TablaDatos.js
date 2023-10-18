import PropTypes from 'prop-types';
import { Card, Grid } from '@material-ui/core';

TablaDatos.propTypes = {
  moneda: PropTypes.string,
  textmoneda: PropTypes.string,
  cantunidades: PropTypes.number,
  preciopromedioQ: PropTypes.number,
  preciopromedioD: PropTypes.number,
  areapromedio: PropTypes.number
};
export default function TablaDatos(props) {
  const iddato = `tabla-${props.moneda}`;
  return (
    <Card id={iddato} sx={{ display: 'flex', alignItems: 'center', p: 3, flexDirection: 'column', width: '100%' }}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid item xs={4}>
          <div className="title-item" style={{ height: '100%' }}>
            <h1>{props.moneda}</h1>
          </div>
        </Grid>
        <Grid item xs={8}>
          <div className="titlebox">Unidades que aparecen documentados en {props.textmoneda}</div>
        </Grid>
        <Grid item xs={12}>
          <h5>Cantidad de unidades</h5>
        </Grid>
        <Grid item xs={12}>
          <h3 style={{ textAlign: 'center' }}>{typeof props.cantunidades !== 'object' ? Number(props.cantunidades).toLocaleString('en-US', { style: 'decimal' }) : 0}</h3>
        </Grid>
        <Grid item xs={12}>
          <h5>Precio promedio</h5>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <div style={{ float: 'left', width: '100%'}}>
            <p className="quetzal">{props.preciopromedioQ}</p>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <div style={{ float: 'right', width: '100%'}}>
            <p className="dolar">{props.preciopromedioD}</p>
          </div>
        </Grid>
        <Grid item xs={12}>
          <h5>Precio por m²</h5>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <div style={{ float: 'left', width: '100%' }}>
            <p className="quetzal">{props.preciopromedioQm2}</p>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <div style={{ float: 'right', width: '100%' }}>
            <p className="dolar">{props.preciopromedioDm2}</p>
          </div>
        </Grid>
        <Grid item xs={12}>
          <h5>Área promedio</h5>
        </Grid>
        <Grid item xs={12}>
          <h3 style={{ textAlign: 'center' }}>{typeof props.areapromedio !== 'object' ? `${String(Number((props.areapromedio).split(' ')[0]).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }))} ${(props.areapromedio).split(' ')[1]}` : ''}</h3>
        </Grid>
      </Grid>
    </Card>
  );
}
