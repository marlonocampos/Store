import React, { useState } from 'react';
import {
    Avatar,
    Button,
    Card, CardActions,
    CardContent, Collapse,
    Grow, IconButton, ListItem, ListItemAvatar, ListItemText, Stack,
    TableCell, Tooltip, Typography, Zoom,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteForeverOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';
import List from "@mui/material/List";
import Alert from "@mui/material/Alert";
import { TransitionGroup } from "react-transition-group";
import { Add } from "@mui/icons-material";
import productoApi from "../../Services/API/ProductoApi";
import AlertSucces from '../Alertas/AlertSucces';
import ModalActualizar from "./ModalActualizar";
import useStore from "../../Stores/formContext";

const headtable = [
    { id: 1, label: 'Id', bg: "273565", color: 'white', bor: 0 },
    { id: 2, label: 'Código', bg: "273565", color: 'white', bor: 0 },
    { id: 3, label: 'Nombre', bg: "273565", color: 'white', bor: 0 },
    { id: 4, label: 'Stock', bg: "273565", color: 'white', bor: 0 },
    { id: 6, label: 'Precio', bg: "273565", color: 'white', bor: 0 },
    { id: 5, label: 'Fecha Ingreso', bg: "273565", color: 'white', bor: 0 },
    { id: 7, label: 'Categoría', bg: "273565", color: 'white', bor: 0 },
    { id: 8, label: 'Acciones', bg: "273565", color: 'white', bor: 0 },
]

export default function ListProducto({
    productos,
    accion,
    setAccion,
    listaProductos,
    setListaProductos,
    actualizar,
    setActualizar,
    categorias
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [openAlert, setOpenAlert] = useState(false);
    const { openDialog } = useStore();
    const [editDatos, setEditDatos] = useState({
        id: 0,
        categoria_id: '0',
        nombre: '',
        stock: '',
        precio: 0,
        codigo: '',
        descripcion: '',
        fechaingreso: ''
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const handleChangeAccion = (e) => {
        setAccion(e)
    }

    const handleEliminar = (idl) => {
        const newListaProductos = listaProductos.filter((productoE) => productoE.idL !== idl);
        setListaProductos(newListaProductos);
    }

    const insertar = async () => {
        const insert = await productoApi.Insert(listaProductos);
        if (insert === true) {
            setAccion(1);
            setActualizar(actualizar ? false : true); //No cambiar esta lógica
            setOpenAlert(true);
            setListaProductos([]);
        } else {
            console.log('Error en insertar productos!');
        }
    }

    const cargarDatosEditar = (productoEditar) => {
        setEditDatos(productoEditar);
        openDialog();
    }

    const Prevenir = () => {
        if (productos.length > 0) {
            return (
                <>
                    <TableContainer>
                        <Table stickyHeader size='small'>
                            <TableHead>
                                <TableRow>
                                    {headtable.map((col) => {
                                        return (
                                            <TableCell
                                                key={col.id}
                                                sx={{
                                                    background: `#${col.bg}`,
                                                    border: col.bor,
                                                    color: col.color,
                                                }}
                                            >
                                                {col.label}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productos
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((producto) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={producto.id}>
                                                <TableCell align='left'> {producto.id} </TableCell>
                                                <TableCell align='left'> {producto.codigo} </TableCell>
                                                <TableCell align='left'> {producto.nombre} </TableCell>
                                                <TableCell align='left'> {producto.precio} </TableCell>
                                                <TableCell align='left'> {producto.stock} </TableCell>
                                                <TableCell
                                                    align='left'> {producto.fechaingreso} </TableCell>
                                                <TableCell
                                                    align='left'> {producto.nombrecategoria} </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            color='primary'
                                                            onClick={() => cargarDatosEditar(producto)}
                                                        >
                                                            <EditIcon
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton
                                                            color='error'
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        sx={{ background: 'white', width: '100%' }}
                        rowsPerPageOptions={[7, 14]}
                        component="div"
                        count={productos.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )
        } else {
            return <Typography m={3} align={'center'} variant="h5">Algo salió mal! :(</Typography>
        }
    }
    return (
        <>
            <Grow in={true} timeout={300}>
                <Card sx={{ margin: 2, overflow: "auto" }}> {/* maxHeight: '80.5vh', minHeight: '80.5vh'*/}
                    <CardContent>
                        <Button variant={accion === 1 ? 'outlined' : 'text'} onClick={() => handleChangeAccion(1)}>
                            Inventario
                        </Button>
                        <Button sx={{ marginLeft: 3 }} variant={accion === 2 ? 'outlined' : "text"}
                            onClick={() => handleChangeAccion(2)}>
                            Ingresar Productos
                        </Button>
                        {accion === 1 ?
                            <Paper sx={{ width: '100%', overflow: 'auto', marginTop: 2 }}>
                                {Prevenir()}
                            </Paper>
                            : accion === 2 ?
                                <Paper sx={{
                                    width: '100%',
                                    overflow: 'auto',
                                    marginTop: 2,
                                    maxHeight: '54vh',
                                    minHeight: '54vh'
                                }}>
                                    {listaProductos.length > 0 ?
                                        <List sx={{ paddingX: 4 }}>
                                            <TransitionGroup>
                                                {listaProductos.map((item) => {
                                                    return (
                                                        <Collapse key={item.idL}>
                                                            <ListItem
                                                                key={item.idL}
                                                                secondaryAction={
                                                                    <Tooltip title="Eliminar">
                                                                        <IconButton
                                                                            onClick={() => handleEliminar(item.idL)}
                                                                            color='error'
                                                                            edge="end">
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar sx={{ background: '#e7ebfc' }}>
                                                                        <ShoppingBagIcon color="primary" />
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={`${item.idL}. ${item.nombre}`}
                                                                    primaryTypographyProps={{
                                                                        fontWeight: 600
                                                                    }}
                                                                    secondary={`Precio: C$ ${item.precio} / Stock: ${item.stock}`}
                                                                />
                                                            </ListItem>
                                                        </Collapse>
                                                    )
                                                })}
                                            </TransitionGroup>
                                        </List>
                                        :
                                        <Zoom in={true}>
                                            <Stack sx={{ width: '100%' }} spacing={2}>
                                                <Alert severity="error">Lista De Productos Vacía</Alert>
                                            </Stack>
                                        </Zoom>
                                    }
                                </Paper>
                                : ''
                        }
                    </CardContent>
                    {accion === 2 ?
                        <CardActions sx={{ display: 'flex', justifyContent: 'center', paddingX: 3 }}>
                            <Button
                                disabled={listaProductos.length === 0}
                                sx={{ boxShadow: 5, flexWrap: 'wrap', overflow: 'hidden', marginBottom: 2 }}
                                variant="contained"
                                size="large"
                                startIcon={<Add color='white' />}
                                type='submit'
                                onClick={() => insertar()}
                            >
                                Insertar
                            </Button>
                        </CardActions>
                        :
                        null
                    }
                    <AlertSucces Open={openAlert} setOpen={setOpenAlert} mensaje={'Productos Insertados!'}
                        type={'success'} />

                    <ModalActualizar {...{ editDatos, setEditDatos, categorias }} />
                </Card>
            </Grow>
        </>
    )
}
