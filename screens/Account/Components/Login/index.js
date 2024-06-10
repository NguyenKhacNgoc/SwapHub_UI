
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid } from 'react-native'
import { useAuth } from '../../../../Services/AuthContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#B0B0B0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#333',
  },
  error: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10


  },
  btn: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  signupText: {
    marginTop: 20,
    marginBottom: 10,
    color: '#666',
  },
});
function Login() {
  const { login } = useAuth()
  const navigation = useNavigation()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [isvalidEmail, setIsvalidEmail] = useState(true)
  const [isvalidPassword, setIsvalidPassword] = useState(true)
  const [errorEmail, setErrorEmail] = useState()
  const [errorPassword, setErrorPassword] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const validateEmail = (validEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsvalidEmail(emailRegex.test(validEmail))
  }
  const onChangeEmail = (text) => {
    setEmail(text)
    setErrorEmail('')
    if (text !== null) {
      validateEmail(text)
    }
    else {
      setIsvalidEmail(true)
    }
  }
  const onChangePassword = (text) => {
    setPassword(text)
    setErrorPassword('')
    if (text.length < 6) {
      setIsvalidPassword(false)

    }
    else {
      setIsvalidPassword(true)
    }

  }
  const handlePressSignUp = () => {
    navigation.navigate('SignUp')

  }
  const handlePressLogin = async () => {

    if (isvalidEmail && isvalidPassword && email && password) {
      const user = {
        email: email,
        password: password
      }
      try {
        setIsLoading(true)
        const response = await axios.post('http://khacngoc.ddns.net:8080/api/login', user)
        if (response.status === 200) {
          await AsyncStorage.setItem('accessToken', response.data.token)
          ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT)
          login()
          navigation.navigate('MainScreen')


        }


      }
      catch (error) {
        try {
          if (error.message === 'Network Error') ToastAndroid.show('Network Error', ToastAndroid.SHORT)
          else {

            if (error.response.status === 401) ToastAndroid.show('Tài khoản hoặc mật khẩu không chính xác', ToastAndroid.SHORT)
            if (error.response.status === 403) ToastAndroid.show('Tài khoản của bạn đã bị khoá', ToastAndroid.SHORT)
          }

        }

        catch {
          ToastAndroid.show('Lỗi máy chủ, vui lòng thử lại sau', ToastAndroid.SHORT)
        }
        console.log(error)

      }
      finally {
        setIsLoading(false)
      }
    }
    else {
      if (!email) {
        setErrorEmail('Không bỏ trống email')
      }
      if (!password) {
        setErrorPassword('Không bỏ trống password')
      }
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder='Email...'
        onChangeText={onChangeEmail}
      />
      {!isvalidEmail && (
        <Text style={styles.error}>Sai định dạng email</Text>
      )}
      {errorEmail && (
        <Text style={styles.error}>{errorEmail}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder='Mật khẩu...'
        secureTextEntry
        onChangeText={onChangePassword}
      />
      {!isvalidPassword && (
        <Text style={styles.error}>Mật khẩu từ 6 ký tự</Text>
      )}
      {errorPassword && (
        <Text style={styles.error}>{errorPassword}</Text>
      )}
      <Button style={styles.btn} title={isLoading ? 'Đang xử lý' : 'Đăng nhập'} onPress={handlePressLogin} disabled={isLoading} />
      <Text style={styles.signupText}>Bạn chưa có tài khoản?</Text>
      <Button style={styles.btn} title='Đăng ký' onPress={handlePressSignUp} />
    </View>
  )


}

export default Login;