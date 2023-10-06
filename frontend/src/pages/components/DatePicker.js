import { Grid, TextField, Box, Button } from '@material-ui/core';
import { DateRangePicker } from '@material-ui/lab';

export default function DatePicker({ val, setVal, functions, fechas, sxV }) {

    const CallAll = (val) => {
        functions.map((func, index) => (
            func(val)
        ))
    }

    return (
        <Grid container sx={sxV} justifyContent="flex-start" >
            <DateRangePicker
                startText="Fecha de inicio"
                endText="Fecha fin"
                value={fechas}
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
            <Button variant="outlined" sx={{ ml: 1 }} onClick={() => { CallAll(val) }}>Filtrar</Button>
        </Grid>
    )


}