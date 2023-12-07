import { useCallback, useEffect, useState } from 'react';

const useGetProvinces = () => {
    const [provinces, setProvinces] = useState([])
    const getProvinces = useCallback(async () => {
        const response = await fetch('https://vapi.vnappmob.com/api/province/');
        const data = await response.json();
        setProvinces(data.results);
    }, [])

    useEffect(() => {
        getProvinces();
    }, [getProvinces])

    return { provinces }
}

export default useGetProvinces;

