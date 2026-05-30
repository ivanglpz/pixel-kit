type FullscreenStateProps = {
  message: string;
};

export const FullscreenState = ({ message }: FullscreenStateProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
      <p>{message}</p>
    </main>
  );
};
