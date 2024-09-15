export function NavButton({ children, ...props }) {
  return (
    <button {...props} className="px-4 py-2 bg-white text-black rounded w-full">
      {children}
    </button>
  );
}
