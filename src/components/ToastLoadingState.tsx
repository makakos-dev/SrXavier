import { LoadingSpinner } from './LoadingSpinner';

export const ToastLoadingState = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    <div className='flex items-center gap-2'>
      <LoadingSpinner className='size-5' />
      <span className='font-semibold'>{loadingMessage}</span>
    </div>
  );
};
