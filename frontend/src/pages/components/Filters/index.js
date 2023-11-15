import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import axios from 'axios';
// material
import { Box, Backdrop, Paper, Tooltip, Divider, Typography, Stack, Card, Button, CardActionArea, CardContent } from '@material-ui/core';
import { ViewSidebar } from '@material-ui/icons';
import { format } from 'date-fns';
//
import { useSelector, useDispatch } from 'react-redux';
import { AddFilter, UpdateFilter } from '../../../redux/slices/filters';
import Scrollbar from '../../../components/Scrollbar';
import { MIconButton } from '../../../components/@material-extend';

const DRAWER_WIDTH = 260;

export default function Filters() {
    const scraper = useSelector((state) => state.scraper);
    const paperRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [actualFilter, setActualFilter] = useState(scraper.filters.find(objeto => objeto.actual === true));
    const reversedArray = [...scraper.filters].reverse();

    console.log(reversedArray)

    const dispatch = useDispatch();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [open]);

    useEffect(() => {
        if (scraper.filters.length === 1 && scraper.filters[0].id === 0) {
            if (scraper.filters[0].D[0] === "Invalid Date" && scraper.filters[0].D[1] === "Invalid Date") {
                axios.get(`${process.env.REACT_APP_APIBACKEND}/fecha-max`)
                    .then((res) => {
                        const copiaViejo = { ...scraper.filters[0] };
                        const data = new Date(res.data[0].fecha_publicacion)
                        const anioMax = data.getFullYear()
                        const actual = [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)]
                        if (actual[0].getFullYear() > anioMax) {
                            const f = [new Date(actual[0].setFullYear(anioMax)), new Date(actual[1].setFullYear(anioMax))];
                            dispatch(UpdateFilter({ ...copiaViejo, D: f }));
                            setActualFilter({ ...copiaViejo, D: f });
                        } else {
                            dispatch(UpdateFilter({ ...copiaViejo, D: actual }));
                            setActualFilter({ ...copiaViejo, D: actual });
                        }
                    })
            }
        }
    }, []);

    const formatDate = (date) => {
        // Verifica si la fecha es válida
        if (!(date instanceof Date)) {
            return 'Fecha inválida';
        }

        // Formatea la fecha a dd/mm/yyyy
        return format(date, 'dd/MM/yyyy');
    };


    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickCard = (id) => {
        const copiaViejo = { ...actualFilter };
        const copiaNuevo = { ...scraper.filters.find(objeto => objeto.id === id) };

        dispatch(UpdateFilter({ ...copiaViejo, actual: false }));
        dispatch(UpdateFilter({ ...copiaNuevo, actual: true }));
        setActualFilter({ ...copiaNuevo, actual: true });
    }

    const handleAdd = () => {
        console.log("llamado")
        console.log(scraper.filters.length)
        axios.get(`${process.env.REACT_APP_APIBACKEND}/fecha-max`)
            .then((res) => {
                const newId = scraper.filters.length
                const obj = {
                    id: newId,
                    pais: [1],
                    localizacion: [],
                    categoria: [],
                    tableData: [],
                    actual: true
                }

                const data = new Date(res.data[0].fecha_publicacion)
                const anioMax = data.getFullYear()
                const actual = [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)]
                if (actual[0].getFullYear() > anioMax) {
                    const f = [new Date(actual[0].setFullYear(anioMax)), new Date(actual[1].setFullYear(anioMax))];
                    obj.D = f;
                    dispatch(AddFilter(obj));

                } else {
                    obj.D = actual;
                    dispatch(AddFilter(obj));

                }

                const copiaViejo = { ...actualFilter };
                dispatch(UpdateFilter({ ...copiaViejo, actual: false }));
                setActualFilter(obj);
            })
    }

    return (
        <>
            <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose} />

            <Box
                sx={{
                    top: 12,
                    bottom: 12,
                    right: 0,
                    position: 'fixed',
                    zIndex: open ? 2010 : 2000,
                    ...(open && { right: 0 })
                }}
            >
                <Box
                    sx={{
                        p: 0.5,
                        px: '4px',
                        mt: -3,
                        left: -44,
                        top: open ? '50%' : '65%',
                        color: 'grey.800',
                        position: 'absolute',
                        bgcolor: 'common.white',
                        borderRadius: '24px 0 16px 24px',
                        boxShadow: (theme) => theme.customShadows.z12
                    }}
                >
                    <Tooltip title="Vistas">
                        <MIconButton
                            color="inherit"
                            onClick={handleToggle}
                            sx={{
                                p: 0,
                                width: 40,
                                height: 40,
                                transition: (theme) => theme.transitions.create('all'),
                                '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                            }}
                        >
                            {open ? <Icon icon={closeFill} width={20} height={20} /> : <ViewSidebar width={20} height={20} />}
                        </MIconButton>
                    </Tooltip>
                </Box>

                <Paper
                    ref={paperRef}
                    sx={{
                        height: 1,
                        width: '0px',
                        overflow: 'hidden',
                        boxShadow: (theme) => theme.customShadows.z24,
                        transition: (theme) => theme.transitions.create('width'),
                        ...(open && { width: DRAWER_WIDTH })
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
                        <Typography variant="subtitle1">Vistas</Typography>
                        <MIconButton onClick={handleClose}>
                            <Icon icon={closeFill} width={20} height={20} />
                        </MIconButton>
                    </Stack>
                    <Divider />
                    <Stack spacing={4} sx={{ pt: 3, px: 3, pb: 1 }}>
                        <Stack spacing={1.5}>
                            <Button onClick={() => handleAdd()}> Agregar</Button>
                        </Stack>
                    </Stack>
                        <Scrollbar sx={{ p: 1.5, maxHeight: '80%' }}>
                            {reversedArray.map((val, index) => (
                                <Card key={index} onClick={() => handleClickCard(val.id)} sx={{ bgcolor: val.id === actualFilter.id ? 'text.disabled' : 'primary', margin: 0.5 }} >
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography variant='h5'>
                                                Fechas
                                            </Typography>
                                            <Typography variant='body2'>
                                                {`${formatDate(val.D[0])}-${formatDate(val.D[1])}`}
                                            </Typography>
                                            <Typography variant='h5'>
                                                {val.pais.length > 1 ? 'Paises' : 'País'}
                                            </Typography>
                                            <Typography variant='body2'>
                                                algo aca
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            )
                            )}
                        </Scrollbar>
                </Paper>
            </Box>
        </>
    )

}