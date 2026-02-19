import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartIcon from './CartIcon';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      navigate({ to: '/' });
    } else {
      await login();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/assets/generated/aadi-shop-logo.dim_400x100.png"
              alt="Aadi Shop"
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              search={{ category: 'Men' }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Men
            </Link>
            <Link
              to="/products"
              search={{ category: 'Women' }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Women
            </Link>
            <Link
              to="/products"
              search={{ category: 'Kids' }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Kids
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              All Products
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin' })}
              >
                Admin
              </Button>
            )}
            <CartIcon />
            <Button
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
            >
              <User className="mr-2 h-4 w-4" />
              {isLoggingIn ? 'Loading...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
