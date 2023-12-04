import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// material
import {
    Box,
    Backdrop,
    Paper,
    Tooltip,
    Divider,
    Typography,
    Stack,
    Card,
    Button,
    CardActionArea,
    CardContent,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CardHeader,
    TextField
} from '@material-ui/core';
import { ViewSidebar, AddCircleOutline, Delete, Edit } from '@material-ui/icons';
import { format } from 'date-fns';
//
import { useSelector, useDispatch } from 'react-redux';
import { AddFilter, UpdateFilter, DeleteVariousFilters, UpdateOrder, UpdateAllFilter } from '../../../redux/slices/filters';
import Scrollbar from '../../../components/Scrollbar';
import { MIconButton } from '../../../components/@material-extend';

const DRAWER_WIDTH = 260;

export default function Filters() {
    const scraper = useSelector((state) => state.scraper);
    const paperRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [actualFilter, setActualFilter] = useState(scraper.filters.find(objeto => objeto.actual === true));
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState({ id: null, val: false });
    const [vistaName, setVistaName] = useState(null);
    const reversedArray = scraper.filters;

    const dispatch = useDispatch();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [open]);

    useEffect(() => {
        const actual = scraper.filters.find(objeto => objeto.actual === true);
        setActualFilter(actual);
    }, [scraper.filters]);

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
        axios.get(`${process.env.REACT_APP_APIBACKEND}/fecha-max`)
            .then((res) => {
                const newId = scraper.filters.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1;
                const obj = {
                    id: newId,
                    nombre: vistaName,
                    pais: [{ title: 'Guatemala', id: 1 }],
                    localizacion: null,
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
            })
        setVistaName(null)
    }

    const handleAddAS = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_APIBACKEND}/fecha-max`);
            const newId = scraper.filters.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1;
            const obj = {
                id: newId,
                nombre: "Vista-nueva",
                pais: [{ title: 'Guatemala', id: 1 }],
                localizacion: [],
                categoria: [],
                tableData: [],
                actual: true
            };

            const data = new Date(res.data[0].fecha_publicacion);
            const anioMax = data.getFullYear();
            const actual = [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)];

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
        } catch (error) {
            console.error('Hubo un error:', error);
        }
        setVistaName(null);
    };

    const handleSelect = (e, id) => {
        const { checked } = e.target
        if (checked) {
            setCheckedList([...checkedList, id])
        } else {

            const filteredList = checkedList.filter((item) => item !== id)

            setCheckedList(filteredList)

            // if (filteredList.length === 0) {
            //     error()
            // }
        }

    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };


    const handleConfirmOpenDialog = () => {
        setOpenConfirmDialog(true);
    };

    const handleConfirmCloseDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleOpenEditDialog = (id) => {
        setOpenEditDialog({ id, val: true });
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog({ id: null, val: false });
    };



    async function handleDelete() {
        // const largoAntiguo = scraper.filters.length
        // if (largoAntiguo === 1) {
        //     handleAdd()
        // }
        if (checkedList.includes(actualFilter.id)) {
            if (checkedList.length === scraper.filters.length) {
                await handleAddAS();
                setCheckedList(checkedList.filter(item => !checkedList.includes(item)))
                handleCloseDialog();
                dispatch(DeleteVariousFilters(checkedList));
                // setCheckedList(checkedList.filter(item => !checkedList.includes(item)))

            } else {
                const filteredArray = scraper.filters.filter(item => !checkedList.includes(item.id));
                // Encontrar el valor más grande en el nuevo array filtrado
                const maxValor = Math.max(...filteredArray.map(item => item.id));
                const copiaNuevo = { ...scraper.filters.find(objeto => objeto.id === maxValor) };
                dispatch(UpdateFilter({ ...copiaNuevo, actual: true }));
                setActualFilter({ ...copiaNuevo, actual: true });
                dispatch(DeleteVariousFilters(checkedList));
                handleCloseDialog();
                setCheckedList(checkedList.filter(item => !checkedList.includes(item)))

            }
        } else {
            dispatch(DeleteVariousFilters(checkedList));
            handleCloseDialog();
            setCheckedList(checkedList.filter(item => !checkedList.includes(item)))
        }
    };

    const onDragEnd = (result) => {
        console.log(result)
        if (!result.destination) return;

        const newItems = Array.from(reversedArray);
        const [movedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, movedItem);
        console.warn("new items => ", newItems);
        // reversedArray = newItems;
        dispatch(UpdateOrder("default"));
        dispatch(UpdateAllFilter(newItems));
        // setItems(newItems);
    }

    const handleEditName = (id) => {
        const copiaNuevo = { ...scraper.filters.find(objeto => objeto.id === id) };
        dispatch(UpdateFilter({ ...copiaNuevo, nombre: vistaName }));
        setActualFilter({ ...copiaNuevo, nombre: vistaName });
        setVistaName(null);
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
                    <Stack direction="row" justifyContent="center" spacing={2} sx={{ pt: 3, px: 3, pb: 1 }}>
                        <Tooltip title="Agregar">
                            <MIconButton onClick={() => handleConfirmOpenDialog()}>
                                <AddCircleOutline />
                            </MIconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <MIconButton onClick={() => handleOpenDialog()} disabled={checkedList.length < 1 || scraper.filters.length === 1}>
                                <Delete />
                            </MIconButton>
                        </Tooltip>
                        {/* <Button onClick={() => handleOpenDialog()} disabled={checkedList.length < 1}> Eliminar</Button> */}
                    </Stack>
                    <Scrollbar style={{ height: '80%' }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {reversedArray.map((val, index) => (
                                            <Draggable key={String(val.id)} draggableId={String(val.id)} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Stack direction="row" spacing={1} style={{ marginLeft: 10 }}>
                                                            <Checkbox onChange={(e) => handleSelect(e, val.id)} checked={checkedList.includes(val.id)} />
                                                            <MIconButton onClick={() => handleOpenEditDialog(val.id)} >
                                                                <Edit />
                                                            </MIconButton>
                                                        </Stack>
                                                        <Card key={index} onClick={() => handleClickCard(val.id)} sx={{ bgcolor: val.id === actualFilter.id ? 'text.disabled' : 'primary', margin: 2 }} >
                                                            {/* <CardActionArea> */}
                                                            <CardHeader
                                                                sx={{ marginBottom: '-23px', textAlign: 'end' }}
                                                                subheader={<Typography variant='body2'>{val.nombre}  No. {val.id + 1}</Typography>}
                                                            />
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
                                                                    {val.pais.map(obj => obj.title).join(', ')}
                                                                </Typography>
                                                                <Typography variant='h5'>
                                                                    Localización
                                                                </Typography>
                                                                <Typography variant='body2'>
                                                                    {val.localizacion?.title}
                                                                </Typography>
                                                                <Typography variant='h5'>
                                                                    {val.categoria.length > 1 ? 'Categoria' : 'Categorias'}
                                                                </Typography>
                                                                <Typography variant='body2'>
                                                                    {val.categoria.map(obj => obj.title).join(', ')}
                                                                </Typography>
                                                            </CardContent>
                                                            {/* </CardActionArea> */}
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                        )}
                                        {provided.placeholder}
                                    </div>)}
                            </Droppable>
                        </DragDropContext>
                    </Scrollbar>
                </Paper>
            </Box>
            {/* Eliminar vista */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>
                    Eliminar seleccionados
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Está seguro que quiere eliminar todas las vistas seleccionadas?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>No</Button>
                    <Button onClick={handleDelete}>Si, eliminar</Button>
                </DialogActions>
            </Dialog>
            {/* Crear vista */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleConfirmCloseDialog}
            >
                <DialogTitle>
                    Crear vista
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Para crear una nueva vista debe proporcionarle un nombre
                    </DialogContentText>
                    <TextField
                        autofocus
                        margin="dense"
                        id="name"
                        label="Nombre de la vista"
                        type="text"
                        fullWidth
                        value={vistaName}
                        onChange={(event) => {
                            setVistaName(event.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmCloseDialog}>cancelar</Button>
                    <Button onClick={() => { handleAdd(); handleConfirmCloseDialog() }}>crear vista</Button>
                </DialogActions>
            </Dialog>
            {/* Editar vista */}
            <Dialog
                open={openEditDialog.val}
                onClose={handleCloseEditDialog}
            >
                <DialogTitle>
                    Editar vista
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ingrese el nuevo nombre de la vista número {openEditDialog.id + 1}.
                    </DialogContentText>
                    <TextField
                        autofocus
                        margin="dense"
                        id="name"
                        label="Nombre de la vista"
                        type="text"
                        fullWidth
                        value={vistaName}
                        onChange={(event) => {
                            setVistaName(event.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>cancelar</Button>
                    <Button onClick={() => { handleEditName(openEditDialog.id); handleCloseEditDialog() }}>Editar nombre</Button>
                </DialogActions>
            </Dialog>

        </>
    )

}