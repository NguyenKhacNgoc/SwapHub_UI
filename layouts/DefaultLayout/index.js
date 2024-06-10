import { faBell, faHouse, faPenToSquare, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

function DefaultLayout({ children }) {
  const [isLogged, setIsLogged] = useState(false)
  const [isUpdateProfile, setIsUpdateProfile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken')
      if (accessToken) {
        try {
          const response = await axios.get('http://khacngoc.ddns.net:8080/api/checkUpdateProfile', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          if (response.data === 'OK') {
            setIsLogged(true)
            setIsUpdateProfile(true)
          }
          else if (response.data === 'Not OK') {
            setIsLogged(true)
            setIsUpdateProfile(false)
          }
        }
        catch (error) {
          console.log(error)
          setIsLogged(false)
          setIsUpdateProfile(false)
        }
      }
    }
    fetchData()

  })
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchInput} >
            <TextInput
              placeholder="Nhấp để tìm kiếm..."
            />
          </View>
          <View style={styles.notificationIcon}>
            <Link to="/Notifications">
              <FontAwesomeIcon icon={faBell} size={24} />
            </Link>
          </View>
        </View>
        <View style={styles.content}>
          {children}
        </View>
        <View style={styles.footer}>
          <Link to="/MainScreen">
            <FontAwesomeIcon icon={faHouse} size={30} />
          </Link>
          <Link to={!isLogged ? "/Login" : (!isUpdateProfile ? "/Profile" : "/CreatePost")} >
            <FontAwesomeIcon icon={faPenToSquare} size={30} />
          </Link>
          <Link to="/Account">
            <FontAwesomeIcon icon={faUser} size={30} />
          </Link>
        </View>

      </View>
    </>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    borderBottomWidth: 10,
    borderBottomColor: "#FF9966",
    backgroundColor: "#FF9966"
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f2f2f2",
    justifyContent: "center"
  },
  notificationIcon: {
    marginLeft: 10

  },
  content: {
    flex: 1,

  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#FF9966"
  },
  footerIcon: {
    color: "#333",
  },
});


export default DefaultLayout;