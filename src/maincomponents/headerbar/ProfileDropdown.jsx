import { Avatar, AvatarFallback, AvatarImage } from '@maincomponents/components/ui/avatar';
import { Button } from '@maincomponents/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';
import { forceLogout, userLogout } from '@redux/slice/authSlice';
import { removeTokens } from '@utils/localstorageutil';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export function ProfileDropdown() {
  const dispatch = useDispatch();
  const { data: user } = useSelector(state => state.auth);
  // async function logout() {
  //   removeTokens();
  //   await dispatch(forceLogout()); // directly reset state
  // }
  async function logout() {
    await dispatch(userLogout());
    removeTokens();
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user?.avatar} alt={user?.fullName} />
            <AvatarFallback>{user?.fullName.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{user?.fullName}</p>
            <p className='text-muted-foreground text-xs leading-none'>{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/profile'>Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-500">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}