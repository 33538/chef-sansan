export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-light bg-brand-light/40 py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-foreground/60">
        <p className="font-semibold text-brand-dark">Chef Sansan</p>
        <p>Homemade meals, made fresh &mdash; delivered or ready for pickup.</p>
        <p className="mt-2">
          <a href="/admin/login" className="underline hover:text-brand-dark">
            Staff login
          </a>
        </p>
      </div>
    </footer>
  );
}
