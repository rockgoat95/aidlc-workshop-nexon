import { Button } from './Button';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message = '오류가 발생했습니다.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px',
        gap: '16px',
      }}
      data-testid="error-message"
    >
      <p style={{ color: '#dc2626', fontSize: '16px' }}>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} data-testid="error-retry-button">
          다시 시도
        </Button>
      )}
    </div>
  );
}
