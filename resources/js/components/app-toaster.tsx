import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

function AppToaster() {
    const { props } = usePage<SharedData>();

    useEffect(() => {
        if (props?.flash?.success) {
            toast.success(props?.flash?.success);
            router.reload({ only: ['flash'] });
        } else if (props?.flash?.error) {
            toast.error(props?.flash?.error);
            router.reload({ only: ['flash'] });
        }
    }, [props?.flash]);

    return <Toaster />;
}

export default AppToaster;
