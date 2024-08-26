
import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Button, Alert, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
function UpdateProfile() {
    const [dateofbirth, setDateofbirth] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const [sex, setSex] = useState('')
    const [province, setProvince] = useState()
    const [district, setDistrict] = useState()
    const [ward, setWard] = useState()
    const [provincesData, setProvincesData] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState([])
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const onChangeDate = ({ type }, selectedDate) => {
        if (type === 'set') {
            setDateofbirth(selectedDate)
            setShowDatePicker(false)

        }
        else {
            setShowDatePicker(false)
        }
    }
    const fetchProvinces = async () => {
        try {
            const response = await axios.get('http://khacngoc.ddns.net:8080/admin/provinces')
            setProvincesData(response.data)

        } catch (error) {
            console.log(error)
            setProvincesData([])
        }

    }
    const handleSelectProvince = (text) => {
        setProvince(text)
        const selectedProvince = provincesData.find(pr => pr.name === text)
        if (selectedProvince) setSelectedProvince(selectedProvince.districts)
        else setSelectedProvince([])

    }
    const handleSelectDistrict = (text) => {
        setDistrict(text)
        const selectedWard = selectedProvince.find(w => w.name === text)
        if (selectedWard) setSelectedDistrict(selectedWard.wards)
        else setSelectedDistrict([])

    }
    const handleSelectWard = (text) => {
        setWard(text)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken')
                const response = await axios.get('http://khacngoc.ddns.net:8080/api/getprofile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                setEmail(response.data.email)
                setFullName(response.data.fullName)
                setPhoneNumber(response.data.phoneNumber)
                setProvince(response.data.province)
                setDistrict(response.data.district)
                setWard(response.data.ward)
                setSex(response.data.sex)
                setDateofbirth(new Date(response.data.dateofbirth))
                fetchProvinces()


            } catch (error) {
                Alert.alert('Đã có lỗi xảy ra')
                console.log(error)
            }
        }


        fetchData()


    }, [])

    const validatePhoneNumber = (pnb) => {
        const phoneNumberPattern = /^\d{10}$/
        setIsValidPhoneNumber(phoneNumberPattern.test(pnb))
    }
    const onChangeName = (text) => {
        setFullName(text)
    }
    const onChangeSDT = (text) => {
        setPhoneNumber(text)
        if (phoneNumber !== null) {
            validatePhoneNumber(text)
        }
        else {
            setIsValidPhoneNumber(true)
        }
    }

    const handleSubmit = async () => {
        if (isValidPhoneNumber && fullName && email && phoneNumber && province && district && ward && sex && dateofbirth) {
            try {
                setIsLoading(true)
                const profile = {
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    province: province,
                    district: district,
                    ward: ward,
                    sex: sex,
                    dateofbirth: dateofbirth

                }
                const accessToken = await AsyncStorage.getItem('accessToken')
                const response = await axios.put('http://khacngoc.ddns.net:8080/api/putprofile', profile, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }

                })
                Alert.alert('Thành công')
                navigation.navigate('Profile')


            } catch (error) {
                Alert.alert('Đã có lỗi xảy ra')
                console.log(error)
            }
            finally {
                setIsLoading(false)
            }
        }
        else {
            Alert.alert('Hãy bổ sung đầy đủ thông tin')
        }
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
                    <Text style={styles.header}>Đổi mật khẩu</Text>
                </TouchableOpacity>
                <Text style={styles.header}>Thông tin cá nhân</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Họ và tên </Text>
                    <TextInput style={styles.input} placeholder="Nhấp để nhập..." value={fullName} onChangeText={onChangeName} />
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.input}>{email}</Text>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput style={styles.input} placeholder="Nhấp để nhập..." value={phoneNumber} onChangeText={onChangeSDT} />
                    {!isValidPhoneNumber && (
                        <Text style={styles.error}>Sai định dạng số điện thoại</Text>
                    )}
                    <Text style={styles.label}>Địa chỉ</Text>
                    <RNPickerSelect
                        onValueChange={(value) => handleSelectProvince(value)}
                        placeholder={{ label: 'Tỉnh/Thành phố', value: null }}
                        value={province}
                        items={provincesData.map(province => ({
                            key: province.code,
                            label: province.name,
                            value: province.name
                        }))}

                    />
                    {/* Huyện/quận */}

                    <RNPickerSelect
                        style={styles.input}
                        placeholder={{ label: 'Huyện/Quận', value: null }}
                        onValueChange={(value) => handleSelectDistrict(value)}
                        value={district}
                        items={selectedProvince.map(district => ({
                            key: district.code,
                            label: district.name,
                            value: district.name
                        }))}
                    />
                    <RNPickerSelect
                        placeholder={{ label: 'Xã/Phường', value: null }}
                        onValueChange={(value) => handleSelectWard(value)}
                        value={ward}
                        items={selectedDistrict.map(ward => ({
                            key: ward.code,
                            label: ward.name,
                            value: ward.name
                        }))}
                    />

                    <Text style={styles.label}>Giới tính</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={sex}
                        onValueChange={(itemValue, itemIndex) => {
                            setSex(itemValue)
                        }}
                    >
                        <Picker.Item label="Chọn giới tính" value={null} enabled={false} />
                        <Picker.Item label="Nam" value='Nam' />
                        <Picker.Item label="Nữ" value='Nữ' />
                        <Picker.Item label="Khác" value='Khác' />


                    </Picker>
                    <Text style={styles.label}>Ngày sinh</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} >
                        {dateofbirth ? (
                            <Text style={styles.input}>{dateofbirth.getDate()} - {dateofbirth.getMonth() + 1} - {dateofbirth.getFullYear()}</Text>
                        ) : (
                            <Text style={styles.input}></Text>
                        )}
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            mode="date"
                            display="default"
                            value={dateofbirth ? dateofbirth : new Date()}
                            dateFormat="day month year"
                            locale="vi-VN"
                            onChange={onChangeDate}
                        />
                    )}
                    <Button title={isLoading ? 'Đang xử lý' : 'Lưu'} onPress={handleSubmit} disabled={isLoading} />


                </View>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff', // Màu nền của trang
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white', // Màu nền của Picker
        color: 'black', // Màu chữ trong Picker
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        marginBottom: 10


    },
});

export default UpdateProfile;
