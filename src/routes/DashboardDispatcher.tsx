import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decodeJwt } from './ProtectedRoute'

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

        if (role === 'ADMIN' || role === 'STAFF') navigate('/admin', { replace: true });
        else if (role === 'USER') navigate('/user', { replace: true });
        else if (role === 'COACH') navigate('/coach', { replace: true });
        else navigate('/', { replace: true });
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen bg-[#131313] text-brand font-mono">
            ĐANG XÁC THỰC QUYỀN TRUY CẬP...
        </div>
    )
}