import { Grid, TextField, Box, Button, Stack, Autocomplete } from '@material-ui/core';
import { DateRangePicker } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { MIconButton } from '../../components/@material-extend';
import { UpdateFilter } from '../../redux/slices/filters';

export default function TopInputs({ vals, setVal, fechas, sxV, actualFilter }) {
    console.warn(actualFilter);
    const dispatch = useDispatch();
    const [paises, setPaises] = useState([]);
    const [selectedPais, setSelectedPais] = useState([]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    function myFunction(data, type) {
        enqueueSnackbar(data, {
            variant: type,
            action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill} />
                </MIconButton>
            )
        });
    }

    const validarFechas = (arr) => {
        console.error("ARRREGLO ", arr);
        const fecha1 = arr[0];
        const fecha2 = arr[1];

        if (!fecha1 || !fecha2) {
            return { message: "La fecha es vacia", valid: false };
        }

        if (fecha1?.toString() === "Invalid Date" || fecha2?.toString() === "Invalid Date") {
            return { message: "La Fecha es inválida", valid: false }
        }

        if (fecha1 > fecha2) {
            return { message: "Fecha inicial no puede ser mayor a la final", valid: false }
        }

        return { message: "", valid: true }

    }

    const handleDispatch = (val) => {
        if ((val.Fechas.length === 0 && actualFilter.D.length > 0) || (val.Pais.length === 0 && actualFilter.pais.length > 0)) {
            const copiaNuevo = { ...actualFilter };
            const f = val.Fechas.length === 0 ? actualFilter.D : val.Fechas
            const p = val.Pais.length === 0 ? actualFilter.pais : val.Pais
            dispatch(UpdateFilter({ ...copiaNuevo, D: f, pais: p }));
        } else {
            const validarF = validarFechas(val.Fechas);
            if (validarF.valid) {
                myFunction("Buscando datos", 'success');
                const copiaNuevo = { ...actualFilter };
                console.warn("ando en topInputs =>", copiaNuevo)
                dispatch(UpdateFilter({ ...copiaNuevo, D: val.Fechas, pais: val.Pais }));
            } else {
                myFunction(validarF.message, 'error');
            }
        }

    }

    const handlePais = (event, value) => {
        console.log(value)
        setSelectedPais(value)
    };

    useEffect(() => {
        // if (actualFilter.D[0].toString() === "Invalid Date" && actualFilter.D[1].toString() === "Invalid Date") {
        //     axios.get(`${process.env.REACT_APP_APIBACKEND}/fecha-max`)
        //         .then((res) => {
        //             const data = new Date(res.data[0].fecha_publicacion)
        //             const anioMax = data.getFullYear()
        //             const actual = [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)]
        //             if (actual[0].getFullYear() > anioMax) {
        //                 const f = [new Date(actual[0].setFullYear(anioMax)), new Date(actual[1].setFullYear(anioMax))];
        //                 dispatch(changeDates(f));
        //             } else {
        //                 dispatch(changeDates(actual));
        //             }
        //         })
        // }

        if (paises.length === 0) {
            axios.get(`${process.env.REACT_APP_APIBACKEND}/paises`)
                .then((res) => {
                    if (res.status === 200) {
                        const data = (res.data).map((val) => ({
                            title: val.Nombre,
                            id: val.id // o el valor que quieras asignarle
                        }));
                        setPaises(data);
                        setSelectedPais(data[0]);
                    }
                })
        }


    }, [])

    const handleSetVal = (type, newvalue) => {
        console.log(newvalue.map((value) => value.title));
        const copia = { ...vals };

        switch (type) {
            case 0: // Fecha
                setVal({ ...copia, Fechas: newvalue })
                break;
            case 1: // Pais
                setVal({ ...copia, Pais: newvalue })
                break;
            default:
                break;
        }
    }

    const handletest = (event, values) => {
        console.log(values);
    }

    return (
        <Grid container sx={sxV} justifyContent="flex-start" spacing={2}>
            <Grid className="component-boxing" item xs={12} sm={6} md={5}>
                <DateRangePicker
                    startText="Fecha de inicio"
                    endText="Fecha fin"
                    value={vals.Fechas.length === 0 ? actualFilter?.D : vals.Fechas}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => {
                        handleSetVal(0, newValue);
                    }}
                    renderInput={(startProps, endProps) => (
                        <>
                            <TextField {...startProps} format="dd/MM/yyyy" fullWidth />
                            <Box sx={{ mx: 2 }}>a</Box>
                            <TextField {...endProps} format="dd/MM/yyyy" fullWidth />
                        </>
                    )}
                />
            </Grid>
            <Grid className="component-boxing" item xs={12} sm={6} md={5}>
                <Box sx={{ width: '100%' }}>
                    <Autocomplete
                        multiple
                        fullWidth
                        options={paises}
                        value={vals.Pais.length === 0 ? actualFilter?.pais : vals.Pais}
                        onChange={(event, values) => {
                            handleSetVal(1, values);
                        }}
                        getOptionLabel={(option) => (option && option.title ? option.title : '')}
                        filterSelectedOptions
                        renderInput={(params) => <TextField {...params} label="Pais" margin="none" />}
                    />
                </Box>
            </Grid>
            <Grid className="component-boxing" item xs={12} sm={12} md={2}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" className="btns component-boxing" onClick={() => { handleDispatch(vals) }}>Filtrar</Button>
                </Stack>
            </Grid>
        </Grid>
    )
}