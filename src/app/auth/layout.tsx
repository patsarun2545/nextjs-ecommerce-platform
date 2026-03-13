export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center min-h-svh">
      <main>{children}</main>
    </div>
  )
}