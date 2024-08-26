import React, { useEffect, useState } from "react";
import {  Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid } from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faCommentSms, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import SwiperFlatList from "react-native-swiper-flatlist";
import Modal from "react-native-modal";
import PostMenu from "./PostMenu";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAuth } from "../../Services/AuthContext";

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    height: 250,
  },
  swiperContainer: {
    flex: 1,
  },
  swiperImage: {
    height: height * 0.5,
    width,
    resizeMode: 'cover'
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    margin: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    margin: 16

  },
  price: {
    color: "#E91E63",
    fontSize: 24,
    fontWeight: "bold",

  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
  },
  userName: {
    marginLeft: 16,
    fontSize: 18,
  },
  descriptionContainer: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 16,
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
  },
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,

  },
  phoneNumber: {
    marginLeft: 16,
    fontSize: 18,

  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,

  },
  message: {
    marginLeft: 16,
    fontSize: 18,

  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  address: {
    marginLeft: 16,
    fontSize: 18,
    marginRight: 30
  },

  // Thêm phần modal styles
  modalImage: {
    height: height * 0.7, // Chiều cao của ảnh trong modal
    width: width,   // Chiều rộng của ảnh trong modal
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  closeButton: {
    alignSelf: 'center',

  },
  closeButtonText: {
    color: "#E91E63",
    fontSize: 18,
  },
  //style modal sua bai viet
  putcontainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff'
  },
  putlabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textinput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  btn: {
    marginBottom: 10
  }
});

function DetailPost({ route }) {
  const { isLoggedIn, checkAuth } = useAuth()
  const { post } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const navigation = useNavigation()
  const [isModalVisibleUpdatePost, setModalVisibleUpdatePost] = useState(false)
  const [title, setTitle] = useState()
  const [errorTitle, setErrorTitle] = useState()
  const [description, setDescription] = useState()
  const [errorDescription, setErrorDescription] = useState()
  const [price, setPrice] = useState()
  const [errorPrice, setErrorPrice] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isLikedPost, setIsLikePost] = useState(false)
  const [numberOfLike, setNumberOfLike] = useState(0)
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };



  const openImageModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    toggleModal();
  };
  const toggleModalUpdatePost = () => {
    setModalVisibleUpdatePost(!isModalVisibleUpdatePost)
  }
  const handlePutPost = async () => {
    //Phải kiểm tra xem bạn có phải chủ bài viết hay không thì mới toggle modal sửa bài viết
    //Mai làm nhé
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      const data = {
        id: post.id
      }
      const response = await axios.post('http://khacngoc.ddns.net:8080/api/checkpost', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (response.data === 'OK') {
        toggleModalUpdatePost()
      }
      else if (response.data === 'Not OK') {
        ToastAndroid.show('Không thể sửa bài viết của người khác', ToastAndroid.SHORT)
      }
      else {
        ToastAndroid.show('Đã có lỗi ngoài mong muốn, chúng tôi đang cố gắng sửa nó', ToastAndroid.SHORT)
      }
    }
    catch (error) {
      console.log(error)
      ToastAndroid.show('Đã có lỗi xảy ra, chúng tôi đang cố gắng sửa nó', ToastAndroid.SHORT)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PostMenu onReport={handleReport} onHide={handleHidePost} />

      )
    })
    checklikedPost()
    checkAuth()
    getNumberOfLike()

  }, [navigation, numberOfLike])

  const getNumberOfLike = async () => {
    try {
      const response = await axios.get(`http://khacngoc.ddns.net:8080/api/view/getNumberOfLike?postID=${post.id}`)
      setNumberOfLike(response.data.length)

    } catch (error) {
      console.log(error)
    }
  }
  const handleDelPost = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      const data = {
        id: post.id
      }
      const response = await axios.delete('http://khacngoc.ddns.net:8080/api/deletePost', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: data
      })

      ToastAndroid.show(response.data, ToastAndroid.SHORT)
      navigation.navigate('MainScreen')

    } catch (error) {
      console.log(error)
      if (error.response.data) ToastAndroid.show(error.response.data, ToastAndroid.SHORT)
      else ToastAndroid.show('Đã có lỗi phía máy chủ, chúng tôi đang cố gắng khắc phục', ToastAndroid.SHORT)


    }
  }
  const handleReport = () => {
    if (isLoggedIn) navigation.navigate('NewReport', { post: post })
    else ToastAndroid.show('Xác thực người dùng thất bại', ToastAndroid.SHORT)

  }
  const handleHidePost = async () => {
    if (isLoggedIn) {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken')
        const data = {
          id: post.id
        }
        const response = await axios.put('http://khacngoc.ddns.net:8080/api/hidePost', data, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        })

        ToastAndroid.show('Thành công', ToastAndroid.SHORT)
        navigation.navigate('MainScreen')

      } catch (error) {
        console.log(error)
        if (error.response.data) ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
        else ToastAndroid.show('Đã có lỗi phía máy chủ, chúng tôi đang cố gắng khắc phục', ToastAndroid.SHORT)


      }
    }
    else ToastAndroid.show('Xác thực người dùng thất bại', ToastAndroid.SHORT)
  }
  const onChangeTitle = (title) => {
    setTitle(title)
    setErrorTitle('')
  }
  const onChangeDescription = (description) => {
    setDescription(description)
    setErrorDescription('')
  }
  const onChangePrice = (price) => {
    setPrice(price)
    setErrorPrice('')
  }
  const handleSubmitPut = async () => {
    setIsLoading(true)
    if (title && description && price) {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken')
        const data = {
          id: post.id,
          title: title,
          description: description,
          price: price
        }
        const response = await axios.put('http://khacngoc.ddns.net:8080/api/putPost', data, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        ToastAndroid.show(response.data, ToastAndroid.SHORT)
        navigation.goBack()

      } catch (error) {
        console.log(error)
        ToastAndroid.show('Đã có lỗi xảy ra, chúng tôi đang cố gắng sửa nó', ToastAndroid.SHORT)
      }
      finally {
        setIsLoading(false)

      }
    }
    else {
      if (!title) {
        setErrorTitle('Không bỏ trống')
        setIsLoading(false)
      }
      if (!description) {
        setErrorDescription('Không bỏ trống')
        setIsLoading(false)
      }
      if (!price) {
        setErrorPrice('Không bỏ trống')
        setIsLoading(false)
      }
      ToastAndroid.show('Nhập đầy đủ thông tin', ToastAndroid.SHORT)
    }

  }

  const checklikedPost = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      const response = await axios.get(`http://khacngoc.ddns.net:8080/api/checklikedPost?postID=${post.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (response.data.result === true) setIsLikePost(true)
      else if (response.data.result === false) setIsLikePost(false)
      else if(response.status === 404) ToastAndroid.show('Bài viết không tồn tại', ToastAndroid.SHORT)

    }
    catch (error) {
      console.log(error)

    }
  }
  const handleLikedPost = async () => {
    try {

      const accessToken = await AsyncStorage.getItem('accessToken')
      const response = await axios.post('http://khacngoc.ddns.net:8080/api/post/like', {
        id: post.id
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (response.status === 200) {
        setIsLikePost(!isLikedPost)
        getNumberOfLike()
      }
    }
    catch (error) {
      ToastAndroid.show('Đã có lỗi xảy ra', ToastAndroid.SHORT)
      navigation.navigate('Login')
    }
  }


  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <SwiperFlatList
            autoplay
            autoplayDelay={3}
            //index={1}
            autoplayLoop
            data={post.images}
            renderItem={({ item }) => (
              <View style={styles.swiperContainer}>
                <TouchableOpacity onPress={() => openImageModal(item.secureUrl)}>
                  <Image source={{ uri: item.secureUrl }} style={styles.swiperImage} />
                </TouchableOpacity>
              </View>
            )}
            showPagination />

        </View>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{post.price} đ</Text>
          {isLikedPost ? (
            <TouchableOpacity onPress={handleLikedPost}>
              <Text style={{ fontSize: 16, borderRadius: 18, borderColor: 'red', borderWidth: 1, padding: 5, color: 'red' }}>Bỏ thích</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLikedPost}>
              <Text style={{ fontSize: 16, borderRadius: 18, borderColor: 'red', borderWidth: 1, padding: 5, color: 'red' }}>Thích</Text>
            </TouchableOpacity>
          )}

        </View>
        <View style={styles.userContainer}>
          <FontAwesomeIcon icon={faCircleUser} size={50} color="green" />
          <TouchableOpacity
            onPress={() => { navigation.navigate('Profile', { profile: post.profile }) }}
          >

            <Text style={styles.userName}>{post.profile.fullName}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{post.description}</Text>

        </View>

        <View style={styles.phoneNumberContainer}>
          <FontAwesomeIcon icon={faPhone} size={30} color="green" />
          <Text style={styles.phoneNumber}>{post.profile.phoneNumber}</Text>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate(isLoggedIn ? 'Chat' : 'Login', { profile: post.profile }) }}>
          <View style={styles.messageContainer}>
            <FontAwesomeIcon icon={faCommentSms} size={30} color="green" />
            <Text style={styles.message}>Nhắn tin cho {post.profile.fullName}</Text>

          </View>

        </TouchableOpacity>

        <View style={styles.addressContainer}>
          <FontAwesomeIcon icon={faLocationDot} size={30} color="#800000" />
          <Text style={styles.address}>{post.profile.ward}, {post.profile.district}, {post.profile.province}</Text>
        </View>

      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.7}
        onBackdropPress={toggleModal}
      >
        <View>
          <Image source={{ uri: selectedImageUrl }} style={styles.modalImage} />
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* <Modal
        isVisible={isModalVisibleUpdatePost}
        backdropOpacity={0.7}
        onBackdropPress={toggleModalUpdatePost}
      >
        <View style={styles.putcontainer}>
          <Text style={styles.putlabel}>Tiêu đề</Text>
          <TextInput style={styles.textinput} value={title} placeholder="Nhấp vào để nhập..." onChangeText={(t) => { onChangeTitle(t) }} />
          {errorTitle && (<Text style={{ color: 'red' }}>{errorTitle}</Text>)}
          <Text style={styles.putlabel}>Mô tả</Text>
          <TextInput style={styles.textinput} value={description} multiline placeholder="Nhấp vào để nhập..." onChangeText={(t) => { onChangeDescription(t) }} />
          {errorDescription && (<Text style={{ color: 'red' }}>{errorDescription}</Text>)}
          <Text style={styles.putlabel}>Giá bán</Text>
          <TextInput style={styles.textinput} value={price} keyboardType="numeric" onChangeText={(t) => { onChangePrice(t) }} />
          {errorPrice && (<Text style={{ color: 'red' }}>{errorPrice}</Text>)}
          <Button title={isLoading ? 'Đang xử lý' : 'Lưu'} onPress={handleSubmitPut} disabled={isLoading} />
          <Button title="Huỷ" onPress={() => { setModalVisibleUpdatePost(!isModalVisibleUpdatePost) }} />
        </View>
      </Modal> */}


    </>

  );
}

export default DetailPost;
