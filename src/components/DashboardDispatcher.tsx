import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decodeJwt } from '../routes/ProtectedRoute'

export default function DashboardDispatcher() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        const payload = decodeJwt(token);
        const role = payload?.role;

        if (role === 'ADMIN') navigate('/admin', { replace: true });
        else if (role === 'STAFF') navigate('/staff', { replace: true });
        else if (role === 'USER') navigate('/user', { replace: true });
        else if (role === 'COACH') navigate('/coach', { replace: true });
        else navigate('/', { replace: true });
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131313', color: '#caf300', fontFamily: 'monospace' }}>
            ĐANG XÁC THỰC QUYỀN TRUY CẬP...
        </div>
    )
}