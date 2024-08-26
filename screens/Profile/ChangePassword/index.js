import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useState } from "react";
import { Button, Text, TextInput, ToastAndroid, View, StyleSheet, TouchableOpacity } from "react-native";

function ChangePassword() {
    const [password, setPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [isvalidPassword, setIsvalidPassword] = useState(true)
    const [errorPassword, setErrorPassword] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()

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
    const onChangeNewPassword = (text) => {
        setNewPassword(text)
        setErrorPassword('')
        if (text.length < 6) {
            setIsvalidPassword(false)

        }
        else {
            setIsvalidPassword(true)
        }

    }
    const handlePressChangePassword = async () => {
        try {
            setIsLoading(true)
            const accessToken = await AsyncStorage.getItem('accessToken')
            const data = {
                password: password,
                newPassword: newPassword
            }
            const response = await axios.put('http://khacngoc.ddns.net:8080/api/changePassword', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (response.status === 200) {
                ToastAndroid.show('Đổi mật khẩu thành công!', ToastAndroid.SHORT)
                navigation.navigate('Profile')
            }

        } catch (error) {
            console.log(error)
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đổi mật khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder='Mật khẩu hiện tại...'
                secureTextEntry
                onChangeText={onChangePassword}
            />
            <TextInput
                style={styles.input}
                placeholder='Mật khẩu mới...'
                secureTextEntry
                onChangeText={onChangeNewPassword}
            />
            {!isvalidPassword && (
                <Text style={styles.error}>Mật khẩu từ 6 ký tự</Text>
            )}
            {errorPassword && (
                <Text style={styles.error}>{errorPassword}</Text>
            )}
            <Button style={styles.btn} title={isLoading ? 'Đang xử lý' : 'Đổi mật khẩu'} onPress={handlePressChangePassword} disabled={isLoading} />
            <TouchableOpacity onPress={() => {navigation.navigate('Profile')}}>
                <Text style={styles.signupText}>Thoát</Text>
            </TouchableOpacity>
        </View>
    )
}
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

export default ChangePassword