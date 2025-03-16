
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon, LayoutDashboardIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();
  
  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="text-xl font-bold text-primary">
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-block">AutoForms</span>
            <span className="sm:hidden">AF</span>
          </div>
        </Link>
        
        <nav className="flex items-center space-x-2 lg:space-x-4">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? "default" : "ghost"} 
              className={cn("gap-2", location.pathname === '/' ? "bg-primary text-white" : "text-gray-600")}
            >
              <LayoutDashboardIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Dashboard</span>
            </Button>
          </Link>
          
          <Link to="/create">
            <Button 
              variant={location.pathname === '/create' ? "default" : "ghost"} 
              className={cn("gap-2", location.pathname === '/create' ? "bg-primary text-white" : "text-gray-600")}
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">New Quiz</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
