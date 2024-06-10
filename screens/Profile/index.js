import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Button } from "react-native";
import FooterOnly from "../../layouts/FooterOnly";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

function Profile({ route }) {
  const navigation = useNavigation()
  const [in4, setIn4] = useState(null)
  const { profile } = route.params
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken')
        const response = await axios.get('http://khacngoc.ddns.net:8080/api/getprofile', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setIn4(response.data)

      } catch (error) {
        console.log(error)

      }
    }
    if (!profile) fetchData()
    else setIn4(profile)

  }, [in4])
  return (
    <FooterOnly>
      <View style={styles.container}>
        {in4 ? (
          <>
            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={faCircleUser} size={50} color="#007bff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{in4.fullName}</Text>
              {!profile && (
                <>
                  <TouchableOpacity onPress={() => { navigation.navigate('UpdateProfile') }}>
                    <Text style={styles.updateProfile}>Chỉnh sửa thông tin</Text>
                  </TouchableOpacity>
                </>
              )}
              <Text style={styles.userEmail}>Email: {in4.email}</Text>
              <Text style={styles.userDetail}>SĐT: {in4.phoneNumber}</Text>
              <Text style={styles.userDetail}>Địa chỉ: {in4.ward}, {in4.district}, {in4.province}</Text>
              <Text style={styles.userDetail}>Giới tính: {in4.sex}</Text>
              <Text style={styles.userDetail}>Ngày sinh: {new Date(in4.dateofbirth).getDate()} - {new Date(in4.dateofbirth).getMonth() + 1} - {new Date(in4.dateofbirth).getFullYear()}</Text>
            </View>

          </>
        ) : (
          <Button title="Đăng nhập lại" onPress={() => navigation.navigate('Login')} />
        )}
      </View>
    </FooterOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  userInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
  },
  userDetail: {
    fontSize: 16,
    marginVertical: 5,
    //marginRight: 20
  },
  updateProfile: {
    fontSize: 16,
    borderWidth: 1,
    padding: 5,
    borderColor: 'gray',
    marginTop: 5,
    marginBottom: 5
  }
});

export default Profile;
