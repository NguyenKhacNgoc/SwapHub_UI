import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ToastAndroid } from "react-native";
import { firebase } from "../../firebase/firebaseConfig"
import axios from "axios";
function Messages() {
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState(null)
    

    const fetchData = async () => {
        try {
            const messageRef = firebase.firestore().collection('message');
            
            // Lấy danh sách otherUserIds
            const userMessageSnapshot = await messageRef.where('senderID', '==', userId).get();
            const otherMessageSnapshot = await messageRef.where('receiverID', '==', userId).get();
            
            let otherUserIds = [];
            let lastMessages = [];
            
            // Duyệt qua danh sách tin nhắn gửi đi
            userMessageSnapshot.forEach(async (doc) => {
                const data = doc.data();
                const otherUserId = data.receiverID;
                if (!otherUserIds.includes(otherUserId)) {
                    otherUserIds.push(otherUserId);
                    const lastMessageSnapshot = await messageRef
                        .where('receiverID', '==', otherUserId)
                        .orderBy('sendAt', 'desc')
                        .limit(1)
                        .get();
                    lastMessages.push({
                        otherUserId,
                        lastMessage: lastMessageSnapshot.docs[0].data()
                    });
                }
            });
            
            // Duyệt qua danh sách tin nhắn nhận
            otherMessageSnapshot.forEach(async (doc) => {
                const data = doc.data();
                const otherUserId = data.senderID;
                if (!otherUserIds.includes(otherUserId)) {
                    otherUserIds.push(otherUserId);
                    const lastMessageSnapshot = await messageRef
                        .where('senderID', '==', otherUserId)
                        .orderBy('sendAt', 'desc')
                        .limit(1)
                        .get();
                    lastMessages.push({
                        otherUserId,
                        lastMessage: lastMessageSnapshot.docs[0].data()
                    });
                }
            });
            
            // Cập nhật state với danh sách tin nhắn mới nhất
            setMessages(lastMessages);
        } catch (error) {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        }
    };
    
    
    const getProfile = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken')
            const response = await axios.get('http://khacngoc.ddns.net:8080/api/getprofile', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (response.status === 200) {
                setUserId(response.data.id)

            }
        }
        catch (error) {
            console.log(error)
            ToastAndroid.show(error, ToastAndroid.SHORT)

        }
    }

    useEffect(() => {
        getProfile()
        if (userId !== null) {
            fetchData()
        }

    }, [userId])

    return (
        <View >
            <FlatList
                data={messages}
                keyExtractor={(item) => item.otherUserId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listItem}>
                        <View style={styles.avatar}>
                            <FontAwesomeIcon icon={faUserTie} size={35} />
                        </View>
                        <View>
                            <Text style={styles.userName}>{item.otherUserId}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
    },
});



export default Messages;