interface LoadingProps {
  message?: string;
}

export function Loading({ message = '로딩 중...' }: LoadingProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        fontSize: '16px',
        color: '#6b7280',
      }}
      data-testid="loading-indicator"
    >
      {message}
    </div>
  );
}
