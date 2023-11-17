
import { Card, Grid, Stack, Tooltip } from '@material-ui/core';
import { DateRangeOutlined, MapOutlined, HomeOutlined } from '@material-ui/icons';
import { useSelector } from 'react-redux';


export default function FilterCard(props) {
    function formatDate(date) {
        const d = new Date(date);
        let month = `${(d.getMonth() + 1)}`;
        let day = `${d.getDate()}`;
        const year = d.getFullYear();

        if (month.length < 2)
            month = `0${month}`;
        if (day.length < 2)
            day = `0${day}`;

        return [day, month, year].join('/');
    }

    const handleCategories = (categories) => {

        if (categories.length === 2) {
            let twocat = `${categories[0]},${categories[1]}...`

            if (twocat.length - 3 > 18) {
                twocat = `${categories[0]}...`
                const allcat = categories.join(',')
                return (
                    <Tooltip title={allcat}>
                        <p>{twocat}</p>
                    </Tooltip>
                )
            }
        }

        if (categories.length > 2) {
            let twocat = `${categories[0]},${categories[1]}...`

            if (twocat.length - 3 > 18) {
                twocat = `${categories[0]}...`
            }
            const allcat = categories.join(',')
            return (
                <Tooltip title={allcat}>
                    <p>{twocat}</p>
                </Tooltip>
            )
        }
        return categories.join(',')
    }

    const fechas = useSelector(state => state.date.D)
    const { actualFilter }  = props
    
    const filteredDataByCategory =
        props.categorias.length > 0
            ? props.data.filter((item) => props.categorias.includes(item.categoria))
            : props.data;

    const filteredDataByLocation = props.ubicacion
        ? filteredDataByCategory.filter((item) => item.localizacion === props.ubicacion)
        : filteredDataByCategory;

    const filteredDataBysemana = props.semanar
        ? filteredDataByLocation.filter((item) => item.semana === props.semanar)
        : filteredDataByLocation;


    const rowes = filteredDataBysemana?.map((item) => ({
        id: item.id,
        cat: item.categoria,
        publi: item.fecha_publicacion,
        local: item.localizacion,
        price: item.precio,
        rebaja: item.rebaja,
        prmt: item.precio_m2_construccion,
        habt: item.habitaciones,
        dire: item.direccion,
        m2: item.m2_construccion,
        piso: item.piso,
        conta: item.contacto,
        lat: item.lat,
        lng: item.lng,
        semana: item.semana
    }));

    function extractValue(priceString) {
        const numericValue = parseFloat(priceString.replace(/[^\d.]/g, ''));
        return numericValue;
    }

    // Initialize variables for max and min values
    let maxQValue = -Infinity;
    let minQValue = Infinity;
    let maxDollarValue = -Infinity;
    let minDollarValue = Infinity;

    // Iterate through the array to find max and min values for both currencies
    if (rowes !== undefined) {
        rowes.forEach(pri => {
            const { price } = pri;
            const numericValue = extractValue(price);

            if (price.includes("Q")) {
                maxQValue = Math.max(maxQValue, numericValue);
                minQValue = Math.min(minQValue, numericValue);
            } else if (price.includes("$")) {
                maxDollarValue = Math.max(maxDollarValue, numericValue);
                minDollarValue = Math.min(minDollarValue, numericValue);
            }
        });
    }

    function formatNumber(num) {
        let  ret = ''

        if (num >= 1000000000) {
            ret = `${(num / 1000000000).toFixed(1)}B`;
        }else if (num >= 1000000) {
            ret =  `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
          ret = `${(num / 1000).toFixed(1)}k`;
        } else {
            ret = num
        }
        return ret.toString();
      }

    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Grid container spacing={2} alignItems="center" justifyContent="center" ml={1}>
                <Grid item xs>
                    <Grid>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Grid>
                                <MapOutlined style={{ fontSize: 36, color: '259e3f' }} />
                            </Grid>
                            <Grid>
                                <h5 style={{ fontWeight: "normal" }}>Consulta para:</h5>
                                <h3>{props.ubicacion === "" ? "---" : props.ubicacion}</h3>
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item xs>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Grid>
                            <HomeOutlined style={{ fontSize: 36, color: '2B8AE5' }} />
                        </Grid>
                        <Grid>
                            <h5 style={{ fontWeight: "normal" }}>Categoría</h5>
                            <h3>{props.categorias.length === 0 ? "---" : handleCategories(props.categorias)}</h3>
                        </Grid>

                    </Stack>
                </Grid>
                <Grid item xs>
                    <div className="title-item" style={{ height: '100%' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Grid>
                                <h5 style={{ fontWeight: "normal" }}>min</h5>
                                <h3>Q{minQValue !== Infinity ? formatNumber(minQValue) : 0}</h3>
                                <h3>${minDollarValue !== Infinity ? formatNumber(minDollarValue) : 0}</h3>
                            </Grid>
                            <Grid>
                                <h5 style={{ fontWeight: "normal" }}>máx</h5>
                                <h3>Q{maxQValue !== -Infinity ? formatNumber(maxQValue) : 0}</h3>
                                <h3>${maxDollarValue !== -Infinity ? formatNumber(maxDollarValue) : 0}</h3>
                            </Grid>
                        </Stack>
                    </div>
                </Grid>
                <Grid item xs>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Grid>
                            <DateRangeOutlined style={{ fontSize: 36, color: '62C6FF' }} />
                        </Grid>
                        <Grid>
                            <h5 style={{ fontWeight: "normal" }}>Fecha de consulta</h5>
                            <h4>{`${formatDate(actualFilter.D[0])} - ${formatDate(actualFilter.D[1])}`}</h4>
                        </Grid>

                    </Stack>
                </Grid>
            </Grid>
        </Card>
    )
}