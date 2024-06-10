import { faHouse, faMagnifyingGlass, faMessage, faPenToSquare, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { Link } from "@react-navigation/native";

import { StyleSheet, View } from "react-native";
import { useAuth } from "../../Services/AuthContext";
import { useEffect } from "react";

function FooterOnly({ children }) {
  const { isLoggedIn, checkAuth } = useAuth()
  
  useEffect(() => {
    checkAuth()

  }, [isLoggedIn])
  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          {children}
        </View>
        <View style={styles.footer}>
          <Link to="/MainScreen">
            <FontAwesomeIcon icon={faHouse} size={30} color="#ff8c00" />
          </Link>
          <Link to={isLoggedIn ? '/CreatePost' : '/Login'}>
            <FontAwesomeIcon icon={faPenToSquare} size={30} color="#ff8c00" />
          </Link>
          <Link to='/Search'>
            <FontAwesomeIcon icon={faMagnifyingGlass} size={30} color="#ff8c00" />
          </Link>
          <Link to={isLoggedIn ? '/Messages' : '/Login'} >
            <FontAwesomeIcon icon={faMessage} size={30} color="#ff8c00" />
          </Link>

          <Link to="/Account">
            <FontAwesomeIcon icon={faUser} size={30} color="#ff8c00" />
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
  content: {
    flex: 1,

  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#DCDCDC",
    backgroundColor: "#ffffe0"

  },

});


export default FooterOnly;