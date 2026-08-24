import { useQuery } from '@tanstack/react-query';

const LikingMethod = () => {
    const { serviceLoading, serviceError, data: serviceData, refetch } = useQuery({
        queryKey: ['posts'],
        queryFn: () =>
            fetch('http://localhost:5000/posts').then(
                (res) => res.json(),
            ),
    })
    return { serviceData };
};

export default LikingMethod;