import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: '200px'
    },
    filter: {
        width: '130px',
        height: '60px',
    },
    card: {
        height: '360px',
        position: 'relative',
        '@media (max-width: 960px)': {
            height: '420px',
        },
        '@media (max-width: 600px)': {
            height: '500px',
        },
        cursor: 'pointer'
    },
    img: {
        transition: '0.3s linear',
        "&:hover": {
            transform: 'scale(1.1)'
        },
    },
    name: {
        fontWeight: 'bold',
        display:'inline-block', 
        height: '50px'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '30px'
    }
}));