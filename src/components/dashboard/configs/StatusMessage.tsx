interface StatusMessageProps {
    type: 'error' | 'success';
    message: string;
}

export default function StatusMessage({ type, message }: StatusMessageProps) {
    const isError = type === 'error';
    
    return (
        <div className={`${isError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border rounded-md p-4`}>
            <p className={`text-sm ${isError ? 'text-red-800' : 'text-green-800'}`}>
                {message}
            </p>
        </div>
    );
}

