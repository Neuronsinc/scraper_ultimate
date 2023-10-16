import { Grid, TextField, Box, Button } from '@material-ui/core';
import { DateRangePicker } from '@material-ui/lab';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { MIconButton } from '../../components/@material-extend';
import { changeDates } from '../../redux/slices/Dates';

export default function DatePicker({ val, setVal, fechas, sxV }) {
    const dispatch = useDispatch();

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
        const validarF = validarFechas(val);
        if (validarF.valid) {
            myFunction("Buscando datos", 'success');
            dispatch(changeDates(val));
        } else {
            myFunction(validarF.message, 'error');
        }
    }

    useEffect(() => {
        if (fechas[0].toString() === "Invalid Date" && fechas[1].toString() === "Invalid Date") {
            axios.get(`${process.env.REACT_APP_APIBACKEND}/fecha-max`)
                .then((res) => {
                    const data = new Date(res.data[0].fecha_publicacion)
                    const anioMax = data.getFullYear()
                    const actual = [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)]
                    if (actual[0].getFullYear() > anioMax) {
                        const f = [new Date(actual[0].setFullYear(anioMax)), new Date(actual[1].setFullYear(anioMax))];
                        dispatch(changeDates(f));
                    } else {
                        dispatch(changeDates(actual));
                    }
                })
        }
    }, [])

    return (
        <Grid container sx={sxV} justifyContent="flex-start" >
            <DateRangePicker
                startText="Fecha de inicio"
                endText="Fecha fin"
                value={val.length === 0 ? fechas : val}
                inputFormat="dd/MM/yyyy"
                onChange={(newValue) => {
                    setVal(newValue);
                }}
                renderInput={(startProps, endProps) => (
                    <>
                        <TextField {...startProps} format="dd/MM/yyyy" />
                        <Box sx={{ mx: 2 }}>a</Box>
                        <TextField {...endProps} format="dd/MM/yyyy" />
                    </>
                )}
            />
            <Button variant="outlined" sx={{ ml: 1 }} onClick={() => { handleDispatch(val) }}>Filtrar</Button>
        </Grid>
    )
}