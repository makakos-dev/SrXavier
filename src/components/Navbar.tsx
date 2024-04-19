import { NavigationMenu } from './NavigationMenu';
import { ThemeButton } from './ThemeButton';
import { Logo } from './Logo';

export const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 flex h-32 items-center gap-4 border-b border-border/60 bg-card/95 pl-20 pr-24 backdrop-blur supports-[backdrop-filter]:bg-card/60 max-md:pl-6 max-md:pr-10'>
      <Logo className='text-base' />
      <ThemeButton />
      <NavigationMenu />
    </nav>
  );
};
