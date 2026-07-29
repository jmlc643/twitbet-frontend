import { useNavigate } from 'react-router-dom';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { Button } from '@/components/ui/button';

export const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="py-6 space-y-6 max-w-2xl mx-auto px-4 sm:px-0">
      <ProfileCard />
      
      <div className="flex justify-center">
        <Button 
          onClick={() => navigate('/leagues/create')}
          className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold uppercase py-6 px-12 text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all duration-300"
        >
          Crear Nueva Liga
        </Button>
      </div>
    </div>
  );
};