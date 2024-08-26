
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import ReactNativeModal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { StringeeServices } from '../../../../Services/stringee';
function SignUp() {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [verificationCode, setVerificationCode] = useState()
  const [isvalidEmail, setIsvalidEmail] = useState(true)
  const [isvalidPassword, setIsvalidPassword] = useState(true)
  const [fullName, setFulName] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true)
  const [sex, setSex] = useState()
  const [dateofbirth, setDateofbirth] = useState(new Date())
  const [errorEmail, setErrorEmail] = useState()
  const [errorPassword, setErrorPassword] = useState()
  const [errorFullName, setErrorFullName] = useState()
  const [errorphoneNumber, setErrorPhoneNumber] = useState()
  const [errorAddress, setErorAddress] = useState()
  const [errorSex, setErrorSex] = useState()
  const [errorDateofbirth, setErrorDateofbirth] = useState()
  const [randomNumber, setRandomNumber] = useState()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [errorVerificationCode, setErrorVerificationCode] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCode, setIsLoadingCode] = useState(false)
  const [termsChecked, SetTermsChecked] = useState(false)
  const [isModalVisibleTerms, SetIsModalVisibleTerms] = useState(false)
  const navigation = useNavigation()
  //bắt đầu
  const [provincesData, setProvincesData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState([])
  const [province, setProvince] = useState()
  const [district, setDistrisct] = useState()
  const [ward, setWard] = useState()
  const fetchProvinces = async () => {
    try {
      const response = await axios.get('http://khacngoc.ddns.net:8080/admin/provinces')
      setProvincesData(response.data)

    } catch (error) {
      console.log(error)
      setProvincesData([])
    }

  }
  useEffect(() => {
    fetchProvinces()

  }, [])
  const handleSelectProvince = (text) => {
    setErorAddress('')
    setProvince(text)
    const selectedProvince = provincesData.find(pr => pr.name === text)
    if (text) setSelectedProvince(selectedProvince.districts)
    else setSelectedProvince([])

  }
  const handleSelectDistrict = (text) => {
    setErorAddress('')
    setDistrisct(text)
    const selectedWard = selectedProvince.find(w => w.name === text)
    if (text) setSelectedDistrict(selectedWard.wards)
    else setSelectedDistrict([])

  }
  const handleSelectWard = (text) => {
    setErorAddress('')
    setWard(text)
  }

  const onChangeDate = ({ type }, selectedDate) => {
    if (type === 'set') {
      setDateofbirth(selectedDate)
      setShowDatePicker(false)
      setErrorDateofbirth('')

    }
    else {
      setShowDatePicker(false)
    }
  }
  const handlePressLogin = () => {
    navigation.navigate('Login')

  }
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
  const onchangeFullName = (text) => {
    setFulName(text)
    setErrorFullName('')

  }
  const validatePhoneNumber = (pnb) => {
    const phoneNumberPattern = /^\d{9}$/
    setIsValidPhoneNumber(phoneNumberPattern.test(pnb))
  }
  const onchangePhoneNumber = (text) => {
    setPhoneNumber(text)
    setErrorPhoneNumber('')
    if (phoneNumber !== null) {
      validatePhoneNumber(text)
    }
    else {
      setIsValidPhoneNumber(true)
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
  const onChangeVerificationCode = (text) => {
    setVerificationCode(text)
    setErrorVerificationCode('')
  }
  const handlePressGetVerificationCode = async () => {
    if (isvalidEmail && isvalidPassword && email && password && termsChecked && fullName && phoneNumber && province && district && ward && sex && dateofbirth) {
      try {
        setIsLoadingCode(true)
        const responseP = await axios.get(`http://khacngoc.ddns.net:8080/api/checkexistPNB?phoneNumber=${phoneNumber}`)
        if (responseP.data.result === true) {
          setErrorPhoneNumber('Số điện thoại này đã tồn tại')
          ToastAndroid.show('Số điện thoại này đã tồn tại', ToastAndroid.SHORT)
        }
        else {
          const token = StringeeServices.getBearerToken()
          const data = {
            "from": {
              "type": "external",
              "number": "842871074433",
              "alias": "STRINGEE Tester"
            },
            "to": [
              {
                "type": "external",
                "number": '84' + phoneNumber,
                "alias": "Khac Ngoc"
              }
            ],
            "actions": [
              {
                "action": "talk",
                "text": "Mã xác thực của bạn là " + formattedRandomNum
              }
            ]
          }
          const response = await axios.post(' https://api.stringee.com/v1/call2/callout', data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          if (response.status === 200) {

            ToastAndroid.show('Gửi mã xác thực thành công', ToastAndroid.SHORT)

          }
          console.log(response.data)
          // Tạo số ngẫu nhiên từ 0 đến 999999 (6 chữ số)
          const randomNum = Math.floor(Math.random() * 1000000);
          // Định dạng số ngẫu nhiên thành chuỗi với 6 chữ số
          const formattedRandomNum = String(randomNum).padStart(6, '0');
          setRandomNumber(formattedRandomNum)
          console.log(randomNumber)
          console.log(formattedRandomNum)

        }
      } catch (error) {

        console.log(error)
        ToastAndroid.show('Lỗi máy chủ, vui lòng thử lại sau', ToastAndroid.SHORT)


      }
      finally {
        setIsLoadingCode(false)
      }
    }
    else {
      if (!email) {
        setErrorEmail('Hãy nhập email')
      }
      if (!password) {
        setErrorPassword('Hãy nhập password')
      }
      if (!fullName) {
        setErrorFullName('Hãy nhập tên')
      }
      if (!phoneNumber) {
        setErrorPhoneNumber('Hãy nhập SĐT')
      }
      if (!province || !district || !ward) {
        setErorAddress('Hãy nhập đủ địa chỉ')
      }
      if (!sex) {
        setErrorSex('Hãy chọn giới tính')
      }
      if (!dateofbirth) {
        setErrorDateofbirth('Hãy nhập ngày sinh ')
      }

    }
  }
  const handlePressSignUp = async () => {
    if (isvalidEmail && isvalidPassword && email && password && termsChecked && fullName && phoneNumber && province && district && ward && sex && dateofbirth && verificationCode) {
      const user = {
        email: email,
        password: password,
        verificationCode: verificationCode,
        fullName: fullName,
        phoneNumber: phoneNumber,
        province: province,
        district: district,
        ward: ward,
        sex: sex,
        dateofbirth: dateofbirth,
      }
      console.log(verificationCode)
      console.log(randomNumber)
      if (randomNumber === verificationCode) {

        try {
          setIsLoading(true)
          await axios.post('http://khacngoc.ddns.net:8080/api/signup', user)
          Alert.alert('Đăng ký tài khoản thành công')
          navigation.navigate('Login')



        } catch (error) {
          if (error.message === 'Network Error') {
            ToastAndroid.show('Lỗi máy chủ, vui lòng thử lại sau', ToastAndroid.SHORT)
          }
          else {
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
          }
        }
        finally {
          setIsLoading(false)
        }
      }
      else setErrorVerificationCode('Bạn đã nhập sai mã xác thực!')

    }
    else {
      if (!email) {
        setErrorEmail('Hãy nhập email')
      }
      if (!password) {
        setErrorPassword('Hãy nhập password')
      }
      if (!fullName) {
        setErrorFullName('Hãy nhập tên')
      }
      if (!phoneNumber) {
        setErrorPhoneNumber('Hãy nhập SĐT')
      }
      if (!province || !district || !ward) {
        setErorAddress('Hãy nhập đầy đủ địa chỉ')
      }
      if (!sex) {
        setErrorSex('Hãy chọn giới tính')
      }
      if (!dateofbirth) {
        setErrorDateofbirth('Hãy nhập ngày sinh ')
      }
      if (!verificationCode) {
        setErrorVerificationCode('Hãy nhập mã xác minh')
      }
    }
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký</Text>
        <TextInput
          style={styles.input}
          placeholder='Email...'
          value={email}
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
          placeholder='Họ và tên...'
          value={fullName}
          onChangeText={onchangeFullName}

        />
        {errorFullName && (
          <Text style={styles.error}>{errorFullName}</Text>
        )}
        <View style={styles.inputContainerPNB}>
          <Text style={styles.countryCode}>+84</Text>
          <TextInput
            style={styles.inputPNB}
            placeholder='Số điện thoại...'
            value={phoneNumber}
            keyboardType='numeric'
            onChangeText={onchangePhoneNumber}

          />
        </View>
        {!isValidPhoneNumber && (
          <Text style={styles.error}>Sai định dạng SĐT</Text>
        )}
        {errorphoneNumber && (
          <Text style={styles.error}>{errorphoneNumber}</Text>
        )}
        {/* Tỉnh/Thành phố */}
        <RNPickerSelect
          onValueChange={(value) => handleSelectProvince(value)}
          placeholder={{ label: 'Tỉnh/Thành phố', value: null }}
          items={provincesData.map(province => ({
            key: province.code,
            label: province.name,
            value: province.name
          }))}

        />
        {/* Huyện/quận */}
        <RNPickerSelect
          placeholder={{ label: 'Huyện/Quận', value: null }}
          onValueChange={(value) => handleSelectDistrict(value)}
          items={selectedProvince.map(district => ({
            key: district.code,
            label: district.name,
            value: district.name
          }))}
        />
        <RNPickerSelect
          placeholder={{ label: 'Xã/Phường', value: null }}
          onValueChange={(value) => handleSelectWard(value)}
          items={selectedDistrict.map(ward => ({
            key: ward.code,
            label: ward.name,
            value: ward.name
          }))}
        />

        {errorAddress && (
          <Text style={styles.error}>{errorAddress}</Text>
        )}
        <Picker
          style={styles.input}
          selectedValue={sex}
          onValueChange={(itemValue, itemIndex) => {
            setSex(itemValue)
            setErrorSex('')
          }}
        >
          <Picker.Item label="Chọn giới tính" value={null} enabled={false} />
          <Picker.Item label="Nam" value='Nam' />
          <Picker.Item label="Nữ" value='Nữ' />
          <Picker.Item label="Khác" value='Khác' />
        </Picker>
        {errorSex && (
          <Text style={styles.error}>{errorSex}</Text>
        )}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { justifyContent: 'center' }]} >
          {dateofbirth ? (
            <Text>{dateofbirth.getDate()} - {dateofbirth.getMonth() + 1} - {dateofbirth.getFullYear()}</Text>
          ) : (
            <Text>Ngày sinh</Text>
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
        {errorDateofbirth && (
          <Text style={styles.error}>{errorDateofbirth}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder='Mật khẩu...'
          value={password}
          secureTextEntry
          onChangeText={onChangePassword}
        />
        {!isvalidPassword && (
          <Text style={styles.error}>Mật khẩu từ 6 ký tự</Text>
        )}
        {errorPassword && (
          <Text style={styles.error}>{errorPassword}</Text>
        )}

        <View style={styles.verificationContainer}>
          <TextInput
            style={styles.verificationInput}
            placeholder='Mã xác minh...'
            keyboardType='numeric'
            value={verificationCode}
            onChangeText={onChangeVerificationCode}
          />
          <TouchableOpacity onPress={handlePressGetVerificationCode} disabled={isLoadingCode} >
            <View style={styles.verificationButton}>
              {isLoadingCode ? (

                <Text style={styles.verificationButtonText}>Đang gửi</Text>
              ) : (
                <Text style={styles.verificationButtonText}>Nhận mã</Text>
              )}

            </View>
          </TouchableOpacity>
        </View>
        {errorVerificationCode && (
          <Text style={styles.error}>{errorVerificationCode}</Text>
        )}
        <View style={styles.checkbox}>
          <BouncyCheckbox
            size={25}
            fillColor='red'
            unfillColor='white'
            text='Chấp nhận điều khoản'
            iconStyle={{ borderColor: "red" }}
            innerIconStyle={{ borderWidth: 2 }}
            isChecked={termsChecked}
            onPress={() => SetTermsChecked(!termsChecked)}

          />
        </View>
        <TouchableOpacity onPress={() => SetIsModalVisibleTerms(!isModalVisibleTerms)}>
          <View style={styles.terms}>
            <Text>Để xem điều khoản, vui lòng nhấp vào đây</Text>
          </View>
        </TouchableOpacity>


        <Button style={styles.btn} title={isLoading ? 'Đang xử lý' : 'Đăng ký'} onPress={handlePressSignUp} disabled={isLoading} />
        <Text style={styles.signupText}>Bạn đã có tài khoản?</Text>
        <Button style={styles.btn} title='Đăng nhập' onPress={handlePressLogin} />

        <ReactNativeModal
          isVisible={isModalVisibleTerms}
          backdropOpacity={0.7}
          onBackdropPress={() => SetIsModalVisibleTerms(!isModalVisibleTerms)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Để có thể tham gia vào cộng đồng của chúng tôi, bạn cần chấp thuận các điều khoản như sau:
            </Text>
            <Text style={styles.listItem}>1. Không buôn bán chất cấm như: ma tuý, chất gây nghiện</Text>
            <Text style={styles.listItem}>2. Không buôn bán vũ khí, chất độc hại, nguy hiểm</Text>
            <Text style={styles.listItem}>3. Cấm các hành vi buôn bán người, bán dâm</Text>
            <Text style={styles.listItem}>4. Cấm các trường hợp buôn bán hàng nhập lậu/không rõ nguồn gốc</Text>
            <Text style={styles.listItem}>5. Cấm buôn bán động vật hoang dã, quý hiếm...</Text>
          </View>
        </ReactNativeModal>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 40,
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
  inputContainerPNB: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333',
  },
  countryCode: {
    marginRight: 10,
    fontSize: 16,
    color: 'black',
  },
  inputPNB: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },

  checkbox: {
    width: '100%',
    height: 40,
    //paddingHorizontal: 10,
    //marginBottom: 20,

  },
  terms: {
    width: '100%',
    height: 40,
    marginBottom: 20,

  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Cân đối nút và input
    marginBottom: 20
  },
  verificationInput: {
    flex: 1,
    height: 40,
    borderColor: '#B0B0B0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#333',
  },
  verificationButton: {
    backgroundColor: 'orange',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  verificationButtonText: {
    color: '#fff',
    fontSize: 16,
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
  error: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10


  }
});
export default SignUp;