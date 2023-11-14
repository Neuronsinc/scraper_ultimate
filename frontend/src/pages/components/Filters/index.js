import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import axios from 'axios';
// material
import { Box, Backdrop, Paper, Tooltip, Divider, Typography, Stack, Card, Button, CardActionArea } from '@material-ui/core';
import { ViewSidebar } from '@material-ui/icons';
//
import { useSelector, useDispatch } from 'react-redux';
import { AddFilter, UpdateFilter } from '../../../redux/slices/filters';
import Scrollbar from '../../../components/Scrollbar';
import { MIconButton } from '../../../components/@material-extend';

const DRAWER_WIDTH = 260;

export default function Filters() {
    const scraper = useSelector((state) => state.scraper);

    const [open, setOpen] = useState(false);
    const [actualFilter, setActualFilter] = useState(scraper.filters.find(objeto => objeto.actual === true));

    const dispatch = useDispatch();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [open]);

    
    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        console.log("llamado")
        console.log(scraper.filters.length)
        axios.get(`${process.env.REACT_APP_APIBACKEND}/fecha-max`)
            .then((res) => {

                const obj = {
                    id: scraper.filters.length,
                    pais: 1,
                    localizacion: [],
                    categoria: [],
                    tableData: [],
                    actual: false
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
            })
    }

    const handleClickCard = (id) => {
        const copiaViejo = { ...actualFilter };
        const copiaNuevo = {...scraper.filters.find(objeto => objeto.id === id)};

        dispatch(UpdateFilter({...copiaViejo, actual: false}));
        dispatch(UpdateFilter({...copiaNuevo, actual: true}));
        setActualFilter({...copiaNuevo, actual: true});
    }

    return (
        <>
            <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose} />

            <Box
                sx={{
                    top: open ? 12 : 180,
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
                        top: '50%',
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

                    <Scrollbar sx={{ height: 1 }}>
                        {scraper.filters.map((val, index) => (
                            <Card key={index} onClick={() => handleClickCard(val.id)} style={{ backgroundColor: val.id === actualFilter.id ? 'green' : 'blue' }}>
                                <CardActionArea>
                                    {val.id}
                                </CardActionArea>
                            </Card>
                        )
                        )}
                        <Stack spacing={4} sx={{ pt: 3, px: 3, pb: 15 }}>
                            <Stack spacing={1.5}>
                                <Button onClick={() => handleAdd()}> Agregar</Button>
                            </Stack>
                        </Stack>

                    </Scrollbar>
                </Paper>
            </Box>
        </>
    )

}