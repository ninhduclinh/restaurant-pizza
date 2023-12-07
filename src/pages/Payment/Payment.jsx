import { useState, useEffect } from 'react'
import { useStyles } from './styles';
import { Container, FormControlLabel, Link as MaterialLink, Radio, RadioGroup, FormHelperText, Typography, TextField, Grid, Box, FormControl, InputLabel, Select, MenuItem, Card, CardContent, CardActions, Button, CardMedia, Badge } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { projectFirestore, projectAuth } from '../../firebase/config';
import { useFormik } from 'formik';
import { validationSchema } from '../../utils/validate';
import { currencyFormat } from '../../utils/currencyFormat';
import useGetProvinces from '../../services/province';
import { useAuthState } from "react-firebase-hooks/auth";

const Payment = () => {
    const [user] = useAuthState(projectAuth);
    const classes = useStyles();
    const [docs, setDocs] = useState([]);
    const { provinces } = useGetProvinces();
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            address: '',
            province: 0,
            district: 0,
            ward: 0,
            payment: 'cod'
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            projectFirestore.collection('order').add({
                name: values.name,
                phone: values.phone,
                address: values.address,
                province: selectedProvince.province_name,
                district: selectedDistrict.district_name,
                ward: selectedWard.ward_name,
                payment: values.payment,
                note: localStorage.getItem('note'),
                userID: JSON.parse(localStorage.getItem('user')).uid,
                total: localStorage.getItem('total'),
                cart: docs,
                status: "Chưa xác nhận",
                checked: false,
                date: new Date().toLocaleString(),
            })
            alert('Đặt hàng thành công!');
            localStorage.setItem('note', '');
            navigate('/');
            const cart_query = projectFirestore.collection('cart').where('uid', '==', JSON.parse(localStorage.getItem('user')).uid);
            cart_query.get().then((querySnapshot) =>{
                querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                });
            });
        },
    });

    const selectedProvince = provinces.find(province => province.province_id === formik.values.province);
    const selectedDistrict = districts.find(district => district.district_id === formik.values.district);
    const selectedWard = wards.find(ward => ward.ward_id === formik.values.ward);


    useEffect(() => {
        if (user) {
            projectFirestore.collection('cart')
                .where('uid', '==', user.uid)
                .onSnapshot((snap) => {
                    let documents = [];
                    snap.forEach(doc => {
                        documents.push({
                            ...doc.data(),
                            id: doc.id
                        })
                    });
                    setDocs(documents)
                })
        }
    }, [setDocs]);

    useEffect(() => {
        const fetchDistricts = async () => {
            const response = await fetch(`https://vapi.vnappmob.com/api/province/district/${formik.values.province}`);
            const data = await response.json();
            setDistricts(data.results);
        }
        fetchDistricts()

    }, [formik.values.province, setDistricts])

    useEffect(() => {
        const fetchWards = async () => {
            const response = await fetch(`https://vapi.vnappmob.com/api/province/ward/${formik.values.district}`);
            const data = await response.json();
            setWards(data.results);
        }
        fetchWards()

    }, [formik.values.district, setWards])


    return (
        <Container className={classes.container}>
            <Grid container spacing={3}>
                <Grid item md={7} style={{ paddingRight: '20px' }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Box>
                            <Typography variant="h4" style={{ marginBottom: '10px' }}>
                                Thông tin giao hàng
                            </Typography>
                            <TextField
                                label="Họ và tên"
                                fullWidth
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                id="name"
                                name="name"
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <Box className={classes.input}></Box>
                            <TextField
                                label="Số điện thoại"
                                fullWidth
                                onChange={formik.handleChange}
                                value={formik.values.phone}
                                id="phone"
                                name="phone"
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                            <Box className={classes.input}></Box>
                            <TextField
                                label="Địa chỉ"
                                fullWidth
                                onChange={formik.handleChange}
                                value={formik.values.address}
                                id="address"
                                name="address"
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                            <Box className={classes.input}></Box>
                            <Box className={classes.select}>
                                <FormControl fullWidth style={{ marginRight: '10px' }}>
                                    <InputLabel>Thành phố</InputLabel>
                                    <Select
                                        onChange={(e) => {
                                            formik.values.district = 0;
                                            formik.values.ward = 0;
                                            formik.handleChange(e);
                                        }}
                                        value={formik.values.province}
                                        id="province"
                                        name="province"
                                        error={formik.touched.province && Boolean(formik.errors.province)}
                                    >
                                        <MenuItem
                                            disabled
                                            hidden
                                            value={0}
                                        >
                                            Chưa chọn
                                        </MenuItem>
                                        {provinces.map(province => (
                                            <MenuItem
                                                key={province.province_id}
                                                value={province.province_id}
                                            >
                                                {province.province_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.province && formik.errors.province ? (
                                        <FormHelperText
                                            sx={{ color: "#bf3333" }}
                                        >
                                            {formik.touched.province && formik.errors.province}
                                        </FormHelperText>
                                    ) : null}
                                </FormControl>
                                <FormControl fullWidth style={{ marginRight: '10px' }}>
                                    <InputLabel>Quận/Huyện</InputLabel>
                                    <Select
                                        onChange={(e) => {
                                            formik.values.ward = 0;
                                            formik.handleChange(e);
                                        }}
                                        value={formik.values.district}
                                        id="district"
                                        name="district"
                                        error={formik.touched.district && Boolean(formik.errors.district)}
                                    >
                                        <MenuItem
                                            disabled
                                            hidden
                                            value={0}
                                        >
                                            Chưa chọn
                                        </MenuItem>
                                        {districts.map(district => (
                                            <MenuItem
                                                key={district.district_id}
                                                value={district.district_id}
                                            >
                                                {district.district_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.district && formik.errors.district ? (
                                        <FormHelperText
                                            sx={{ color: "#bf3333" }}
                                        >
                                            {formik.touched.district && formik.errors.district}
                                        </FormHelperText>
                                    ) : null}
                                </FormControl>
                                <FormControl fullWidth >
                                    <InputLabel >Thị trấn/ Xã/ Phường</InputLabel>
                                    <Select
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        value={formik.values.ward}
                                        id="ward"
                                        name="ward"
                                        error={formik.touched.ward && Boolean(formik.errors.ward)}
                                    >
                                        <MenuItem
                                            disabled
                                            hidden
                                            value={0}
                                        >
                                            Chưa chọn
                                        </MenuItem>
                                        {wards.map(ward => (
                                            <MenuItem
                                                key={ward.ward_id}
                                                value={ward.ward_id}
                                            >
                                                {ward.ward_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.ward && formik.errors.ward ? (
                                        <FormHelperText
                                            sx={{ color: "#bf3333" }}
                                        >
                                            {formik.touched.ward && formik.errors.ward}
                                        </FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Box>
                        </Box>
                        <Typography variant="h4" style={{ marginTop: '10px' }}>
                            Phương thức thanh toán
                        </Typography>
                        <Card style={{ marginTop: '10px' }}>
                            <CardContent>
                                <FormControl>
                                    <RadioGroup
                                        id='payment'
                                        aria-labelledby="payment"
                                        defaultValue="cod"
                                        name="payment"
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        value={formik.values.payment}
                                    >
                                        <FormControlLabel
                                            value="cod"
                                            control={<Radio />}
                                            label="Thanh toán khi nhận hàng(COD)"
                                        />
                                        <FormControlLabel
                                            value="transfer"
                                            control={<Radio />}
                                            label="Thanh toán chuyển khoản"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                            <hr />
                            <CardActions style={{ display: 'flex' }}>
                                <Box style={{ flexGrow: 1 }}>
                                    <Button
                                        className={classes.total}
                                        color="primary"
                                        variant="text"
                                    >
                                        <MaterialLink
                                            color="inherit"
                                            underline="none"
                                            component={RouterLink} to='/Cart'
                                        >
                                            Quay lại giỏ hàng
                                        </MaterialLink>
                                    </Button>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    type="submit"
                                >
                                    Đặt mua
                                </Button>
                            </CardActions>
                            <hr />
                            <CardContent className={classes.info}>
                                <Typography>
                                    Thông tin tài khoản sẽ gửi đến bạn khi hoàn tất đặt hàng (DVKH sẽ xác nhận khi có sự thay đổi về đơn hàng)
                                </Typography>
                            </CardContent>
                        </Card>
                    </form>
                </Grid>
                <Grid item md={5} style={{ borderLeft: '2px solid #ccc' }}>
                    <Typography variant="h4">
                        Thông tin giỏ hàng
                    </Typography>
                    {docs.map(cart => (
                        <Card
                            key={cart.id}
                            sx={{
                                display: 'flex',
                                margin: '10px 0',
                                position: 'relative',
                                padding: '10px'
                            }}
                        >
                            <Badge
                                badgeContent={cart.quantity}
                                color="error"
                            >
                                <CardMedia
                                    component="img"
                                    image={cart.image}
                                    style={{ width: 100 }}
                                />
                            </Badge>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent>
                                        <Typography sx={{ width: "370px" }}>
                                            {cart.name}
                                        </Typography>
                                        <Typography>
                                            {currencyFormat(cart.price)}/{cart.unit}
                                        </Typography>
                                    </CardContent>
                                </Box>
                                <Typography style={{ position: 'absolute', bottom: 10, right: 20 }}>
                                    Tạm tính: {currencyFormat(cart.price * cart.quantity)} đ
                                </Typography>
                            </Box>
                        </Card>
                    ))}
                    <Box className={classes.total}>
                        <Typography variant="h5" style={{ flexGrow: 1 }}>
                            Tổng tiền
                        </Typography>
                        <Typography variant='h4'>
                            {currencyFormat(localStorage.getItem('total'))} vnđ
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Payment