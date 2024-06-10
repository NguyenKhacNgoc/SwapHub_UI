
import { View, Text, Button, Image, Alert, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import * as ImagePicker from "expo-image-picker"

import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
        marginTop: 10
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 15,
    },
    imageWrapper: {
        position: "relative",
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 5,
        overflow: "hidden",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 5,
    },
    button: {
        marginTop: 10,
    },
});
function CreateNewReport({ route }) {
    const { post } = route.params
    const [selectedImg, setSelectedImg] = useState([])
    const [reason, setReason] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //allowsEditing: true, // cho phép chỉnh sửa ảnh sau khi chọn
            aspect: [4, 3], //tỉ lệ khung hình
            quality: 1, //chất lượng ảnh (0 đến 1)
            allowsMultipleSelection: true,

        })
        if (!result.canceled) {
            const maxSelectedImg = [...selectedImg, ...result.assets]
            if (maxSelectedImg.length > 5) {
                Alert.alert('Tối đa 5 ảnh')
                setSelectedImg(maxSelectedImg.slice(0, 5))
            }
            else {
                setSelectedImg(maxSelectedImg)
            }
        }
    }
    const onImgDel = (img) => {
        setSelectedImg(selectedImg.filter((i) => i !== img))
    }
    const handlePost = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken')
        const formData = new FormData()
        selectedImg.forEach((image, index) => {
            formData.append('images', { //đính kèm mỗi hình ảnh vào 1 FormData
                uri: image.uri, //đường dẫn tới hình ảnh trên thiết bị
                name: `image_${index + 1}.jpg`,
                type: 'image/jpg', //Loại của tệp
            })
        })
        formData.append('accused', parseInt(post.profile.id))
        formData.append('reason', reason)
        formData.append('postId', parseInt(post.id))
        

        
        try {
            setIsLoading(true)
            const response = await axios.post('http://khacngoc.ddns.net:8080/api/reportUser', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            ToastAndroid.show(response.data, ToastAndroid.SHORT)
            navigation.navigate('MainScreen')


        } catch (error) {
            console.error('Error', error)
            ToastAndroid.show(error.response.message, ToastAndroid.SHORT)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.label}>Thể loại</Text>
                <Picker
                    style={styles.input}
                    selectedValue={reason}
                    onValueChange={(itemValue, itemIndex) => {
                        setReason(itemValue)
                    }}
                >
                    <Picker.Item label="Chọn lý do" value={null} enabled={false} />
                    <Picker.Item label="Buôn bán chất cấm: ma tuý, chất gây nghiện" value="Buôn bán chất cấm: ma tuý, chất gây nghiện" />
                    <Picker.Item label="Buôn bán vũ khí, chất độc hại, nguy hiểm" value="Buôn bán vũ khí, chất độc hại, nguy hiểm" />
                    <Picker.Item label="Buôn bán người, bán dâm" value="Buôn bán người, bán dâm" />
                    <Picker.Item label="buôn bán hàng nhập lậu, không rõ nguồn gốc" value="buôn bán hàng nhập lậu, không rõ nguồn gốc" />
                    <Picker.Item label="buôn bán động vật hoang dã, quý hiếm..." value="buôn bán động vật hoang dã, quý hiếm..." />
                </Picker>
                <Text style={styles.label}>Hình ảnh</Text>
                <Button title="Chọn ảnh" onPress={pickImage} />
                <View style={styles.imageContainer}>
                    {selectedImg.map((img) => (
                        <TouchableOpacity
                            key={img.uri}
                            onPress={() => onImgDel(img)}
                            style={styles.imageWrapper}
                        >
                            <Image
                                source={{ uri: img.uri }}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <Button
                    title={isLoading ? 'Đang xử lý' : 'Gửi'}
                    onPress={handlePost}
                    disabled={isLoading}
                    style={styles.button}
                />
            </View>
        </ScrollView>

    );
}

export default CreateNewReport;
