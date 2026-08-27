export function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-light py-10">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-foreground/50">
        <p className="font-display text-lg text-foreground">Sauce Tao</p>
        <p className="mt-1">Homemade meals, made fresh &mdash; delivered or ready for pickup.</p>
        <p className="mt-3 text-xs uppercase tracking-widest">
          <a href="/admin/login" className="hover:text-foreground">
            Staff login
          </a>
        </p>
      </div>
    </footer>
  );
}
