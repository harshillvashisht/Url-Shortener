type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size = 32 }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
}