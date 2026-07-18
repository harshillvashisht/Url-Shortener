type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size = 32 }: SpinnerProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 to-white px-4">
      <div
        className="animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 shadow-sm"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
}