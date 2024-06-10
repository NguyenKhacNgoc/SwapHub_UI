import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import Login from './screens/Account/Components/Login';
import SignUp from './screens/Account/Components/SignUp';
import MyPosts from './screens/MyPosts';
import AccountScreen from './screens/Account';
import DetailPost from './screens/DetailPost';
import CreatePost from './screens/CreatePost';
import Profile from './screens/Profile';
import UpdateProfile from './screens/Profile/UpdateProfile';
import { MenuProvider } from 'react-native-popup-menu';

import PostMenu from './screens/DetailPost/PostMenu';
import Chat from './screens/Chat';
import Messages from './screens/Messages';
import FavoritePost from './screens/FavoritePost';

import Search from './screens/Search';
import ChangePassword from './screens/Profile/ChangePassword';
import CreateNewReport from './screens/CreatenewReport';
import { AuthProvider, useAuth } from './Services/AuthContext';



const Stack = createNativeStackNavigator()
function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='MainScreen'>
            <Stack.Screen name='MainScreen' component={MainScreen} options={{ title: 'Trang chủ' }} />
            <Stack.Screen name='Login' component={Login} options={{ title: 'Đăng nhập' }} />
            <Stack.Screen name='SignUp' component={SignUp} options={{ title: 'Đăng ký' }} />
            <Stack.Screen name='MyPosts' component={MyPosts} options={{ title: 'Bài viết của tôi' }} />
            <Stack.Screen name='FavoritePost' component={FavoritePost} options={{ title: 'Bài viết đã thích' }} />
            <Stack.Screen name='Account' component={AccountScreen} options={{ title: 'Cài đặt' }} />
            <Stack.Screen name='DetailProduct' component={DetailPost} options={() => ({
              title: 'Bài viết',
              headerRight: () => (
                <PostMenu />

              )
            })} />
            <Stack.Screen name='CreatePost' component={CreatePost} options={{ title: 'Đăng bài' }} />
            <Stack.Screen name='Profile' component={Profile} options={{ title: 'Thông tin người dùng' }} />
            <Stack.Screen name='UpdateProfile' component={UpdateProfile} options={{ title: 'Cập nhật' }} />
            <Stack.Screen name='Chat' component={Chat} />
            <Stack.Screen name='Messages' component={Messages} />
            <Stack.Screen name='Search' component={Search} options={{ title: 'Tìm kiếm' }} />

            <Stack.Screen name='ChangePassword' component={ChangePassword} options={{ title: 'Đổi mật khẩu' }} />
            <Stack.Screen name='NewReport' component={CreateNewReport} options={{ title: 'Tố cáo vi phạm' }} />
            
          </Stack.Navigator>

        </NavigationContainer>
      </MenuProvider>
    </AuthProvider>
  );
}
export default App

