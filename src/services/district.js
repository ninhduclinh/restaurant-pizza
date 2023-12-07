import { useCallback, useEffect, useState } from 'react';

const useGetDistricts = () => {
    const [districts, setDistricts] = useState([])
    const getDistricts = useCallback(async () => {
        const response = await fetch('https://vapi.vnappmob.com/api/province/');
        const data = await response.json();
        setDistricts(data);
    }, [])

    useEffect(() => {
        getDistricts();
    }, [getDistricts])

    return { districts }
}

export default useGetDistricts;

