import { Card } from '@material-ui/core';

export default function TablaDatosTotal(propss) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <table>
        <thead>
          <tr>
            <th>Total de unidades ofertados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="totalResul">
                <h1 style={{ textAlign: 'center' }}>{propss.totalcantidades}</h1>
              </div>
            </td>
          </tr>
          <tr>
            <td className="total-des">
              <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                <p className="item-s">Precio promedio</p>
              </div>
              <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                <p className="dolar-total">{propss.preciopromedio}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                <p className="item-s">Precio por M2</p>
              </div>
              <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                <p className="dolar-total">$233453443</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ float: 'left', width: '50%', padding: '5px' }}>
                <p className="item-s">Total Área</p>
              </div>
              <div style={{ float: 'right', width: '50%', padding: '5px' }}>
                <p className="dolar-total">{propss.totaarea}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
