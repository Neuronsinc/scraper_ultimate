import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';

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
    <Card id={iddato} sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <table>
        <thead>
          <tr>
            <th className="title-item">
              <h1>{props.moneda}</h1>
            </th>
            <th>
              <div className="titlebox">Unidades que aparecen documentados en {props.textmoneda}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="item-s">Cantidad de unidades</td>
            <td>
              <h3 style={{ textAlign: 'center' }}>{props.cantunidades}</h3>
            </td>
          </tr>
          <tr>
            <td className="item-s">Precio promedio</td>
            <td>
              <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                <p className="quetzal">{props.preciopromedioQ}</p>
              </div>
              <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                <p className="dolar">{props.preciopromedioD}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="item-s">Precio por M2</td>
            <td>
              <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                <p className="quetzal">{props.preciopromedioQm2}</p>
              </div>
              <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                <p className="dolar">{props.preciopromedioDm2}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="item-s">Área promedio</td>
            <td style={{ textAlign: 'center' }}>{props.areapromedio}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
