import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FooterOnly from '../../layouts/FooterOnly'
import { Link } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark, faCircleUser, faFile, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../Services/AuthContext';

function AccountScreen() {
    const { isLoggedIn, logout } = useAuth()

    const handlePressLogout = () => {
        logout()
    }
    return (
        <FooterOnly>
            <View style={styles.general}>
                <View>
                    <FontAwesomeIcon icon={faCircleUser} size={50} color='green' />
                </View>
                {isLoggedIn ? (
                    <View style={styles.link}>
                        <Link to="/Profile">Nhấn để xem thông tin tài khoản
                        </Link>
                    </View>

                ) : (
                    <View style={styles.link}>
                        <Link to="/Login">Đăng nhập
                        </Link>
                    </View>
                )}

            </View>
            {isLoggedIn && (
                <>


                    <View style={styles.general}>
                        <View>
                            <FontAwesomeIcon icon={faFile} size={45} color='blue' />
                        </View>
                        <View style={styles.link}>
                            <Link to="/MyPosts">Bài viết của tôi
                            </Link>
                        </View>

                    </View>
                    <View style={styles.general}>
                        <View>
                            <FontAwesomeIcon icon={faBookmark} size={45} color='#E91E63' />
                        </View>
                        <View style={styles.link}>
                            <Link to="/FavoritePost">Bài viết đã lưu
                            </Link>
                        </View>

                    </View>
                    <View style={styles.general}>
                        <View>
                            <FontAwesomeIcon icon={faRightFromBracket} size={45} />
                        </View>
                        <View style={styles.link}>
                            <TouchableOpacity onPress={handlePressLogout}>
                                <Text>Đăng xuất
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </>
            )
            }
        </FooterOnly >

    );
}
const styles = StyleSheet.create({
    general: {
        marginTop: 10,
        flexDirection: "row",
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,


    },

    link: {
        paddingLeft: 20,
        justifyContent: "center"
    }

})

export default AccountScreen